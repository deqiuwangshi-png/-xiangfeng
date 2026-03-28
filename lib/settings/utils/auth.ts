'use server'

/**
 * 设置模块认证工具函数
 * @module lib/settings/utils/auth
 * @description 提供设置模块统一的认证逻辑，避免重复代码
 */

import { createClient } from '@/lib/supabase/server'
import { LOGIN_MESSAGES } from '@/lib/messages'
import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * 认证结果类型
 */
export interface AuthResult {
  success: boolean
  user?: User
  supabase?: SupabaseClient
  error?: string
}

/**
 * 带认证的回调函数类型
 */
export type AuthCallback<T> = (
  user: User,
  supabase: SupabaseClient
) => Promise<T>

/**
 * 验证用户认证状态
 * @returns 认证结果，包含user和supabase客户端
 */
export async function verifyAuth(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
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
 * 包装器：在认证上下文中执行操作
 * @param callback - 认证通过后执行的回调函数
 * @returns 操作结果或认证错误
 */
export async function withAuth<T>(
  callback: AuthCallback<T>
): Promise<T | { success: false; error: string }> {
  const authResult = await verifyAuth()

  if (!authResult.success || !authResult.user || !authResult.supabase) {
    return {
      success: false,
      error: authResult.error || LOGIN_MESSAGES.NOT_AUTHENTICATED,
    }
  }

  return callback(authResult.user, authResult.supabase)
}
