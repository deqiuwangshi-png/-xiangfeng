/**
 * 统一用户获取入口（服务端）
 * @module lib/auth/user
 * @description 服务端获取当前登录用户的唯一入口
 *
 * @统一说明
 * - 所有服务端组件、Server Action、API路由都应从此入口获取用户信息
 * - 统一使用 React cache() 确保同一请求内共享用户数据
 * - 避免重复定义 getCurrentUser 函数
 */

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/user/user'

/**
 * 重新导出 UserProfile 类型
 * @description 统一从 types/user/user.ts 导入，避免重复定义
 */
export type { UserProfile }

/**
 * 判断是否为匿名用户访问的正常错误
 * 这些错误不应输出到控制台
 *
 * @param errorMessage - 错误信息
 * @returns 是否为正常匿名访问错误
 */
function isAnonymousAccessError(errorMessage: string): boolean {
  const anonymousErrors = [
    'Auth session missing!',
    'Invalid Refresh Token: Refresh Token Not Found',
    'Invalid token',
    'Token expired',
    'JWT expired',
    'user not found',
  ]
  return anonymousErrors.some((msg) =>
    errorMessage.toLowerCase().includes(msg.toLowerCase())
  )
}

/**
 * 获取当前登录用户（缓存版本）
 *
 * @description 使用React cache()函数缓存同一请求内的用户查询结果
 * 避免在同一请求中多次调用getUser()造成的重复数据库查询
 *
 * @returns 当前用户对象，如果未登录则返回null
 *
 * @example
 * // 在布局中使用
 * const user = await getCurrentUser()
 * if (!user) redirect('/login')
 *
 * @example
 * // 在页面中使用（同一请求内会复用缓存）
 * const user = await getCurrentUser() // 不会重复查询
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    // 匿名用户访问或会话过期是正常情况，不报错
    if (isAnonymousAccessError(error.message)) {
      return null
    }
    // 其他未知错误才输出日志
    console.error('获取用户信息失败:', error.message)
    return null
  }

  return user
})

/**
 * 检查用户是否已登录
 *
 * @description 快捷方法，用于需要快速检查登录状态的中间件或布局
 *
 * @returns 是否已登录
 */
export const isAuthenticated = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
})

/**
 * 获取当前用户ID
 *
 * @description 获取当前登录用户的ID，用于关联查询
 *
 * @returns 用户ID，如果未登录则返回null
 */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const user = await getCurrentUser()
  return user?.id || null
})

/**
 * 获取当前用户及资料信息（包含profiles表数据）
 *
 * @description 同时获取auth用户信息和profiles表资料
 * 用于需要显示用户头像、用户名等资料的场景
 *
 * @returns 用户资料对象，如果未登录则返回null
 *
 * @example
 * const userProfile = await getCurrentUserWithProfile()
 * if (userProfile) {
 *   console.log(userProfile.avatar_url) // 从profiles表获取的头像
 * }
 */
export const getCurrentUserWithProfile = cache(async (): Promise<UserProfile | null> => {
  // 复用getCurrentUser()函数，避免重复查询
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = await createClient()

  // 从profiles表获取用户资料
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email || '',
    username: profile?.username || user.email?.split('@')[0] || '用户',
    avatar_url: profile?.avatar_url || '',
  }
})
