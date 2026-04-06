'use client'

/**
 * @fileoverview 认证状态提供者组件
 * @module components/providers/AuthProvider
 * @description 在客户端初始化认证状态，并同步 Supabase 会话状态
 *
 * @架构说明
 * - 接收服务端获取的初始用户数据（水合）
 * - 在客户端通过 onAuthStateChange 监听 Supabase 会话变化
 * - 确保服务端和客户端状态一致
 *
 * @统一认证 2026-04-06
 * - 服务端通过 getCurrentUser() 获取用户
 * - 客户端通过 authStore 同步 Supabase 状态
 * - 中间件统一刷新会话并写入 Cookie
 */

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth'
import { createClient } from '@/lib/supabase/client'
import type { SimpleUser, UserProfile } from '@/types/user/user'
import type { AuthChangeEvent } from '@supabase/supabase-js'

/**
 * AuthProvider Props 接口
 * @interface AuthProviderProps
 */
interface AuthProviderProps {
  /** 子组件 */
  children: React.ReactNode
  /** 初始用户数据（从服务端获取） */
  initialUser?: SimpleUser | null
  /** 初始用户资料（从服务端获取） */
  initialProfile?: UserProfile | null
}

/**
 * 认证状态提供者组件
 *
 * @description
 * 1. 服务端水合：将服务端获取的初始状态同步到客户端 Store
 * 2. 状态同步：监听 Supabase onAuthStateChange，保持前后端状态一致
 * 3. 会话管理：处理登录、登出、令牌刷新等事件
 *
 * @param props - 组件属性
 * @returns 子组件
 *
 * @示例
 * ```tsx
 * // app/layout.tsx (服务端)
 * import { getCurrentUserWithProfile } from '@/lib/auth/server';
 *
 * export default async function RootLayout({ children }) {
 *   const { user, profile } = await getCurrentUserWithProfile();
 *
 *   return (
 *     <AuthProvider initialUser={user} initialProfile={profile}>
 *       <html><body>{children}</body></html>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const hasInitialized = useRef(false)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  /**
   * 处理认证状态变化
   * @description 根据 Supabase 事件类型更新本地状态
   */
  const handleAuthStateChange = useCallback(
    async (event: AuthChangeEvent) => {
      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          // 用户登录或令牌刷新，更新用户信息
          await refreshUser()
          break

        case 'SIGNED_OUT':
          // 用户登出，清除本地状态
          clearUser()
          break

        case 'PASSWORD_RECOVERY':
          // 密码恢复流程，不处理
          break

        case 'INITIAL_SESSION':
          // 初始会话，已在服务端水合时处理
          break

        default:
          // 其他事件，刷新用户信息以确保状态一致
          await refreshUser()
      }
    },
    [refreshUser, clearUser]
  )

  /**
   * 初始化认证状态（服务端水合）
   * @description 只在客户端首次渲染时执行一次
   */
  useEffect(() => {
    if (!hasInitialized.current && !isInitialized) {
      initialize(initialUser, initialProfile)
      hasInitialized.current = true
    }
  }, [initialize, initialUser, initialProfile, isInitialized])

  /**
   * 订阅 Supabase 认证状态变化
   * @description 确保客户端状态与 Supabase 会话同步
   */
  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      handleAuthStateChange(event)
    })

    subscriptionRef.current = subscription

    return () => {
      subscription.unsubscribe()
      subscriptionRef.current = null
    }
  }, [handleAuthStateChange])

  /**
   * 页面可见性变化处理
   * @description 当用户从其他标签页返回时，刷新会话状态
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 页面重新可见，刷新用户信息
        refreshUser()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshUser])

  return <>{children}</>
}

/**
 * 使用 AuthProvider 的 Hook
 * @description 获取 AuthProvider 的上下文（当前只是透传，未来可扩展）
 * @deprecated 直接使用 useUser() 或 useAuth() 获取认证状态
 */
export function useAuthProvider() {
  // 当前 AuthProvider 不通过 Context 传递数据
  // 所有状态通过 authStore 管理
  return {
    isReady: true,
  }
}
