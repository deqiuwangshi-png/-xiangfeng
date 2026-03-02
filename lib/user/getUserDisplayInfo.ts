import { User } from '@supabase/supabase-js'

/**
 * 用户显示信息接口
 */
export interface UserDisplayInfo {
  id: string
  email: string
  username: string
  avatarUrl: string
  bio: string
  joinDate: string
}

/**
 * 获取用户显示信息
 * 
 * @param user - Supabase User 对象
 * @returns 用户显示信息
 * 
 * @description
 * 统一转换用户数据，确保所有组件使用相同的逻辑：
 * - 用户名：优先使用 user_metadata.username，其次使用邮箱前缀
 * - 头像：优先使用 user_metadata.avatar_url，否则根据 user.id 生成
 * - 简介：使用 user_metadata.bio 或默认文本
 * - 加入日期：格式化 user.created_at
 */
export function getUserDisplayInfo(user: User | null): UserDisplayInfo {
  if (!user) {
    return {
      id: '',
      email: '',
      username: '访客',
      avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=guest&backgroundColor=B6CAD7',
      bio: '请先登录',
      joinDate: '',
    }
  }

  return {
    id: user.id,
    email: user.email || '',
    username: user.user_metadata?.username || user.email?.split('@')[0] || '用户',
    avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/micah/svg?seed=${user.id}&backgroundColor=B6CAD7`,
    bio: user.user_metadata?.bio || '这个人很懒，还没有填写简介...',
    joinDate: new Date(user.created_at).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
    }),
  }
}
