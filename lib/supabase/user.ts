import { cache } from 'react'
import { createClient } from './server'
import type { User } from '@supabase/supabase-js'

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
    // 会话缺失是正常情况（如用户已退出或删除账户），不报错
    if (error.message === 'Auth session missing!') {
      return null
    }
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
 * 用户资料接口
 * @interface UserProfile
 */
export interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string
}

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
  const supabase = await createClient()
  
  // 获取当前用户
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
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
