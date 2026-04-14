/**
 * 用户下拉菜单组件
 * @module components/user/UserDropdownMenu
 * @description 用户头像下拉菜单，包含个人主页、设置、退出登录等功能
 */

'use client'

import { User, Newspaper, MessageSquare, Settings, LogOut, LogIn } from 'lucide-react'
import { useMemo, useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { logout } from '@/lib/auth/client'
import { FEISHU_FEEDBACK_FORM_URL } from '@/constants/feedback'
import type { SimpleUser, DropdownItem } from '@/types'

interface UserDropdownMenuProps {
  user?: SupabaseUser | SimpleUser | null
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function UserDropdownMenu({ user, isOpen, onClose, className = '' }: UserDropdownMenuProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const isAuthenticated = !!user

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }, [router])

  const handleLogoutWithClose = useCallback(() => {
    handleLogout()
    onClose()
  }, [handleLogout, onClose])

  const menuItems: DropdownItem[] = useMemo(() => {
    // 匿名用户只显示去登录
    if (!isAuthenticated) {
      return [
        { label: '去登录', icon: LogIn, href: '/login' },
      ]
    }
    // 已登录用户显示完整菜单
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
      className={`absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg z-50 ${className}`}
    >
      <div className="py-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          
          if (item.externalUrl) {
            return (
              <a
                key={index}
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </a>
            )
          }
          
          if (item.onClick) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                disabled={isLoggingOut}
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                  item.isDanger ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </button>
            )
          }
          
          return (
            <Link
              key={index}
              href={item.href || '#'}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
