'use server';

/**
 * 用户资料辅助函数
 *
 * @module lib/articles/helpers/profile
 * @description 处理用户资料的检查和创建
 */

import { createClient } from '@/lib/supabase/server';

/**
 * 检查并创建用户资料
 *
 * 使用 Supabase upsert 原子操作，避免竞态条件
 * 相比先查后插方案：
 * - 1次数据库往返（vs 2次）
 * - 原子操作，无线程安全问题
 * - 代码更简洁
 *
 * @param userId - 用户ID
 * @param email - 用户邮箱
 * @returns 是否成功
 */
export async function ensureUserProfile(userId: string, email?: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        username: email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    );

  if (error) {
    console.error('创建用户资料失败:', error);
    return false;
  }

  return true;
}
