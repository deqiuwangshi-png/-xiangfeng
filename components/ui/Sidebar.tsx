'use client'

/**
 * 侧边栏组件
 * @module components/ui/Sidebar
 * @description 应用主导航侧边栏，只负责导航和布局
 *
 * @优化说明
 * - 接收用户数据通过 props，避免 hydration 不匹配
 * - 支持服务端状态水合
 * - 使用全局认证状态管理（Zustand）作为备选
 *
 * @关键修复 2026-04-08
 * - 添加 user 和 profile props，从父组件接收初始状态
 * - 避免直接从 store 读取导致的 hydration 问题
 * - 确保首次渲染时显示正确的用户头像
 */

import { Home, Edit3, FolderOpen, BellRing, Gift } from '@/components/icons'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserProfileSection } from '@/components/user'
import { useInboxCache, useAuthUser } from '@/hooks'
import type { SimpleUser, UserProfile } from '@/types/user/user'

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
 * 预加载路由配置 - 优化后预加载核心常用路由
 * @constant PRELOAD_ROUTES
 * @description
 * - 预加载用户最可能访问的核心页面
 * - 包含个人主页，优化LCP性能
 * - 平衡资源消耗和预加载效果
 * - 其他路由通过鼠标悬停按需预加载
 */
const PRELOAD_ROUTES = ['/home', '/publish', '/drafts', '/inbox', '/profile']

/**
 * 侧边栏组件 Props 接口
 * @interface SidebarProps
 */
interface SidebarProps {
  /** 当前用户（从父组件传入，避免 hydration 不匹配） */
  user?: SimpleUser | null
  /** 用户资料（从父组件传入） */
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
 * @优化说明
 * - 优先使用 props 传入的用户数据（避免 hydration 不匹配）
 * - 如果 props 未提供，从全局 Store 获取（客户端状态变化时）
 * - 自动响应登录/登出状态变化
 *
 * @关键修复 2026-04-08
 * - 添加 user 和 profile props 支持
 * - 优先使用 props 数据，确保首次渲染正确
 * - 避免 hydration 期间显示访客头像
 *
 * @example
 * <Sidebar user={user} profile={profile} />
 */
export function Sidebar({ user: propUser, profile: propProfile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  {/* 从全局 Store 获取用户信息（用于客户端状态更新） */}
  const { user: storeUser, profile: storeProfile } = useAuthUser()

  {/* 优先使用 props 传入的数据，避免 hydration 不匹配 */}
  const user = propUser ?? storeUser
  const profile = propProfile ?? storeProfile

  {/* 使用客户端缓存获取未读消息数量 */}
  const { unreadCount } = useInboxCache(user?.id || '')

  /**
   * 智能预加载关键路由
   * @description
   * - 使用 requestIdleCallback 在浏览器空闲时预加载
   * - 预加载用户最可能访问的核心页面
   * - 其他路由通过鼠标悬停按需预加载，避免资源浪费
   * - 减少延迟时间，确保用户快速切换时能享受到预加载的好处
   */
  useEffect(() => {
    const preloadRoutes = () => {
      PRELOAD_ROUTES.forEach(route => {
        if (route !== pathname) {
          router.prefetch(route)
        }
      })
    }

    {/* 减少延迟时间，确保关键资源优先加载的同时，用户能快速享受到预加载的好处 */}
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(preloadRoutes, { timeout: 1000 })
      } else {
        preloadRoutes()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [router, pathname])

  /**
   * 计算当前激活的导航项
   */
  const activeNav = useMemo(() => {
    if (pathname === '/home') return 'home'
    if (pathname === '/publish') return 'publish'
    if (pathname === '/drafts') return 'draft'
    if (pathname === '/inbox') return 'inbox'
    if (pathname === '/rewards' || pathname.startsWith('/rewards/')) return 'rewards'
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
          
          const showBadge = item.id === 'inbox' && unreadCount > 0

          return (
            <Link
              key={item.id}
              href={item.href}
              onMouseEnter={handleMouseEnter}
              className={`
                nav-item flex items-center justify-center xl:justify-start 
                gap-3 xl:gap-5 py-3 transition-all relative group
                ${isActive ? 'text-xf-accent font-semibold' : 'text-xf-primary hover:text-xf-accent'}
              `}
            >
              <div
                className={`
                  nav-active-indicator absolute left-0 h-[60%] w-1 bg-xf-accent rounded-r 
                  transition-all duration-300
                  ${isActive ? 'opacity-100 h-[80%]' : 'opacity-0'}
                `}
              />
              <div className="relative">
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                {/* 未读消息红点徽章 */}
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1.5 text-[10px] font-medium bg-red-500 text-white rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-lg tracking-wider hidden xl:inline">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* 版权信息 */}
      <div className="mt-auto pt-6 border-t border-xf-bg/40 text-center">
        <div className="text-xs text-xf-primary font-medium tracking-wider hidden xl:block">
          ©2026 相逢
        </div>
      </div>
    </aside>
  )
}
