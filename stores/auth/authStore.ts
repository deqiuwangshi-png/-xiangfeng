import { create } from 'zustand'
import type { AuthStore, AuthState, AuthError, LoginParams, LoginResult } from './authTypes'
import type { SimpleUser, UserProfile } from '@/types/user/user'

let fetchPromise: Promise<{ user: SimpleUser; profile: UserProfile } | null> | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5000
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

interface ErrorWithMessage {
  message?: string
}

function isNetworkError(error: unknown): boolean {
  const networkErrorMessages = ['网络错误', 'Network error', 'Connection failed', 'Timeout', 'fetch failed', '请求失败']
  const err = error as ErrorWithMessage
  if (err?.message) {
    return networkErrorMessages.some(msg => err.message?.includes(msg))
  }
  return false
}

function isTemporaryAuthError(error: unknown): boolean {
  const temporaryErrors = ['Auth session missing!', 'session_not_found', 'token_not_found']
  const err = error as ErrorWithMessage
  if (err?.message) {
    return temporaryErrors.some(msg => err.message?.toLowerCase().includes(msg.toLowerCase()))
  }
  return false
}

async function fetchCurrentUser(): Promise<{ user: SimpleUser; profile: UserProfile } | null> {
  const now = Date.now()

  if (fetchPromise && now - lastFetchTime < CACHE_DURATION) {
    return fetchPromise
  }

  lastFetchTime = now

  fetchPromise = (async () => {
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

        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single()

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
        return null
      }
    }

    return null
  })().finally(() => {
    setTimeout(() => {
      fetchPromise = null
    }, CACHE_DURATION)
  })

  return fetchPromise
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

      const userProfile = await fetchCurrentUser()

      if (userProfile) {
        setUser(userProfile.user, userProfile.profile)
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

  refreshUser: async () => {
    const { setLoading, setUser, user: currentUser } = get()

    if (!currentUser) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const userProfile = await fetchCurrentUser()

      if (userProfile) {
        setUser(userProfile.user, userProfile.profile)
      } else {
        setLoading(false)
      }
    } catch{
      setLoading(false)
    }
  },

  clearUser: () => {
    set({
      ...initialAuthState,
      status: 'unauthenticated',
      isInitialized: true,
      lastUpdated: Date.now(),
    })
  },

  setLoading: (isLoading: boolean) => {
    set({
      isLoading,
      status: isLoading ? 'loading' : get().status,
    })
  },

  setError: (error: AuthError | null) => {
    set({
      error,
      status: error ? 'error' : get().status,
    })
  },

  clearError: () => {
    set({ error: null })
  },

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
