'use server';

/**
 * 重置密码操作
 * @module lib/auth/actions/reset-password
 * @description 通过邮件链接重置密码
 */

import { createClient } from '@/lib/supabase/server';
import type { AuthResult } from './types';

/**
 * 重置密码
 * @param formData 表单数据
 * @returns 重置结果
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password.length < 8) {
    return { success: false, error: '密码至少需要8位' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: '两次输入的密码不一致' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.message.includes('Session expired')) {
        return { success: false, error: '链接已过期，请重新申请' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, message: '密码重置成功，请使用新密码登录' };
  } catch (err) {
    console.error('重置密码失败:', err);
    return { success: false, error: '重置失败，请稍后重试' };
  }
}
