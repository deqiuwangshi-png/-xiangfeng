import { User } from '@supabase/supabase-js'
import type { UserDisplayInfo } from '@/types'

/**
 * Profile 数据接口
 */
export interface ProfileData {
  id?: string
  username?: string
  avatar_url?: string
  bio?: string
  location?: string
  updated_at?: string
}

/**
 * 获取用户显示信息
 *
 * @param user - Supabase User 对象
 * @param profile - Profile 表数据（可选，优先使用）
 * @returns 用户显示信息
 *
 * @description
 * 统一转换用户数据，确保所有组件使用相同的逻辑：
 * - 优先级：profiles 表 > user_metadata > 默认值
 * - 用户名：优先使用 profile.username 或 user_metadata.username，其次使用邮箱前缀
 * - 头像：优先使用 profile.avatar_url 或 user_metadata.avatar_url，无则返回空字符串
 * - 简介：优先使用 profile.bio 或 user_metadata.bio
 * - 位置：优先使用 profile.location 或 user_metadata.location
 * - 加入日期：格式化 user.created_at（保留，不可修改）
 */
export function getUserDisplayInfo(
  user: User | null,
  profile?: ProfileData | null
): UserDisplayInfo {
  if (!user) {
    return {
      id: '',
      email: '',
      username: '访客',
      avatarUrl: '',
      bio: '请先登录',
      location: '',
      joinDate: '',
    }
  }

  // 优先级：profiles 表 > user_metadata > 默认值
  const username = profile?.username ||
                   user.user_metadata?.username ||
                   user.email?.split('@')[0] ||
                   '用户'

  /**
   * 头像逻辑：
   * 1. 优先使用已保存的 avatar_url（来自profile或user_metadata）
   * 2. 如果没有保存的头像，返回空字符串（由组件决定是否显示首字母）
   *
   * 注意：不再预生成默认头像URL，由 UserAvt 组件统一处理显示逻辑
   */
  const avatarUrl = profile?.avatar_url ||
                    user.user_metadata?.avatar_url ||
                    ''

  const bio = profile?.bio ||
              user.user_metadata?.bio ||
              '这个人很懒，还没有填写简介...'

  const location = profile?.location ||
                   user.user_metadata?.location ||
                   ''

  return {
    id: user.id,
    email: user.email || '',
    username,
    avatarUrl,
    bio,
    location,
    joinDate: new Date(user.created_at).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
    }),
  }
}

// 重新导出类型，保持向后兼容
export type { UserDisplayInfo }
