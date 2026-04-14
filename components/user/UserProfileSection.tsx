/**
 * 用户资料区域组件
 * @module components/user/UserProfileSection
 * @description 显示用户头像、用户名、版本信息，包含下拉菜单触发功能
 */

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { UserAvt } from '@/components/ui'
import { UserDropdownMenu } from './UserDropdownMenu'
import type { SimpleUser, SimpleUserProfile, UserProfile } from '@/types'
import { getSafeDisplayName, resolveAvatarUrl } from '@/lib/user/avatar'

/**
 * 用户资料区域组件属性接口
 * @interface UserProfileSectionProps
 */
interface UserProfileSectionProps {
  /** 当前用户（支持SupabaseUser或简化用户对象） */
  user?: SupabaseUser | SimpleUser | null
  /** 用户资料（支持SimpleUserProfile或完整UserProfile） */
  profile?: SimpleUserProfile | UserProfile | null
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 用户资料区域组件
 * @function UserProfileSection
 * @param {UserProfileSectionProps} props - 组件属性
 * @returns {JSX.Element} 用户资料区域
 *
 * @example
 * <UserProfileSection user={currentUser} />
 */
export function UserProfileSection({ user, profile, className = '' }: UserProfileSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  /**
   * 切换下拉菜单
   */
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  /**
   * 关闭下拉菜单
   */
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  /**
   * 预加载个人主页路由
   * @description 在用户头像区域悬停时预加载个人主页，优化LCP性能
   */
  const handleMouseEnter = useCallback(() => {
    router.prefetch('/profile')
  }, [router])

  /**
   * 获取用户显示信息
   * 头像URL优先级：profile.avatar_url > user_metadata.avatar_url
   * 注意：传入userId确保头像一致性，无头像时自动生成默认头像
   * 匿名用户显示访客信息
   */
  const isAuthenticated = !!user && !!user.id
  const userId = user?.id || 'guest'
  const userEmail = user?.email || ''
  const userName = isAuthenticated
    ? getSafeDisplayName(
        profile?.username || user?.user_metadata?.username || (userEmail ? userEmail.split('@')[0] : undefined),
        '用户'
      )
    : '访客'
  const avatarUrl = isAuthenticated
    ? resolveAvatarUrl(profile?.avatar_url, user?.user_metadata?.avatar_url)
    : undefined

  return (
    <div className={`relative ${className}`}>
      {/* 用户信息区域 */}
      <div
        className="flex justify-center xl:justify-start items-center xl:items-start gap-4 xl:gap-3"
        onMouseEnter={handleMouseEnter}
      >
        <button
          id="user-avatar-button"
          onClick={toggleDropdown}
          className="relative cursor-pointer"
          aria-label="用户菜单"
          aria-expanded={isDropdownOpen}
        >
          <UserAvt
            name={userName}
            userId={userId}
            avatarUrl={avatarUrl}
            size="sm"
            className="shadow-sm ring-2 ring-white"
          />
          {/* 在线状态指示器 - 仅登录用户显示 */}
          {isAuthenticated && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-xf-success border-2 border-white rounded-full" />
          )}
        </button>

        {/* 用户名和版本信息（仅桌面端显示） */}
        <div className="hidden xl:block pt-1">
          <div className="font-medium text-xf-dark text-sm mb-0.5 truncate max-w-[120px]">
            {userName}
          </div>
          <div className="text-xs text-xf-primary">
            {isAuthenticated ? '免费版' : '点击登录'}
          </div>
        </div>
      </div>

      {/* 下拉菜单 */}
      <UserDropdownMenu
        user={user}
        isOpen={isDropdownOpen}
        onClose={closeDropdown}
      />
    </div>
  )
}
