'use client'

/**
 * 认证状态 Hook
 * @module hooks/auth/useAuth
 * @description 封装认证 Store 的便捷 Hook，提供常用的认证操作方法
 *
 * @特性
 * - 自动订阅用户数据变化
 * - 提供简化的登录/登出接口
 * - 内置错误处理和加载状态
 * - 支持服务端数据水合
 */

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { useShallow } from 'zustand/react/shallow'
import type { LoginParams, AuthStatus, AuthError } from '@/stores/auth'
import type { SimpleUser, UserProfile } from '@/types/user/user'
import type { UseLogoutOptions } from '@/types/auth/auth'

/**
 * useAuth Hook 返回值接口
 * @interface UseAuthReturn
 */
interface UseAuthReturn {
  user: SimpleUser | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  status: AuthStatus
  error: AuthError | null
  login: (params: LoginParams & { redirectTo?: string }) => Promise<boolean>
  logout: (options?: { redirectTo?: string; skipRedirect?: boolean }) => Promise<boolean>
  logoutWithOptions: (options?: UseLogoutOptions) => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
  updateProfile: (updates: { username?: string; avatar_url?: string }) => void
}

/**
 * useUser Hook 返回值接口
 * @interface UseUserReturn
 */
interface UseUserReturn {
  user: SimpleUser | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  username: string | null
  avatarUrl: string | null
  email: string | null
}

/**
 * 完整的认证状态管理 Hook
 * @description 提供完整的认证状态和操作方法
 * @returns {UseAuthReturn} 认证状态和操作方法
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const { user, profile, isAuthenticated, updateProfile } = useAuth();
 *
 *   if (!isAuthenticated) return null;
 *
 *   return <div>欢迎, {profile?.username}</div>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()

  const { user, profile, isAuthenticated, isLoading, isInitialized, status, error } =
    useAuthStore(
      useShallow((state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        status: state.status,
        error: state.error,
      }))
    )

  const storeLogin = useAuthStore((state) => state.login)
  const storeLogout = useAuthStore((state) => state.logout)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  const clearError = useAuthStore((state) => state.clearError)
  const updateProfile = useAuthStore((state) => state.updateProfile)

  const login = useCallback(
    async (params: LoginParams & { redirectTo?: string }): Promise<boolean> => {
      const { redirectTo, ...loginParams } = params

      const result = await storeLogin(loginParams)

      if (result.success && result.redirectTo) {
        router.push(redirectTo || result.redirectTo)
        return true
      }

      return result.success
    },
    [storeLogin, router]
  )

  const logout = useCallback(
    async (options: { redirectTo?: string; skipRedirect?: boolean } = {}): Promise<boolean> => {
      const { redirectTo = '/', skipRedirect = false } = options

      const result = await storeLogout()

      if (result.success && !skipRedirect) {
        router.replace(redirectTo)
      }
      return result.success
    },
    [storeLogout, router]
  )

  const logoutWithOptions = useCallback(
    async (options: UseLogoutOptions = {}): Promise<void> => {
      const { redirectTo = '/', onSuccess, onError } = options

      if (isLoading) return

      const success = await logout({ redirectTo })

      if (success) {
        onSuccess?.()
      } else {
        onError?.(error?.message || '退出失败')
      }
    },
    [isLoading, logout, error]
  )

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isInitialized,
    status,
    error,
    login,
    logout,
    logoutWithOptions,
    refreshUser,
    clearError,
    updateProfile,
  }
}

/**
 * 简洁的用户数据获取 Hook
 * @description 提供用户数据的最小订阅，只关注用户相关数据
 * @returns {UseUserReturn} 用户数据和便捷属性
 *
 * @架构说明
 * - 这是客户端获取当前用户的推荐方式
 * - 与服务端 getCurrentUser() 对应
 * - 内部通过 authStore 订阅 Supabase onAuthStateChange 同步的状态
 *
 * @示例
 * ```tsx
 * function UserBadge() {
 *   const { user, profile, isAuthenticated } = useUser();
 *
 *   if (!isAuthenticated) return <GuestBadge />;
 *
 *   return (
 *     <div className="flex items-center gap-2">
 *       <Avatar src={profile?.avatar_url} alt={profile?.username} />
 *       <span>{profile?.username}</span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @示例 - 配合服务端水合
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
 *
 * // components/UserBadge.tsx (客户端)
 * function UserBadge() {
 *   const { user, profile } = useUser();
 *   // 初始状态来自服务端水合，后续通过 onAuthStateChange 同步
 * }
 * ```
 */
export function useUser(): UseUserReturn {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  const userId = useMemo(() => user?.id ?? null, [user?.id])

  const username = useMemo(
    () => profile?.username ?? user?.user_metadata?.username ?? null,
    [profile?.username, user?.user_metadata?.username]
  )

  const avatarUrl = useMemo(
    () => profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null,
    [profile?.avatar_url, user?.user_metadata?.avatar_url]
  )

  const email = useMemo(() => user?.email ?? null, [user?.email])

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    userId,
    username,
    avatarUrl,
    email,
  }
}

/**
 * 仅获取用户数据的 Hook（性能优化版）
 * @description 只订阅用户数据，不订阅状态变化
 */
export function useAuthUser() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      profile: state.profile,
      isAuthenticated: state.isAuthenticated,
    }))
  )
}

/**
 * 仅获取认证状态的 Hook（性能优化版）
 * @description 只订阅状态数据，不订阅用户数据
 */
export function useAuthStatus() {
  return useAuthStore(
    useShallow((state) => ({
      status: state.status,
      isLoading: state.isLoading,
      isInitialized: state.isInitialized,
      error: state.error,
    }))
  )
}

/**
 * 仅获取登录状态的 Hook（最小订阅）
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated)
}

/**
 * 仅获取用户 ID 的 Hook（最小订阅）
 */
export function useUserId(): string | null {
  return useAuthStore((state) => state.user?.id ?? null)
}
