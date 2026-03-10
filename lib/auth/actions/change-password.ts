'use server';

/**
 * 修改密码操作
 * @module lib/auth/actions/change-password
 * @description 已登录用户修改密码
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { validatePassword } from '@/lib/security/passwordPolicy';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import type { AuthResult } from './types';

/**
 * 修改密码（已登录用户）
 * @param formData 表单数据
 * @returns 修改结果
 */
export async function changePassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // 验证两次密码是否一致
  if (password !== confirmPassword) {
    return { success: false, error: '两次输入的密码不一致' };
  }

  // 验证密码强度
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return { success: false, error: passwordCheck.message };
  }

  try {
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: '未登录或登录已过期' };
    }

    // 限流保护
    const rateLimit = checkServerRateLimit(`change:${user.id}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15分钟
    });
    if (!rateLimit.allowed) {
      return { success: false, error: '尝试次数过多，请15分钟后再试' };
    }

    // 更新密码
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 密码修改成功后，登出用户（使当前会话失效）
    await supabase.auth.signOut();

    revalidatePath('/', 'layout');

    return { success: true, message: '密码修改成功，请使用新密码重新登录' };
  } catch (err) {
    console.error('修改密码失败:', err);
    return { success: false, error: '修改密码失败，请稍后重试' };
  }
}
