/**
 * 设置页面数据查询
 * @module lib/settings/queries
 * @description 设置页面相关的数据查询函数
 */

import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * 用户资料查询结果类型（部分字段）
 */
export interface UserProfileData {
  username: string
  avatar_url: string | null
  bio: string | null
  location: string | null
}

/**
 * 获取用户资料
 * @param userId - 用户ID
 * @param supabase - Supabase 客户端实例（复用，避免重复创建）
 * @returns 用户资料数据，失败时返回 null
 */
export async function getUserProfile(
  userId: string,
  supabase: SupabaseClient
): Promise<UserProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url, bio, location')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('获取用户资料失败:', error.message)
      return null
    }

    return data as UserProfileData
  } catch (err) {
    console.error('获取用户资料时发生异常:', err)
    return null
  }
}
