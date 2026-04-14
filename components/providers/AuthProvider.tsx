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

interface AuthProviderProps {
  children: React.ReactNode
}

interface AuthContextValue {
  user: User | null
  profile: SimpleUserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<SimpleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

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

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setIsLoading(false)
      if (currentUser?.id) {
        void loadProfile(currentUser.id)
      } else {
        setProfile(null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setIsLoading(false)
        if (currentUser?.id) {
          void loadProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const contextValue = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
  }), [isLoading, profile, user])

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
