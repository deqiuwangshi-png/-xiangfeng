'use client'

/**
 * 移动端底部导航组件
 * @module components/mobile/MobileBottomNav
 * @description 应用主底部导航栏，固定在底部
 *
 * @优化说明
 * - 使用全局认证状态管理（Zustand）
 * - 通过 useUserId Hook 获取用户 ID
 * - 无需通过 props 传递用户数据
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Edit3, FolderOpen, BellRing, Gift } from '@/components/icons'
import { useUserId } from '@/hooks'
import { useInboxCache } from '@/hooks/notification/useInboxCache'

/**
 * 导航项配置
 * @constant navItems
 */
const navItems = [
  { id: 'home', label: '首页', icon: Home, href: '/home' },
  { id: 'publish', label: '发布', icon: Edit3, href: '/publish' },
  { id: 'drafts', label: '文章', icon: FolderOpen, href: '/drafts' },
  { id: 'inbox', label: '消息', icon: BellRing, href: '/inbox' },
  { id: 'rewards', label: '福利', icon: Gift, href: '/rewards' },
]

/**
 * 移动端底部导航组件
 * @returns {JSX.Element} 底部导航栏
 *
 * @优化说明
 * - 使用 useUserId Hook 从全局 Store 获取用户 ID
 * - 无需通过 props 传递用户数据
 * - 自动响应登录/登出状态变化
 */
export function MobileBottomNav() {
  const pathname = usePathname()

  {/* 从全局 Store 获取用户 ID */}
  const userId = useUserId()

  const { unreadCount } = useInboxCache(userId || '')

  /**
   * 判断导航项是否激活
   * @param {string} href - 导航链接
   * @returns {boolean} 是否激活
   */
  const isActive = (href: string): boolean => {
    if (href === '/home') return pathname === '/home'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-xf-surface/30 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const showBadge = item.id === 'inbox' && unreadCount > 0

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex flex-col items-center justify-center 
                w-full h-full gap-0.5
                transition-colors duration-200
                ${active ? 'text-xf-accent' : 'text-xf-medium'}
              `}
              style={{ touchAction: 'manipulation' }}
              onPointerDown={(e) => {
                {/* 阻止 React 实验性 draggable 的指针捕获 */}
                e.preventDefault()
              }}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 text-[10px] font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
