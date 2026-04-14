/**
 * 服务端认证校验（最小实现）
 * @module lib/auth/permissions
 * @description 业务权限与资源归属请在各 Server Action 内结合 RLS 处理
 */

import { LOGIN_MESSAGES } from '@/lib/messages'
import { getCurrentUser } from './user'
import type { User } from '@supabase/supabase-js'

/**
 * 要求已登录用户；未登录则抛错
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error(LOGIN_MESSAGES.NOT_AUTHENTICATED)
  }
  return user
}
