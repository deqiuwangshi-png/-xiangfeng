'use server';

/**
 * 重置密码操作
 * @module lib/auth/actions/reset-password
 * @description 通过邮件链接重置密码
 */

import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { mapSupabaseError } from '../errorMessages';
import { validatePasswordMatch, getCurrentUser } from '../utils';
import type { AuthResult } from './types';

/**
 * 重置密码
 * @param formData 表单数据
 * @returns 重置结果
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const validation = validatePasswordMatch(password, confirmPassword);
  if (validation) {
    return validation;
  }

  try {
    const supabase = await createClient();

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: '链接已过期，请重新申请' };
    }

    const rateLimit = checkServerRateLimit(`reset:${user.id}`, {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000,
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
