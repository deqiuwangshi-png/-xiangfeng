'use server';

/**
 * 忘记密码操作
 * @module lib/auth/actions/forgot-password
 * @description 发送密码重置邮件
 */

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import type { AuthResult } from './types';

/**
 * 忘记密码
 * @param formData 表单数据
 * @returns 发送结果
 */
export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return { success: false, error: '请输入有效的邮箱地址' };
  }

  // 限流：每小时最多3次
  const rateLimit = checkServerRateLimit(`forgot:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { success: false, error: '发送次数过多，请1小时后再试' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: '重置密码邮件已发送，请检查邮箱' };
  } catch (err) {
    console.error('发送重置邮件失败:', err);
    return { success: false, error: '发送失败，请稍后重试' };
  }
}
