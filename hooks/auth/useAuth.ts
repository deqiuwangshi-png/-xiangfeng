/**
 * 认证状态 Hook
 * @module hooks/auth/useAuth
 * @description 封装认证 Store 的便捷 Hook，提供常用的认证操作方法
 *
 * @特性
 * - 自动订阅用户数据变化
 * - 提供简化的登录/登出接口
 * - 内置错误处理和加载状态
 */

'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import type { LoginParams, AuthStatus, AuthError } from '@/stores/auth'
import type { SimpleUser, UserProfile } from '@/types/user/user'

/**
 * useAuth Hook 返回值接口
 * @interface UseAuthReturn
 */
interface UseAuthReturn {
  // === 状态 ===
  /** 当前用户 */
  user: SimpleUser | null
  /** 用户资料 */
  profile: UserProfile | null
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 是否加载中 */
  isLoading: boolean
  /** 认证状态 */
  status: AuthStatus
  /** 错误信息 */
  error: AuthError | null
  
  // === 操作 ===
  /** 登录方法 */
  login: (params: LoginParams & { redirectTo?: string }) => Promise<boolean>
  /** 登出方法 */
  logout: (options?: { redirectTo?: string; skipRedirect?: boolean }) => Promise<boolean>
  /** 刷新用户信息 */
  refreshUser: () => Promise<void>
  /** 清除错误 */
  clearError: () => void
  /** 更新用户资料 */
  updateProfile: (updates: { username?: string; avatar_url?: string }) => void
}

/**
 * 认证状态 Hook
 *
 * @description 提供完整的认证状态管理和操作方法
 * @returns {UseAuthReturn} 认证状态和操作方法
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <button onClick={() => login({ email, password })}>登录</button>;
 *   }
 *   
 *   return <div>欢迎, {user?.user_metadata?.username}</div>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()

  // 分别订阅原始值，避免对象比较导致的重渲染
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const status = useAuthStore((state) => state.status)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  
  // 获取 Actions
  const storeLogin = useAuthStore((state) => state.login)
  const storeLogout = useAuthStore((state) => state.logout)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  const clearError = useAuthStore((state) => state.clearError)
  const updateProfile = useAuthStore((state) => state.updateProfile)

  /**
   * 登录方法（封装版）
   * @param params - 登录参数，包含可选的 redirectTo
   * @returns 是否登录成功
   */
  const login = useCallback(async (
    params: LoginParams & { redirectTo?: string }
  ): Promise<boolean> => {
    const { redirectTo, ...loginParams } = params
    
    const result = await storeLogin(loginParams)
    
    if (result.success && result.redirectTo) {
      router.push(redirectTo || result.redirectTo)
      return true
    }
    
    return result.success
  }, [storeLogin, router])

  /**
   * 登出方法（封装版）
   * @param options - 登出选项
   * @returns 是否登出成功
   */
  const logout = useCallback(async (
    options: { redirectTo?: string; skipRedirect?: boolean } = {}
  ): Promise<boolean> => {
    const { redirectTo = '/login', skipRedirect = false } = options

    const result = await storeLogout()

    if (result.success && !skipRedirect) {
      router.push(redirectTo)
      router.refresh() // 刷新页面以清除服务端状态
    }

    return result.success
  }, [storeLogout, router])

  return {
    // 状态
    user,
    profile,
    isAuthenticated,
    isLoading,
    status,
    error,
    
    // 操作
    login,
    logout,
    refreshUser,
    clearError,
    updateProfile,
  }
}

/**
 * 仅获取用户数据的 Hook（性能优化版）
 * @description 只订阅用户数据，不订阅状态变化
 *
 * @优化说明
 * - 分别订阅每个字段，避免对象比较导致的重渲染
 * - 使用原始值比较而非对象比较
 */
export function useAuthUser() {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return { user, profile, isAuthenticated }
}

/**
 * 仅获取认证状态的 Hook（性能优化版）
 * @description 只订阅状态数据，不订阅用户数据
 *
 * @优化说明
 * - 分别订阅每个字段，避免对象比较导致的重渲染
 */
export function useAuthStatus() {
  const status = useAuthStore((state) => state.status)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const error = useAuthStore((state) => state.error)

  return { status, isLoading, isInitialized, error }
}

/**
 * 仅获取登录状态的 Hook（最小订阅）
 * @description 只返回是否已登录，用于条件渲染
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated)
}

/**
 * 仅获取用户 ID 的 Hook（最小订阅）
 * @description 只返回用户 ID，用于关联查询
 */
export function useUserId(): string | null {
  return useAuthStore((state) => state.user?.id ?? null)
}
