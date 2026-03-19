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

const FORGOT_PASSWORD_SUCCESS_MESSAGE = '如果该邮箱存在，我们会向您发送重置密码邮件，请检查邮箱';

/**
 * 忘记密码
 * @param formData 表单数据
 * @returns 发送结果
 */
export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return { success: true, message: FORGOT_PASSWORD_SUCCESS_MESSAGE };
  }

  const rateLimit = checkServerRateLimit(`forgot:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { success: true, message: FORGOT_PASSWORD_SUCCESS_MESSAGE };
  }

  try {
    const supabase = await createClient();
    // @修复 U-05: 确保 redirectTo 使用正确的完整 URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.xiangfeng.site';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    if (error) {
      console.error('发送重置邮件失败:', error);
    }

    return { success: true, message: FORGOT_PASSWORD_SUCCESS_MESSAGE };
  } catch (err) {
    console.error('发送重置邮件失败:', err);
    return { success: true, message: FORGOT_PASSWORD_SUCCESS_MESSAGE };
  }
}
