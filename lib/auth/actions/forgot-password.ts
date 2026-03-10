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
    // 对用户只返回统一成功提示，避免暴露邮箱存在与否
    return {
      success: true,
      message: '如果该邮箱存在，我们会向您发送重置密码邮件，请检查邮箱',
    };
  }

  // 限流：每小时最多3次
  const rateLimit = checkServerRateLimit(`forgot:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    // 被限流时也返回统一提示，不暴露内部状态
    return {
      success: true,
      message: '如果该邮箱存在，我们会向您发送重置密码邮件，请稍后再检查邮箱',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password`,
    });

    if (error) {
      // 记录内部错误日志，但对用户保持统一提示
      console.error('发送重置邮件失败:', error);
    }

    return {
      success: true,
      message: '如果该邮箱存在，我们会向您发送重置密码邮件，请检查邮箱',
    };
  } catch (err) {
    console.error('发送重置邮件失败:', err);
    return {
      success: true,
      message: '如果该邮箱存在，我们会向您发送重置密码邮件，请稍后再检查邮箱',
    };
  }
}
