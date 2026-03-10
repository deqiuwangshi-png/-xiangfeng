'use server';

/**
 * 登录操作
 * @module lib/auth/actions/login
 * @description 用户登录认证
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit, resetServerRateLimit } from '@/lib/security/rateLimitServer';
import { LOGIN_ERRORS, mapSupabaseError } from '../errorMessages';
import { sanitizeRedirect } from '../redir';
import type { AuthResult } from './types';

/**
 * 登录输入验证
 */
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

/**
 * 用户登录
 * @param formData 表单数据
 * @returns 登录结果
 */
export async function login(formData: FormData): Promise<AuthResult & { redirectTo?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectRaw = formData.get('redirectTo');
  const redirectTo = sanitizeRedirect(redirectRaw, '/home');

  // 输入验证
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || '输入无效' };
  }

  // 服务端限流检查
  const rateLimit = checkServerRateLimit(email);
  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
    return { success: false, error: `尝试次数过多，请 ${minutes} 分钟后再试` };
  }

  try {
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      const friendlyError = mapSupabaseError(signInError.message, 'login');
      return { success: false, error: friendlyError || LOGIN_ERRORS.INVALID_CREDENTIALS };
    }

    // 登录成功，重置限流
    resetServerRateLimit(email);
    revalidatePath('/', 'layout');

    return { success: true, redirectTo };
  } catch (err) {
    console.error('登录失败:', err);
    return { success: false, error: '登录失败，请稍后重试' };
  }
}
