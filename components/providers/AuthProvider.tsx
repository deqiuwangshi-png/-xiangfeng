'use client'

/**
 * 认证提供者组件（简化版）
 * @module components/providers/AuthProvider
 * @description 仅用于监听认证状态变化，无需额外状态管理
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { SimpleUserProfile } from '@/types'
import { routeRequiresAuth } from '@/config/navigation'

interface AuthProviderProps {
  children: React.ReactNode
}

interface AuthContextValue {
  user: User | null
  profile: SimpleUserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  authState: 'anonymous' | 'syncing' | 'authenticated'
  hasValidClientSession: boolean
  canRunAuthenticatedActions: boolean
}

interface UserProfileUpdatedDetail {
  username?: string
  avatar_url?: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authState, setAuthState] = useState<'anonymous' | 'syncing' | 'authenticated'>('syncing')
  const [hasValidClientSession, setHasValidClientSession] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const fetchServerAuthFallback = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) return null

        const result = (await response.json()) as {
          authenticated?: boolean
          user?: { id: string; email?: string | null } | null
        }

        if (!result.authenticated || !result.user?.id) {
          return null
        }

        return result.user.id
      } catch {
        return null
      }
    }

    const loadProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', userId)
          .maybeSingle()

        setProfile(
          data
            ? {
                username: data.username || undefined,
                avatar_url: data.avatar_url || undefined,
              }
            : null
        )
      } catch {
        setProfile(null)
      }
    }

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      const hasSession = !!currentUser?.id

      if (hasSession && currentUser) {
        setUser(currentUser)
        setHasValidClientSession(true)
        // 严格单路径：初始化阶段不加载 profile，统一由 onAuthStateChange 负责
        // 保持 syncing，直到监听器回调确认最终状态
        setAuthState('syncing')
        return
      }

      // No client session: check server auth to distinguish true anonymous
      // from temporary hydration/session restore drift.
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
      const shouldCheckServerFallback = routeRequiresAuth(currentPath)
      const serverUserId = shouldCheckServerFallback
        ? await fetchServerAuthFallback()
        : null
      setUser(null)
      setHasValidClientSession(false)
      setAuthState(serverUserId ? 'syncing' : 'anonymous')
      setProfile(null)
      setIsLoading(false)
    }

    void initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null
        const hasSession = !!currentUser?.id
        setUser(currentUser)
        setHasValidClientSession(hasSession)
        setAuthState(hasSession ? 'authenticated' : 'anonymous')
        setIsLoading(false)
        if (currentUser?.id) {
          void loadProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      }
    )

    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<UserProfileUpdatedDetail>
      const detail = customEvent.detail || {}

      setProfile((prev) => {
        const nextUsername = Object.prototype.hasOwnProperty.call(detail, 'username')
          ? detail.username || undefined
          : prev?.username || undefined

        const nextAvatar = Object.prototype.hasOwnProperty.call(detail, 'avatar_url')
          ? detail.avatar_url || undefined
          : prev?.avatar_url || undefined

        return {
          username: nextUsername,
          avatar_url: nextAvatar,
        }
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('user-profile-updated', handleProfileUpdated as EventListener)
    }

    return () => {
      subscription.unsubscribe()
      if (typeof window !== 'undefined') {
        window.removeEventListener('user-profile-updated', handleProfileUpdated as EventListener)
      }
    }
  }, [])

  const contextValue = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    authState,
    hasValidClientSession,
    canRunAuthenticatedActions: !!user && hasValidClientSession,
  }), [authState, hasValidClientSession, isLoading, profile, user])

  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
