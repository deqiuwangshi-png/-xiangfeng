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
