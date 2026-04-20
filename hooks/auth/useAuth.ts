'use client'

/**
 * 简化版认证 Hook
 * @module hooks/auth/useAuth
 * @description 直接使用 Supabase 认证状态，无需额外状态管理层
 */

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { login as loginAction, logout as logoutAction } from '@/lib/auth/client'
import { finalizeSessionEndClientRedirect } from '@/lib/auth/finalizeSessionEndClient'

export interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  canRunAuthenticatedActions: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

/**
 * 简化版认证 Hook
 * 直接使用 Supabase 的 onAuthStateChange，无需 Zustand
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const { user, isLoading, canRunAuthenticatedActions } = useAuthContext()

  /**
   * 用户登录
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const formData = new FormData()
      formData.set('email', email)
      formData.set('password', password)
      const result = await loginAction(formData)

      if (!result.success) {
        return { success: false, error: result.error || '登录失败，请重试' }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: '登录失败，请重试' }
    }
  }, [])

  /**
   * 用户退出
   */
  const logout = useCallback(async () => {
    try {
      const result = await logoutAction()
      if (finalizeSessionEndClientRedirect(result)) return
      router.refresh()
    } catch (error) {
      console.error('logout failed', error)
    }
  }, [router])

  /**
   * 刷新用户信息
   */
  const refreshUser = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.getSession()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    canRunAuthenticatedActions,
    login,
    logout,
    refreshUser,
  }
}

/**
 * 仅获取用户信息的 Hook
 */
export function useUser() {
  const { user } = useAuthContext()
  return user
}

/**
 * 仅获取登录状态的 Hook
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated
}
