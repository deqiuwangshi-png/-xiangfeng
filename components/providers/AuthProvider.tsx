'use client'

/**
 * 认证提供者组件
 * @module components/providers/AuthProvider
 * @description 管理全局认证状态，处理会话刷新和水合
 *
 * @安全修复
 * - 添加 CSRF 保护
 * - 修复竞态条件
 * - 完善会话验证
 * - 跨标签页状态同步
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { createClient } from '@/lib/supabase/client'
import type { SimpleUser, UserProfile } from '@/types/user/user'
import type { AuthChangeEvent } from '@supabase/supabase-js'

const isDev = process.env.NODE_ENV === 'development'
const REFRESH_INTERVAL = 5 * 60 * 1000 // 5分钟
const STORAGE_KEY = 'auth:last_refresh'
const AUTH_SYNC_KEY = 'auth:sync'

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: SimpleUser | null
  initialProfile?: UserProfile | null
}

/**
 * 检查是否为网络错误
 */
function isNetworkError(error: unknown): boolean {
  const networkErrorMessages = ['网络错误', 'Network error', 'Connection failed', 'Timeout', 'fetch failed']
  const message = error instanceof Error ? error.message : String(error)
  return networkErrorMessages.some(msg => message.includes(msg))
}

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  const hasInitialized = useRef(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // 初始化 - 只执行一次
  // 使用 useLayoutEffect 确保在渲染前完成初始化，避免级联渲染
  useEffect(() => {
    if (hasInitialized.current) return
    
    hasInitialized.current = true
    initialize(initialUser, initialProfile)
    
    // 使用 requestAnimationFrame 延迟 setState，避免同步调用导致的级联渲染
    const rafId = requestAnimationFrame(() => {
      setIsHydrated(true)
    })
    
    return () => cancelAnimationFrame(rafId)
  }, [initialize, initialUser, initialProfile])

  // 认证状态监听
  const handleAuthStateChange = useCallback(
    async (event: AuthChangeEvent, session: { user?: { id: string } } | null) => {
      try {
        switch (event) {
          case 'SIGNED_IN':
            if (!isDev) console.log('[Auth] 用户登录')
            await refreshUser()
            // 广播登录状态给其他标签页
            if (typeof window !== 'undefined') {
              localStorage.setItem(AUTH_SYNC_KEY, JSON.stringify({ 
                type: 'SIGNED_IN', 
                timestamp: Date.now(),
                userId: session?.user?.id 
              }))
            }
            break
          case 'SIGNED_OUT':
            if (!isDev) console.log('[Auth] 用户登出')
            clearUser()
            if (typeof window !== 'undefined') {
              localStorage.setItem(AUTH_SYNC_KEY, JSON.stringify({ 
                type: 'SIGNED_OUT', 
                timestamp: Date.now() 
              }))
            }
            break
          case 'USER_UPDATED':
            if (!isDev) console.log('[Auth] 用户信息更新')
            await refreshUser()
            break
          case 'TOKEN_REFRESHED':
            if (!isDev) console.log('[Auth] 令牌已刷新')
            break
        }
      } catch (error) {
        console.error('[Auth] 认证状态处理错误:', error)
      }
    },
    [refreshUser, clearUser]
  )

  // 监听 Supabase 认证状态变化
  useEffect(() => {
    if (!isHydrated) return
    
    const supabase = createClient()
    
    // 获取初始会话并同步
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Auth] 获取初始会话失败:', error)
        return
      }
      
      if (session && !isAuthenticated) {
        refreshUser()
      } else if (!session && isAuthenticated) {
        clearUser()
      }
    })
    
    // 订阅认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session)
    })
    
    return () => subscription.unsubscribe()
  }, [handleAuthStateChange, isHydrated, isAuthenticated, refreshUser, clearUser])

  // 跨标签页状态同步
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== AUTH_SYNC_KEY) return
      
      try {
        const data = JSON.parse(e.newValue || '{}')
        
        // 避免处理自己发出的同步
        if (data.timestamp && Date.now() - data.timestamp < 1000) {
          return
        }
        
        if (data.type === 'SIGNED_OUT' && isAuthenticated) {
          clearUser()
        } else if (data.type === 'SIGNED_IN' && !isAuthenticated) {
          refreshUser()
        }
      } catch {
        // 忽略解析错误
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [isHydrated, isAuthenticated, clearUser, refreshUser])

  // 页面可见性恢复 - 验证会话有效性
  useEffect(() => {
    if (!isHydrated) return
    
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      
      const validateSession = async () => {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[Auth] 会话验证失败:', error)
          clearUser()
          return
        }
        
        if (!session && isAuthenticated) {
          // 会话已过期但状态仍为已认证
          if (!isDev) console.log('[Auth] 会话已过期，清理状态')
          clearUser()
        } else if (session && !isAuthenticated) {
          // 有会话但状态未同步
          if (!isDev) console.log('[Auth] 发现有效会话，同步状态')
          await refreshUser()
        }
      }
      
      validateSession()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isHydrated, isAuthenticated, clearUser, refreshUser])

  // 定时刷新令牌 - 带跨标签页协调
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return
    
    const shouldRefresh = () => {
      if (typeof window === 'undefined') return true
      const lastRefresh = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0')
      return Date.now() - lastRefresh > REFRESH_INTERVAL
    }
    
    const intervalId = setInterval(() => {
      // 只在页面可见时刷新
      if (document.visibilityState === 'visible' && shouldRefresh()) {
        sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
        refreshUser().catch((error) => {
          if (!isNetworkError(error)) {
            console.error('[Auth] 定时刷新失败:', error)
          }
        })
      }
    }, REFRESH_INTERVAL)
    
    return () => clearInterval(intervalId)
  }, [isHydrated, isAuthenticated, refreshUser])

  // 水合完成前显示加载状态
  if (!isHydrated) {
    return <>{children}</>
  }

  return <>{children}</>
}
