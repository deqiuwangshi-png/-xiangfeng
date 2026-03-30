'use server';

/**
 * 修改密码操作
 * @module lib/auth/actions/change-password
 * @description 已登录用户修改密码
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { CHANGE_PASSWORD_MESSAGES } from '@/lib/messages';
import { validatePasswordMatch, getCurrentUser } from '../utils';
import type { AuthResult } from './types';

/**
 * 修改密码（已登录用户）
 * @param formData 表单数据
 * @returns 修改结果
 */
export async function changePassword(formData: FormData): Promise<AuthResult> {
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
      return { success: false, error: CHANGE_PASSWORD_MESSAGES.NOT_AUTHENTICATED };
    }

    const rateLimit = await checkServerRateLimit(`change:${user.id}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return { success: false, error: CHANGE_PASSWORD_MESSAGES.RATE_LIMITED };
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await supabase.auth.signOut();

    revalidatePath('/', 'layout');

    return { success: true, message: CHANGE_PASSWORD_MESSAGES.SUCCESS };
  } catch (err) {
    console.error('修改密码失败:', err);
    return { success: false, error: CHANGE_PASSWORD_MESSAGES.DEFAULT_ERROR };
  }
}
