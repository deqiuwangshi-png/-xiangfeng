/**
 * 用户徽章组合组件
 * @module components/user/UserBadges
 * @description 组合显示认证标志和等级标志
 */

import { UserRole } from '@/types'
import { LevelBadge } from './LevelBadge'

interface UserBadgesProps {
  /** 用户角色 */
  role: UserRole
  /** 用户等级 1-12 */
  level: number
  /** 是否显示等级名称 */
  showLevelName?: boolean
  /** 尺寸：sm(小) / md(中) / lg(大) */
  size?: 'sm' | 'md' | 'lg'
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 用户徽章组合组件
 * 水平排列：等级徽章 + 管理员标识（如有）
 *
 * @param {UserBadgesProps} props - 组件属性
 * @returns {JSX.Element} 徽章组合组件
 *
 * @example
 * <UserBadges role="admin" level={8} />
 *
 * @example
 * <UserBadges role="user" level={3} showLevelName size="sm" />
 */
export function UserBadges({
  role,
  level,
  showLevelName = false,
  size = 'md',
  className = '',
}: UserBadgesProps) {
  const isAdmin = role === 'admin' || role === 'super_admin'

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* 等级徽章 */}
      <LevelBadge level={level} showName={showLevelName} size={size} />

      {/* 管理员标识 */}
      {isAdmin && (
        <span
          className={`
            inline-flex items-center justify-center
            ${size === 'sm' ? 'w-4 h-4 text-[8px]' : size === 'lg' ? 'w-5 h-5 text-[10px]' : 'w-4.5 h-4.5 text-[9px]'}
            bg-xf-primary text-white rounded-full font-bold
          `}
          title={role === 'super_admin' ? '超级管理员' : '管理员'}
        >
          V
        </span>
      )}
    </div>
  )
}
