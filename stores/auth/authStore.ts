/**
 * 认证状态管理 Store
 * @module stores/auth/authStore
 * @description 基于 Zustand 的全局认证状态管理
 *
 * @特性
 * - 统一管理用户认证状态
 * - 支持服务端状态水合
 * - 内置加载状态和错误处理
 * - 选择性持久化（记住我功能）
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AuthStore,
  AuthState,
  AuthError,
  LoginParams,
  LoginResult,
} from './authTypes'
import type { SimpleUser, UserProfile } from '@/types/user/user'

// ============================================
// 客户端获取当前用户辅助函数
// ============================================

/**
 * 客户端获取当前用户
 * @description 使用浏览器客户端获取当前用户和资料
 * 避免在客户端调用服务端 API (cookies)
 *
 * @性能优化 P1: 添加请求锁防止重复请求
 * - 同一时间只有一个请求在执行
 * - 其他调用者等待当前请求完成并共享结果
 *
 * @returns 用户信息和资料，未登录返回 null
 */

// 请求锁和缓存
let fetchPromise: Promise<{ user: SimpleUser; profile: UserProfile } | null> | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5000 // 5秒内不重复请求

async function fetchCurrentUser(): Promise<{ user: SimpleUser; profile: UserProfile } | null> {
  const now = Date.now()

  // 如果缓存未过期且已有结果，直接返回
  if (fetchPromise && now - lastFetchTime < CACHE_DURATION) {
    return fetchPromise
  }

  // 如果已有请求在进行中，等待它完成
  if (fetchPromise) {
    return fetchPromise
  }

  // 创建新的请求
  fetchPromise = (async () => {
    try {
      // 动态导入客户端（避免服务端渲染问题）
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      // 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        return null
      }

      // 获取用户资料，添加错误处理
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('获取用户资料失败:', profileError);
        // 继续执行，使用默认值
      }

      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        username: profileData?.username || user.email?.split('@')[0] || '用户',
        avatar_url: profileData?.avatar_url || '',
      }

      const simpleUser: SimpleUser = {
        id: user.id,
        email: user.email || '',
        user_metadata: {
          username: profile.username,
          avatar_url: profile.avatar_url,
        },
      }

      return { user: simpleUser, profile }
    } catch (err) {
      console.error('获取用户信息失败:', err)
      return null
    } finally {
      lastFetchTime = Date.now()
      // 延迟清理请求锁，让其他等待的调用者能获取结果
      setTimeout(() => {
        fetchPromise = null
      }, 100)
    }
  })()

  return fetchPromise
}

// ============================================
// 初始状态
// ============================================

/**
 * 认证状态初始值
 * @constant initialAuthState
 */
const initialAuthState: AuthState = {
  // 用户数据
  user: null,
  profile: null,
  
  // 状态标记
  status: 'idle',
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  
  // 错误处理
  error: null,
  
  // 更新时间
  lastUpdated: null,
}

// ============================================
// Store 创建
// ============================================

/**
 * 创建认证 Store
 * @description 使用 Zustand 创建认证状态管理 Store
 *
 * @架构说明
 * - 使用 persist 中间件实现选择性持久化
 * - 只持久化用户基本信息，不持久化敏感数据
 * - 服务端渲染时自动禁用持久化
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // === 初始状态 ===
      ...initialAuthState,

      // ========================================
      // 核心操作
      // ========================================

      /**
       * 用户登录
       * @param params - 登录参数
       * @returns 登录结果
       *
       * @安全说明
       * - 实际登录逻辑在 Server Action 中执行
       * - Store 只负责状态管理
       * - 密码等敏感数据不经过 Store
       */
      login: async (params: LoginParams): Promise<LoginResult> => {
        const { setLoading, setError, setUser, clearError } = get()
        
        // 防止重复提交
        if (get().isLoading) {
          return { success: false, error: '登录进行中，请勿重复提交' }
        }

        setLoading(true)
        clearError()

        try {
          // 动态导入 Server Action（避免循环依赖）
          const { login: serverLogin } = await import('@/lib/auth/actions/login')
          
          // 构建 FormData
          const formData = new FormData()
          formData.append('email', params.email)
          formData.append('password', params.password)

          // 调用服务端登录
          const result = await serverLogin(formData)

          if (!result.success) {
            setError({
              code: 'LOGIN_FAILED',
              message: result.error || '登录失败',
              type: 'validation',
            })
            setLoading(false)
            return { success: false, error: result.error }
          }

          // 登录成功，使用客户端获取用户信息
          const userProfile = await fetchCurrentUser()

          if (userProfile) {
            setUser(userProfile.user, userProfile.profile)
          }

          setLoading(false)
          return { 
            success: true, 
            redirectTo: result.redirectTo 
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '登录失败'
          setError({
            code: 'LOGIN_ERROR',
            message: errorMessage,
            type: 'unknown',
          })
          setLoading(false)
          return { success: false, error: errorMessage }
        }
      },

      /**
       * 用户登出
       * @returns 登出结果
       */
      logout: async () => {
        const { setLoading, clearUser } = get()
        
        if (get().isLoading) {
          return { success: false, error: '登出进行中' }
        }

        setLoading(true)

        try {
          // 动态导入 Server Action
          const { logout: serverLogout } = await import('@/lib/auth/actions/logout')
          const result = await serverLogout()

          if (result.success) {
            clearUser()
          }

          setLoading(false)
          return result
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '登出失败'
          setLoading(false)
          return { success: false, error: errorMessage }
        }
      },

      /**
       * 设置用户信息
       * @param user - 用户对象
       * @param profile - 用户资料
       */
      setUser: (user: SimpleUser | null, profile?: UserProfile | null) => {
        set({
          user,
          profile: profile || null,
          status: user ? 'authenticated' : 'unauthenticated',
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        })
      },

      /**
       * 刷新用户信息
       * @description 从服务端重新获取用户信息
       */
      refreshUser: async () => {
        const { setLoading, setUser, setError } = get()
        
        setLoading(true)

        try {
          // 使用客户端获取用户信息
          const userProfile = await fetchCurrentUser()

          if (userProfile) {
            setUser(userProfile.user, userProfile.profile)
          } else {
            // 用户已登出或会话过期
            set({
              user: null,
              profile: null,
              status: 'unauthenticated',
              isAuthenticated: false,
              isLoading: false,
              lastUpdated: Date.now(),
            })
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '刷新用户信息失败'
          setError({
            code: 'REFRESH_ERROR',
            message: errorMessage,
            type: 'network',
          })
          setLoading(false)
        }
      },

      /**
       * 清除用户信息
       * @description 彻底清除所有前端认证状态，包括 store 状态和缓存
       */
      clearUser: () => {
        // 只在客户端执行 localStorage 操作
        if (typeof window !== 'undefined') {
          // 清除 localStorage 中的认证相关数据
          try {
            localStorage.removeItem('auth-storage')
            // 清除可能的其他认证相关缓存
            const supabaseProjectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || ''
            if (supabaseProjectId) {
              localStorage.removeItem('sb-' + supabaseProjectId + '-auth-token')
            }
          } catch (err) {
            console.error('清除本地存储失败:', err)
          }
        }

        // 清除 store 状态
        set({
          ...initialAuthState,
          status: 'unauthenticated',
          isInitialized: true,
          lastUpdated: Date.now(),
        })
      },

      // ========================================
      // 状态管理
      // ========================================

      /**
       * 设置加载状态
       * @param isLoading - 是否加载中
       */
      setLoading: (isLoading: boolean) => {
        set({ 
          isLoading,
          status: isLoading ? 'loading' : get().status,
        })
      },

      /**
       * 设置错误信息
       * @param error - 错误对象
       */
      setError: (error: AuthError | null) => {
        set({ 
          error,
          status: error ? 'error' : get().status,
        })
      },

      /**
       * 清除错误信息
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * 初始化认证状态
       * @param user - 初始用户数据
       * @param profile - 初始用户资料
       */
      initialize: (user: SimpleUser | null, profile?: UserProfile | null) => {
        set({
          user,
          profile: profile || null,
          status: user ? 'authenticated' : 'unauthenticated',
          isAuthenticated: !!user,
          isLoading: false,
          isInitialized: true,
          error: null,
          lastUpdated: Date.now(),
        })
      },

      /**
       * 更新用户资料字段
       * @param updates - 部分更新的资料
       */
      updateProfile: (updates: Partial<UserProfile>) => {
        const { profile, user } = get()
        
        if (!profile) return

        const newProfile = { ...profile, ...updates }
        
        // 同步更新 user.user_metadata
        const newUser = user ? {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            username: updates.username ?? user.user_metadata?.username,
            avatar_url: updates.avatar_url ?? user.user_metadata?.avatar_url,
          },
        } : null

        set({
          profile: newProfile,
          user: newUser,
          lastUpdated: Date.now(),
        })
      },
    }),
    {
      // 持久化配置
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      
      // 只持久化特定字段，避免存储敏感信息
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        lastUpdated: state.lastUpdated,
        // 不持久化：user, profile, status, isLoading, isInitialized, error
      }),
      
      // 版本控制（用于数据迁移）
      version: 1,
      
      // 迁移函数
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // 从旧版本迁移
          return persistedState as AuthStore
        }
        return persistedState as AuthStore
      },
      
      // 服务端渲染时跳过持久化
      skipHydration: typeof window === 'undefined',
    }
  )
)

// ============================================
// Selector 函数（用于性能优化）
// ============================================

/**
 * 用户数据 Selector
 * @description 只订阅用户相关数据，避免不必要的重渲染
 */
export const selectUser = (state: AuthStore) => ({
  user: state.user,
  profile: state.profile,
  isAuthenticated: state.isAuthenticated,
})

/**
 * 状态 Selector
 * @description 只订阅状态相关数据
 */
export const selectStatus = (state: AuthStore) => ({
  status: state.status,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized,
  error: state.error,
})

/**
 * 用户 ID Selector
 * @description 只订阅用户 ID
 */
export const selectUserId = (state: AuthStore) => state.user?.id ?? null

/**
 * 是否已登录 Selector
 * @description 只订阅登录状态
 */
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated
