'use client'

/**
 * 个人资料头部组件 - 紧凑横向布局
 * @module components/profile/ProfileHeader
 * @description 显示用户的头像、用户名、简介和统计信息
 * @更新时间: 2026-03-22
 */

import { UserPlus, UserCheck, MapPin, Calendar, FileText, Users, ThumbsUp } from '@/components/icons'
import { useState } from 'react'
import { UserAvatar } from '@/components/ui'
import type { UserDisplayInfo, UserStats } from '@/types'

interface ProfileHeaderProps {
  user: UserDisplayInfo
  stats: UserStats
}

/**
 * 个人资料头部组件 - 紧凑横向布局
 * @description
 * 改进点：
 * - 横向紧凑布局，减少纵向空间占用
 * - 统计信息整合到头部右侧
 * - 减少阴影和圆角，与侧边栏风格统一
 * - 优化F型阅读路径，快速进入内容区
 */
export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="bg-white border border-xf-bg/60 rounded-xl p-4 sm:p-5 mb-4">
      {/* 横向窄条：头像+用户名+操作按钮 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* 头像区域 */}
          <div className="relative shrink-0">
            <div className="relative">
              <UserAvatar
                name={user.username}
                userId={user.id}
                avatarUrl={user.avatarUrl}
                size="lg"
                className="shadow-md ring-2 ring-white w-12 h-12 sm:w-14 sm:h-14"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
          </div>

          {/* 用户名和位置信息 */}
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-serif text-xf-accent font-bold truncate">
              {user.username}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-xf-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{user.location || '未设置位置'}</span>
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {user.joinDate}加入
              </span>
            </div>
          </div>
        </div>

        {/* 关注按钮 */}
        <button
          onClick={handleFollowClick}
          className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${
            isFollowing
              ? 'bg-xf-light text-xf-medium border border-xf-bg/60'
              : 'bg-xf-accent text-white hover:bg-xf-accent/90'
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">已关注</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">关注</span>
            </>
          )}
        </button>
      </div>

      {/* 个人简介 - 紧凑显示 */}
      {user.bio && (
        <p className="mt-3 text-sm text-xf-dark/80 leading-relaxed line-clamp-2">
          {user.bio}
        </p>
      )}

      {/* 统计信息 - 横向排列，融入头部 */}
      <div className="mt-4 pt-4 border-t border-xf-bg/60 flex items-center justify-between sm:justify-start sm:gap-8">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-xf-info" />
          <span className="text-sm font-semibold text-xf-accent">{stats.articles}</span>
          <span className="text-xs text-xf-medium">文章</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-xf-primary" />
          <span className="text-sm font-semibold text-xf-accent">{stats.followers}</span>
          <span className="text-xs text-xf-medium">关注者</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ThumbsUp className="w-4 h-4 text-xf-accent" />
          <span className="text-sm font-semibold text-xf-accent">{stats.likes}</span>
          <span className="text-xs text-xf-medium">获赞</span>
        </div>
      </div>
    </div>
  )
}
