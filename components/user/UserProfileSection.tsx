/**
 * 用户资料区域组件
 * @module components/user/UserProfileSection
 * @description 显示用户头像、用户名、版本信息，包含下拉菜单触发功能
 */

'use client'

import { useState, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder'
import { UserDropdownMenu } from './UserDropdownMenu'

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
 * UserProfileSection Props 接口
 * @interface UserProfileSectionProps
 */
interface UserProfileSectionProps {
  /** 当前用户（支持SupabaseUser或简化用户对象） */
  user?: SupabaseUser | SimpleUser | null
  /** 用户资料（从profiles表获取，优先级高于user.user_metadata） */
  profile?: {
    username?: string
    avatar_url?: string
  } | null
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
   * 获取用户显示信息
   * 头像URL优先级：profile.avatar_url > user_metadata.avatar_url
   * 注意：不再动态生成头像，必须使用数据库中存储的avatar_url
   * 如果avatar_url为空，AvatarPlaceholder会显示首字母占位符
   */
  const userEmail = user?.email || '用户'
  const userName = profile?.username || user?.user_metadata?.username || userEmail.split('@')[0] || '用户'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url

  return (
    <div className={`relative ${className}`}>
      {/* 用户信息区域 */}
      <div className="flex justify-center xl:justify-start items-center xl:items-start gap-4 xl:gap-3">
        <button
          id="user-avatar-button"
          onClick={toggleDropdown}
          className="relative cursor-pointer"
          aria-label="用户菜单"
          aria-expanded={isDropdownOpen}
        >
          <AvatarPlaceholder
            name={userName}
            avatarUrl={avatarUrl}
            size="sm"
            className="shadow-sm ring-2 ring-white"
          />
          {/* 在线状态指示器 */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-xf-success border-2 border-white rounded-full" />
        </button>
        
        {/* 用户名和版本信息（仅桌面端显示） */}
        <div className="hidden xl:block pt-1">
          <div className="font-medium text-xf-dark text-sm mb-0.5 truncate max-w-[120px]">
            {userName}
          </div>
          <div className="text-xs text-xf-primary">免费版</div>
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
