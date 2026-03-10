'use server';

/**
 * 重置密码操作
 * @module lib/auth/actions/reset-password
 * @description 通过邮件链接重置密码
 */

import { createClient } from '@/lib/supabase/server';
import { validatePassword } from '@/lib/security/passwordPolicy';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { mapSupabaseError } from '../errorMessages';
import type { AuthResult } from './types';

/**
 * 重置密码
 * @param formData 表单数据
 * @returns 重置结果
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // 完整密码策略验证
  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return { success: false, error: pwdCheck.message };
  }

  if (password !== confirmPassword) {
    return { success: false, error: '两次输入的密码不一致' };
  }

  try {
    const supabase = await createClient();

    // 获取用户用于限流
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: '链接已过期，请重新申请' };
    }

    // 限流保护
    const rateLimit = checkServerRateLimit(`reset:${user.id}`, {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1小时
    });
    if (!rateLimit.allowed) {
      return { success: false, error: '尝试次数过多，请1小时后再试' };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      const friendlyError = mapSupabaseError(error.message, 'reset-password');
      return {
        success: false,
        error: friendlyError,
      };
    }

    return { success: true, message: '密码重置成功，请使用新密码登录' };
  } catch (err) {
    console.error('重置密码失败:', err);
    return { success: false, error: '重置失败，请稍后重试' };
  }
}
