import { create } from 'zustand'
import type { AuthStore, AuthState, AuthError, LoginParams, LoginResult } from './authTypes'
import type { SimpleUser, UserProfile } from '@/types/user/user'

/**
 * 请求缓存 - 按用户ID存储
 */
const requestCache = new Map<string, {
  promise: Promise<{ user: SimpleUser; profile: UserProfile } | null>
  timestamp: number
}>()

const CACHE_DURATION = 5000
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

interface ErrorWithMessage {
  message?: string
}

/**
 * 检查是否为网络错误
 */
function isNetworkError(error: unknown): boolean {
  const networkErrorMessages = ['网络错误', 'Network error', 'Connection failed', 'Timeout', 'fetch failed', '请求失败']
  const err = error as ErrorWithMessage
  if (err?.message) {
    return networkErrorMessages.some(msg => err.message?.includes(msg))
  }
  return false
}

/**
 * 检查是否为临时认证错误
 */
function isTemporaryAuthError(error: unknown): boolean {
  const temporaryErrors = ['Auth session missing!', 'session_not_found', 'token_not_found']
  const err = error as ErrorWithMessage
  if (err?.message) {
    return temporaryErrors.some(msg => err.message?.toLowerCase().includes(msg.toLowerCase()))
  }
  return false
}

/**
 * 获取当前用户数据
 * @param userId - 用户ID（用于缓存）
 * @returns 用户数据和资料
 */
async function fetchCurrentUser(userId?: string): Promise<{ user: SimpleUser; profile: UserProfile } | null> {
  const now = Date.now()
  const cacheKey = userId || 'anonymous'
  
  // 检查缓存
  const cached = requestCache.get(cacheKey)
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.promise
  }
  
  const promise = (async () => {
    let retries = 0

    while (retries < MAX_RETRIES) {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          if (isNetworkError(userError)) {
            retries++
            if (retries < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
              continue
            }
          }

          if (isTemporaryAuthError(userError) && retries < MAX_RETRIES) {
            retries++
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * 2))
            continue
          }

          return null
        }

        if (!user) {
          return null
        }

        // 获取用户资料
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('[AuthStore] 获取用户资料失败:', profileError)
        }

        const profile: UserProfile = {
          id: user.id,
          email: user.email || '',
          username: profileData?.username || user.email?.split('@')[0] || '用户',
          avatar_url: profileData?.avatar_url,
        }

        const simpleUser: SimpleUser = {
          id: user.id,
          email: user.email || '',
          user_metadata: {
            username: profile.username,
            avatar_url: profile.avatar_url || user.user_metadata?.avatar_url,
          },
        }

        return { user: simpleUser, profile }
      } catch (err) {
        if (isNetworkError(err)) {
          retries++
          if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
            continue
          }
        }
        console.error('[AuthStore] 获取用户数据失败:', err)
        return null
      }
    }

    return null
  })()
  
  // 存储到缓存
  requestCache.set(cacheKey, { promise, timestamp: now })
  
  // 清理过期缓存
  promise.finally(() => {
    setTimeout(() => {
      const current = requestCache.get(cacheKey)
      if (current?.promise === promise) {
        requestCache.delete(cacheKey)
      }
    }, CACHE_DURATION)
  })

  return promise
}

const initialAuthState: AuthState = {
  user: null,
  profile: null,
  status: 'idle',
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  lastUpdated: null,
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...initialAuthState,

  /**
   * 用户登录
   * @param params - 登录参数
   * @returns 登录结果
   */
  login: async (params: LoginParams): Promise<LoginResult> => {
    const { setLoading, setError, setUser, clearError } = get()

    if (get().isLoading) {
      return { success: false, error: '登录进行中，请勿重复提交' }
    }

    setLoading(true)
    clearError()

    try {
      const { login: serverLogin } = await import('@/lib/auth/actions/login')
      const formData = new FormData()
      formData.append('email', params.email)
      formData.append('password', params.password)

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

      // 二次验证：确认会话已建立
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        setError({
          code: 'SESSION_ERROR',
          message: '登录会话建立失败，请重试',
          type: 'server',
        })
        setLoading(false)
        return { success: false, error: '登录会话建立失败' }
      }

      const userProfile = await fetchCurrentUser(session.user.id)

      if (userProfile) {
        setUser(userProfile.user, userProfile.profile)
      } else {
        setError({
          code: 'USER_DATA_ERROR',
          message: '获取用户信息失败',
          type: 'server',
        })
        setLoading(false)
        return { success: false, error: '获取用户信息失败' }
      }

      setLoading(false)
      return { success: true, redirectTo: result.redirectTo }
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
   */
  refreshUser: async () => {
    const { setLoading, setUser, clearUser, user: currentUser } = get()

    if (!currentUser) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const userProfile = await fetchCurrentUser(currentUser.id)

      if (userProfile) {
        setUser(userProfile.user, userProfile.profile)
      } else {
        // 会话已过期，清理用户状态
        clearUser()
      }
    } catch (error) {
      // 网络错误时保留当前状态，其他错误清理状态
      if (isNetworkError(error)) {
        setLoading(false)
      } else {
        console.error('[AuthStore] 刷新用户失败:', error)
        clearUser()
      }
    }
  },

  /**
   * 清除用户信息
   */
  clearUser: () => {
    // 清理本地存储中的认证相关数据
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('auth:last_refresh')
        // 保留 device_id 用于设备追踪
      } catch {
        // 忽略存储错误
      }
    }
    
    set({
      ...initialAuthState,
      status: 'unauthenticated',
      isInitialized: true,
      lastUpdated: Date.now(),
    })
  },

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
}))

export const selectUser = (state: AuthStore) => ({
  user: state.user,
  profile: state.profile,
  isAuthenticated: state.isAuthenticated,
})

export const selectStatus = (state: AuthStore) => ({
  status: state.status,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized,
  error: state.error,
})
