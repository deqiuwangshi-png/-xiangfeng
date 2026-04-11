/**
 * 用户下拉菜单组件
 * @module components/user/UserDropdownMenu
 * @description 用户头像下拉菜单，包含个人主页、设置、退出登录等功能
 */

'use client'

import { User, Newspaper, MessageSquare, Settings, LogOut, LogIn, UserPlus } from 'lucide-react'
import { useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useLogout } from '@/lib/auth/client'
import { FEISHU_FEEDBACK_FORM_URL } from '@/constants/feedback'
import type { SimpleUser, DropdownItem } from '@/types'

/**
 * 用户下拉菜单组件属性接口
 * @interface UserDropdownMenuProps
 */
interface UserDropdownMenuProps {
  /** 当前用户（支持SupabaseUser或简化用户对象） */
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
export function UserDropdownMenu({ user, isOpen, onClose, className = '' }: UserDropdownMenuProps) {
  const { isLoggingOut, handleLogout } = useLogout()
  const isAuthenticated = !!user

  /**
   * 处理退出登录并关闭菜单
   */
  const handleLogoutWithClose = useCallback(() => {
    handleLogout()
    onClose()
  }, [handleLogout, onClose])

  /**
   * 菜单项配置 - 根据登录状态显示不同菜单
   */
  const menuItems: DropdownItem[] = useMemo(() => {
    if (!isAuthenticated) {
      {/* 匿名用户菜单 - 提供登录和注册入口 */}
      return [
        { label: '登录', icon: LogIn, href: '/login' },
        { label: '注册', icon: UserPlus, href: '/register' },
        { label: '更新公告', icon: Newspaper, href: '/updates' },
        { label: '产品反馈', icon: MessageSquare, externalUrl: FEISHU_FEEDBACK_FORM_URL },
      ]
    }
    {/* 已登录用户菜单 */}
    return [
      { label: '个人主页', icon: User, href: '/profile' },
      { label: '更新公告', icon: Newspaper, href: '/updates' },
      { label: '产品反馈', icon: MessageSquare, externalUrl: FEISHU_FEEDBACK_FORM_URL },
      { label: '用户设置', icon: Settings, href: '/settings' },
      {
        label: isLoggingOut ? '退出中...' : '退出登录',
        icon: LogOut,
        isDanger: true,
        onClick: handleLogoutWithClose
      },
    ]
  }, [isAuthenticated, isLoggingOut, handleLogoutWithClose])

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
        ) : item.externalUrl ? (
          <a
            key={item.label}
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={`
              flex items-center gap-3 px-5 py-3 text-sm 
              transition-colors
              text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent
            `}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </a>
        ) : (
          <Link
            key={item.href ?? item.label}
            href={item.href!}
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
          </Link>
        )
      ))}
    </div>
  )
}
