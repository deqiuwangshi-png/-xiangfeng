'use server';

/**
 * 登录操作
 * @module lib/auth/actions/login
 * @description 用户登录认证
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit, resetServerRateLimit, getClientIp } from '@/lib/security/rateLimitServer';
import { LOGIN_MESSAGES, mapSupabaseError } from '@/lib/messages';
import { sanitizeRedirect } from '../redir';
import { activateAccount } from '@/lib/user/deactivateAccount';
import { recordLoginHistory } from '@/lib/auth/loginHistory';
import type { AuthResult } from './types';

/**
 * 登录输入验证
 */
const loginSchema = z.object({
  email: z.email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

/**
 * 用户登录
 * @param formData 表单数据
 * @returns 登录结果
 *
 * @安全修复 S-03: 使用 IP + 邮箱组合限流，防止恶意锁账号
 * 攻击者无法通过伪造请求锁定其他用户的账号
 */
export async function login(formData: FormData): Promise<AuthResult & { redirectTo?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectRaw = formData.get('redirectTo');
  const redirectTo = sanitizeRedirect(redirectRaw, '/home');

  // 输入验证
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || LOGIN_MESSAGES.DEFAULT_ERROR };
  }

  // 获取客户端 IP
  const headersList = await headers();
  const clientIp = getClientIp(headersList);

  /**
   * 服务端限流检查 - 使用 IP + 邮箱组合
   * @安全说明
   * - 使用 `${ip}:${email}` 作为限流标识符
   * - 攻击者无法通过伪造请求锁定其他用户的账号
   * - 同一 IP 对不同邮箱有独立的限流计数
   */
  const rateLimitKey = `${clientIp}:${email}`;
  const rateLimit = await checkServerRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
    return { success: false, error: LOGIN_MESSAGES.RATE_LIMITED.replace('{minutes}', String(minutes)) };
  }

  try {
    const supabase = await createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      const friendlyError = mapSupabaseError(signInError.message, 'login');
      return { success: false, error: friendlyError || LOGIN_MESSAGES.INVALID_CREDENTIALS };
    }

    {/* 登录成功，异步处理非关键操作 */}
    if (signInData.user) {
      // 异步激活账户（如果之前被停用）
      activateAccount(signInData.user.id).catch(err => console.error('激活账户失败:', err));
      
      // 异步记录登录历史
      recordLoginHistory(signInData.user.id, 'password', true, false).catch(err => console.error('记录登录历史失败:', err));
    }

    // 登录成功，重置限流
    await resetServerRateLimit(rateLimitKey);
    revalidatePath('/', 'layout');

    return { success: true, redirectTo };
  } catch (err) {
    console.error('登录失败:', err);
    return { success: false, error: LOGIN_MESSAGES.DEFAULT_ERROR };
  }
}
