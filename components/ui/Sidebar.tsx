'use client'

/**
 * 侧边栏组件（简化版）
 * @module components/ui/Sidebar
 */

import { useRef, useState } from 'react'
import { Home, Edit3, FolderOpen, BellRing } from '@/components/icons'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserProfileSection } from '@/components/user'
import { useInboxCache } from '@/hooks'
import type { SimpleUser, SimpleUserProfile } from '@/types'
import { MAIN_NAVIGATION_ITEMS, PRELOAD_ROUTES, type NavigationItem } from '@/config/navigation'

const NAV_ICONS = {
  home: Home,
  publish: Edit3,
  drafts: FolderOpen,
  inbox: BellRing,
} as const

interface SidebarProps {
  user?: { id: string; email?: string | null } | null
  profile?: SimpleUserProfile | null
  authState?: 'anonymous' | 'syncing' | 'authenticated'
}

export function Sidebar({ user, profile, authState = 'anonymous' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showLoginTooltip, setShowLoginTooltip] = useState<string | null>(null)
  const hasPrefetchedRef = useRef(false)

  const { unreadCount } = useInboxCache(user?.id || '')
  const isSuperAdmin = profile?.role === 'super_admin'

  useEffect(() => {
    if (hasPrefetchedRef.current) return

    const preloadRoutes = () => {
      PRELOAD_ROUTES.forEach(route => {
        if (route !== pathname) {
          router.prefetch(route)
        }
      })
      hasPrefetchedRef.current = true
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(preloadRoutes, { timeout: 1000 })
      } else {
        preloadRoutes()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [router, pathname])

  const activeNav = useMemo(() => {
    const normalizedPath = pathname === '/' ? '/home' : pathname
    const matched = MAIN_NAVIGATION_ITEMS.find((item) => {
      if (item.href === '/home') {
        return normalizedPath === '/home'
      }
      return normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`)
    })
    return matched?.id ?? null
  }, [pathname])

  // 转换 user 类型以匹配 UserProfileSection 期望的 SimpleUser
  const simpleUser: SimpleUser | null = user ? {
    id: user.id,
    email: user.email || '',
  } : null

  // 处理导航项点击
  const handleNavClick = (e: React.MouseEvent, item: NavigationItem) => {
    // 如果未登录且需要认证，显示提示但不跳转
    if (authState !== 'authenticated' && item.requireAuth) {
      e.preventDefault()
      setShowLoginTooltip(item.id)
      // 3秒后自动隐藏提示
      setTimeout(() => setShowLoginTooltip(null), 3000)
    }
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-xf-surface/30 z-40">
      {/* 用户资料区域 */}
      <div className="p-4 border-b border-xf-surface/30">
        <UserProfileSection user={simpleUser} profile={profile} authState={authState} />
      </div>

      {/* 主导航 */}
      <nav className="flex-1 p-4 space-y-1">
        {MAIN_NAVIGATION_ITEMS.filter((item) => item.showOnDesktop !== false).map((item) => {
          const ItemIcon = NAV_ICONS[item.icon]
          const isActive = activeNav === item.id
          const showBadge = item.id === 'inbox' && unreadCount > 0
          const showTooltip = showLoginTooltip === item.id

          return (
            <div key={item.id} className="relative">
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-xf-primary/10 text-xf-primary font-medium' 
                    : 'text-xf-dark hover:bg-xf-light hover:text-xf-primary'
                  }
                `}
              >
                <ItemIcon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="min-w-[18px] h-[18px] px-1 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              
              {/* 登录提示 */}
              {showTooltip && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-xf-dark text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                  {authState === 'anonymous' ? '请登录后使用此功能' : '会话同步中，请稍候'}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-xf-dark"></div>
                </div>
              )}
            </div>
          )
        })}

        {isSuperAdmin && (
          <Link
            href="/admin/reports"
            className={`
              mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border
              transition-all duration-200
              ${pathname?.startsWith('/admin')
                ? 'bg-xf-primary/10 border-xf-primary/30 text-xf-primary font-medium'
                : 'border-xf-bg/60 text-xf-dark hover:bg-xf-light hover:text-xf-primary'
              }
            `}
          >
            <span className="text-sm">举报管理</span>
          </Link>
        )}
      </nav>

      {/* 底部版权 */}
      <div className="p-4 border-t border-xf-surface/30 text-xs text-xf-medium text-center">
        © 2026 相逢
      </div>
    </aside>
  )
}
