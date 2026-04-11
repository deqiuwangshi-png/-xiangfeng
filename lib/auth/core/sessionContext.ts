/**
 * 服务端「用户 + Supabase 客户端」会话工具
 * @module lib/auth/core/sessionContext
 * @description 与 {@link withAuth}（注入 User 的 Server Action 包装）区分：本模块用于需要 RLS 数据库客户端的整段逻辑
 */

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './user'
import { LOGIN_MESSAGES } from '@/lib/messages'
import type { AuthSessionCallback, AuthSessionResult } from '@/types/auth/auth'

/**
 * 校验当前请求是否已登录，并返回服务端 Supabase 客户端
 */
export async function verifyAuthSession(): Promise<AuthSessionResult> {
  try {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: LOGIN_MESSAGES.NOT_AUTHENTICATED,
      }
    }

    return {
      success: true,
      user,
      supabase,
    }
  } catch (err) {
    console.error('认证验证失败:', err)
    return {
      success: false,
      error: LOGIN_MESSAGES.NOT_AUTHENTICATED,
    }
  }
}

/**
 * 在已登录会话中执行回调（一次 createClient + 一次 getCurrentUser）
 */
export async function withAuthSession<T>(
  callback: AuthSessionCallback<T>
): Promise<T | { success: false; error: string }> {
  const authResult = await verifyAuthSession()

  if (!authResult.success || !authResult.user || !authResult.supabase) {
    return {
      success: false,
      error: authResult.error || LOGIN_MESSAGES.NOT_AUTHENTICATED,
    }
  }

  return callback(authResult.user, authResult.supabase)
}
