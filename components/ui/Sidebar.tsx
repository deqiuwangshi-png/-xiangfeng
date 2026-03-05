'use client'

/**
 * 侧边栏组件
 * @module components/ui/Sidebar
 * @description 应用主导航侧边栏，只负责导航和布局
 */

import { Home, Edit3, FolderOpen, BellRing, Gift } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { UserProfileSection } from '@/components/user/UserProfileSection'

/**
 * 导航项接口
 * @interface NavItem
 */
interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

/**
 * 主导航配置
 * @constant navItems
 */
const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home, href: '/home' },
  { id: 'publish', label: '发布', icon: Edit3, href: '/publish' },
  { id: 'draft', label: '文章', icon: FolderOpen, href: '/drafts' },
  { id: 'inbox', label: '通知', icon: BellRing, href: '/inbox' },
  { id: 'rewards', label: '福利', icon: Gift, href: '/rewards' },
]

/**
 * 预加载路由配置
 * @constant PRELOAD_ROUTES
 */
const PRELOAD_ROUTES = ['/home', '/publish', '/drafts', '/inbox', '/rewards']

/**
 * 用户资料接口
 * @interface UserProfile
 */
interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string
}

/**
 * Sidebar Props 接口
 * @interface SidebarProps
 */
interface SidebarProps {
  user?: SupabaseUser | null
  /** 用户资料（从profiles表获取，用于显示头像） */
  profile?: UserProfile | null
}

/**
 * 侧边栏组件
 * @function Sidebar
 * @param {SidebarProps} props - 组件属性
 * @returns {JSX.Element} 侧边栏组件
 * 
 * @description
 * 职责：
 * - 显示用户资料区域（头像、下拉菜单）
 * - 显示主导航菜单
 * - 显示版权信息
 * - 路由预加载优化
 * 
 * @example
 * <Sidebar user={currentUser} />
 */
export function Sidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  /**
   * 预加载关键路由
   */
  useEffect(() => {
    const preloadRoutes = () => {
      PRELOAD_ROUTES.forEach(route => {
        if (route !== pathname) {
          router.prefetch(route)
        }
      })
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(preloadRoutes, { timeout: 2000 })
    } else {
      setTimeout(preloadRoutes, 1000)
    }
  }, [router, pathname])

  /**
   * 计算当前激活的导航项
   */
  const activeNav = useMemo(() => {
    if (pathname === '/home') return 'home'
    if (pathname === '/publish') return 'publish'
    if (pathname === '/drafts') return 'draft'
    if (pathname === '/inbox') return 'inbox'
    return 'home'
  }, [pathname])

  return (
    <aside className="w-[80px] xl:w-[220px] shrink-0 flex flex-col h-full pt-8 pb-8 px-2 xl:px-6 bg-xf-light border-r border-xf-surface/30 transition-all duration-300">
      {/* 用户资料区域 */}
      <div className="mb-8 pl-2">
        <UserProfileSection user={user} profile={profile} />
      </div>

      {/* 主导航菜单 */}
      <nav className="flex-1 space-y-1 flex flex-col justify-start pl-0 xl:pl-2">
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          
          const handleMouseEnter = () => {
            if (item.href !== pathname) {
              router.prefetch(item.href)
            }
          }
          
          return (
            <a
              key={item.id}
              href={item.href}
              onMouseEnter={handleMouseEnter}
              className={`
                nav-item flex items-center justify-center xl:justify-start 
                gap-3 xl:gap-5 py-3 transition-all relative group
                ${isActive ? 'text-xf-accent font-semibold' : 'text-xf-primary hover:text-xf-accent'}
              `}
            >
              {/* 激活状态指示器 */}
              <div
                className={`
                  nav-active-indicator absolute left-0 h-[60%] w-1 bg-xf-accent rounded-r 
                  transition-all duration-300
                  ${isActive ? 'opacity-100 h-[80%]' : 'opacity-0'}
                `}
              />
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-lg tracking-wider hidden xl:inline">{item.label}</span>
            </a>
          )
        })}
      </nav>

      {/* 版权信息 */}
      <div className="mt-auto pt-6 border-t border-xf-bg/40 text-center">
        <div className="text-xs text-xf-primary font-medium tracking-wider hidden xl:block">
          ©2026 相逢
        </div>
        <div className="text-xs text-xf-primary font-medium xl:hidden">相</div>
      </div>
    </aside>
  )
}
