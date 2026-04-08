'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth'
import { createClient } from '@/lib/supabase/client'
import type { SimpleUser, UserProfile } from '@/types/user/user'
import type { AuthChangeEvent } from '@supabase/supabase-js'

const isDev = process.env.NODE_ENV === 'development'

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: SimpleUser | null
  initialProfile?: UserProfile | null
}

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const initialUserRef = useRef<SimpleUser | null>(initialUser)
  const initialProfileRef = useRef<UserProfile | null>(initialProfile)

  // 初始化
  useEffect(() => {
    if (isInitialized) return

    const userToUse = initialUser ?? initialUserRef.current
    const profileToUse = initialProfile ?? initialProfileRef.current

    if (userToUse) {
      initialUserRef.current = userToUse
    }
    if (profileToUse) {
      initialProfileRef.current = profileToUse
    }

    initialize(userToUse, profileToUse)
  }, [initialize, initialUser, initialProfile, isInitialized])

  // 认证状态监听
  const handleAuthStateChange = useCallback(
    async (event: AuthChangeEvent) => {
      try {
        switch (event) {
          case 'SIGNED_IN':
            if (!isDev) console.log('用户登录')
            await refreshUser()
            break
          case 'SIGNED_OUT':
            if (!isDev) console.log('用户登出')
            clearUser()
            initialUserRef.current = null
            initialProfileRef.current = null
            break
          case 'USER_UPDATED':
            if (!isDev) console.log('用户信息更新')
            await refreshUser()
            break
        }
      } catch (error) {
        console.error('认证状态处理错误:', error)
      }
    },
    [refreshUser, clearUser]
  )

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      handleAuthStateChange(event)
    })
    return () => subscription.unsubscribe()
  }, [handleAuthStateChange])

  // 页面可见性恢复
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      if (user && !isAuthenticated && initialUserRef.current) {
        initialize(initialUserRef.current, initialProfileRef.current)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [initialize, user, isAuthenticated])

  // 定时刷新令牌
  useEffect(() => {
    if (!isAuthenticated) return
    const intervalId = setInterval(() => refreshUser(), 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [isAuthenticated, refreshUser])

  return <>{children}</>
}
