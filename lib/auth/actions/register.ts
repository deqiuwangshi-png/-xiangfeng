'use server';

/**
 * 注册操作
 * @module lib/auth/actions/register
 * @description 用户注册
 */

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { REGISTER_MESSAGES } from '@/lib/messages';
import { isAllowedEmail } from '../utils';
import type { AuthResult } from './types';

/**
 * 注册输入验证
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

const registerSchema = z.object({
  email: z.email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8位'),
  username: z.string()
    .min(2, '用户名至少需要2位')
    .max(20, '用户名最多20位')
    .regex(USERNAME_REGEX, '用户名只能包含字母、数字、下划线和中文'),
});

/**
 * 用户注册
 * @param formData 表单数据
 * @returns 注册结果
 */
export async function register(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  const validation = registerSchema.safeParse({ email, password, username });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || REGISTER_MESSAGES.DEFAULT_ERROR };
  }

  // 验证邮箱域名白名单
  if (!isAllowedEmail(email)) {
    return { success: false, error: REGISTER_MESSAGES.EMAIL_NOT_ALLOWED };
  }

  const supabase = await createClient();

  // 检查用户名是否已存在
  const { data: existingUser, error: checkError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  if (checkError) {
    console.error('检查用户名失败:', checkError);
    return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
  }

  if (existingUser) {
    return { success: false, error: REGISTER_MESSAGES.USERNAME_ALREADY_TAKEN };
  }

  // 注册限流（更严格）
  const rateLimit = checkServerRateLimit(`register:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { success: false, error: REGISTER_MESSAGES.RATE_LIMITED };
  }

  try {
    // 先生成用户获取user.id，再用user.id生成头像URL
    // 确保头像seed与用户ID绑定，实现全局一致性
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`,
      },
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        return { success: false, error: REGISTER_MESSAGES.EMAIL_ALREADY_REGISTERED };
      }
      if (signUpError.message.includes('Error sending confirmation email')) {
        return { success: false, error: REGISTER_MESSAGES.EMAIL_SEND_FAILED };
      }
      return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
    }

    if (!signUpData.user) {
      return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
    }
    return { success: true, message: REGISTER_MESSAGES.SUCCESS };
  } catch (err) {
    console.error('注册失败:', err);
    return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
  }
}
