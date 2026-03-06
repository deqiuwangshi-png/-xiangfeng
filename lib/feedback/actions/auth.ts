'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * 获取当前登录用户信息
 *
 * @returns 用户ID和邮箱，如果未登录则返回空对象
 */
export async function getCurrentUser(): Promise<{ userId?: string; userEmail?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return {
        userId: user.id,
        userEmail: user.email,
      };
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }

  return {};
}
