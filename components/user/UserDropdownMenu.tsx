/**
 * 用户下拉菜单组件
 * @module components/user/UserDropdownMenu
 * @description 用户头像下拉菜单，包含个人主页、设置、退出登录等功能
 */

'use client'

import { User, Newspaper, MessageSquare, Settings, LogOut} from 'lucide-react'
import { useMemo, useEffect, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useLogout } from '@/lib/auth'

/**
 * 下拉菜单项接口
 * @interface DropdownItem
 */
interface DropdownItem {
  label: string
  icon: React.ElementType
  href?: string
  isDanger?: boolean
  onClick?: () => void
}

/**
 * 简化用户对象接口
 * @interface SimpleUser
 */
interface SimpleUser {
  id: string
  email: string
  user_metadata?: {
    username?: string
    avatar_url?: string
  }
}

/**
 * UserDropdownMenu Props 接口
 * @interface UserDropdownMenuProps
 */
interface UserDropdownMenuProps {
  /** 当前用户（支持SupabaseUser或简化用户对象，当前未使用但保留用于未来扩展） */
  user?: SupabaseUser | SimpleUser | null
  /** 是否打开 */
  isOpen: boolean
  /** 关闭菜单的回调 */
  onClose: () => void
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 用户下拉菜单组件
 * @function UserDropdownMenu
 * @param {UserDropdownMenuProps} props - 组件属性
 * @returns {JSX.Element | null} 下拉菜单组件
 * 
 * @example
 * <UserDropdownMenu 
 *   user={currentUser} 
 *   isOpen={isDropdownOpen} 
 *   onClose={() => setIsDropdownOpen(false)} 
 * />
 */
export function UserDropdownMenu({ isOpen, onClose, className = '' }: UserDropdownMenuProps) {
  const { isLoggingOut, handleLogout } = useLogout()

  /**
   * 处理退出登录并关闭菜单
   */
  const handleLogoutWithClose = useCallback(() => {
    handleLogout()
    onClose()
  }, [handleLogout, onClose])

  /**
   * 菜单项配置
   */
  const menuItems: DropdownItem[] = useMemo(() => [
    { label: '个人主页', icon: User, href: '/profile' },
    { label: '更新公告', icon: Newspaper, href: '/updates' },
    { label: '产品反馈', icon: MessageSquare, href: '/feedback' },
    { label: '用户设置', icon: Settings, href: '/settings' },
    { 
      label: isLoggingOut ? '退出中...' : '退出登录', 
      icon: LogOut, 
      isDanger: true, 
      onClick: handleLogoutWithClose 
    },
  ], [isLoggingOut, handleLogoutWithClose])

  /**
   * 监听点击外部事件
   */
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const dropdown = document.getElementById('user-dropdown-menu')
      const avatarButton = document.getElementById('user-avatar-button')
      
      if (dropdown && !dropdown.contains(target) && !avatarButton?.contains(target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      id="user-dropdown-menu"
      className={`
        absolute top-16 left-0 w-48 
        bg-white border border-xf-bg/80 backdrop-blur-md 
        rounded-2xl shadow-deep py-2 z-50 
        origin-top-left fade-in-up
        ${className}
      `}
    >
      {menuItems.map((item) => (
        item.onClick ? (
          <button
            key={item.label}
            onClick={item.onClick}
            disabled={isLoggingOut}
            className={`
              w-full flex items-center gap-3 px-5 py-3 text-sm 
              transition-colors text-left
              ${item.isDanger
                ? 'text-red-500 hover:bg-red-50/50'
                : 'text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent'
              }
              ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ) : (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`
              flex items-center gap-3 px-5 py-3 text-sm 
              transition-colors
              ${item.isDanger
                ? 'text-red-500 hover:bg-red-50/50'
                : 'text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent'
              }
            `}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </a>
        )
      ))}
    </div>
  )
}
