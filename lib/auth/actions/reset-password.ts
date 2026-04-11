'use server';

/**
 * 重置密码操作
 * @module lib/auth/actions/reset-password
 * @description 通过邮件链接重置密码
 */

import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { mapSupabaseError, RESET_PASSWORD_MESSAGES } from '@/lib/messages';
import { validatePasswordMatch } from '../utils/helpers';
import { getCurrentUser } from '@/lib/auth/server';
import type { AuthResult } from '@/types';

/**
 * 重置密码（已登录用户）
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
      return { success: false, error: RESET_PASSWORD_MESSAGES.SESSION_EXPIRED };
    }

    const rateLimit = await checkServerRateLimit(`reset:${user.id}`, {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return { success: false, error: RESET_PASSWORD_MESSAGES.RATE_LIMITED };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      const friendlyError = mapSupabaseError(error.message, 'reset-password');
      return {
        success: false,
        error: friendlyError,
      };
    }

    return { success: true, message: RESET_PASSWORD_MESSAGES.SUCCESS };
  } catch (err) {
    console.error('重置密码失败:', err);
    return { success: false, error: RESET_PASSWORD_MESSAGES.DEFAULT_ERROR };
  }
}
