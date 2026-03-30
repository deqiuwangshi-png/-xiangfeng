/**
 * 认证状态提供者组件
 * @module components/providers/AuthProvider
 * @description 用于在客户端初始化认证状态的 Provider 组件
 *
 * @架构说明
 * - 接收服务端获取的初始用户数据
 * - 在客户端水合时初始化 Store
 * - 避免客户端和服务端状态不一致
 */

'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth'
import type { SimpleUser, UserProfile } from '@/types/user/user'

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
 * 该组件负责将服务端获取的初始认证状态同步到客户端 Store。
 * 使用 useRef 确保只初始化一次，避免重复设置。
 *
 * @param props - 组件属性
 * @returns 子组件
 *
 * @example
 * ```tsx
 * // 在 layout.tsx 中使用
 * <AuthProvider initialUser={user} initialProfile={profile}>
 *   {children}
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ 
  children, 
  initialUser = null, 
  initialProfile = null 
}: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // 确保只初始化一次
    if (!hasInitialized.current && !isInitialized) {
      initialize(initialUser, initialProfile)
      hasInitialized.current = true
    }
  }, [initialize, initialUser, initialProfile, isInitialized])

  return <>{children}</>
}
