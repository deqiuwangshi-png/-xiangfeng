/**
 * 用户资料区域组件
 * @module components/user/UserProfileSection
 * @description 显示用户头像、用户名、版本信息，包含下拉菜单触发功能
 */

'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { UserDropdownMenu } from './UserDropdownMenu'

/**
 * UserProfileSection Props 接口
 * @interface UserProfileSectionProps
 */
interface UserProfileSectionProps {
  /** 当前用户 */
  user?: SupabaseUser | null
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

  // 获取用户显示信息（优先使用profile数据，保持与编辑页一致）
  const userEmail = user?.email || '用户'
  const userName = profile?.username || user?.user_metadata?.username || userEmail.split('@')[0] || '用户'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 
    `https://api.dicebear.com/7.x/micah/svg?seed=${user?.id || 'Felix'}&backgroundColor=B6CAD7`

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
          <div className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white overflow-hidden bg-xf-soft/20">
            <Image
              src={avatarUrl}
              alt="用户头像"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              loading="eager"
              unoptimized={avatarUrl.includes('dicebear.com')}
            />
          </div>
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
