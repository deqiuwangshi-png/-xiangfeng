'use client'

/**
 * 个人资料头部组件
 *
 * 作用: 显示用户的头像、用户名、简介、操作按钮和数据指标
 *
 * @returns {JSX.Element} 个人资料头部组件
 *
 * 使用说明:
 *   - 使用 Client Component 处理交互逻辑
 *   - 使用 Next Image 优化图片加载
 *   - 使用 lucide-react 图标组件
 *
 * 更新时间: 2026-03-22
 */

import { UserPlus, UserCheck, MapPin, Calendar, Star } from '@/components/icons'
import { useState } from 'react'
import { UserAvatar } from '@/components/ui'
import type { UserDisplayInfo } from '@/lib/user/getUserDisplayInfo'
import type { UserStats } from '@/lib/settings/actions'

/**
 * ProfileHeader Props 接口
 *
 * @interface ProfileHeaderProps
 * @property {UserDisplayInfo} user - 用户显示信息
 * @property {UserStats} stats - 用户统计数据
 */
interface ProfileHeaderProps {
  user: UserDisplayInfo
  stats: UserStats
}

/**
 * 个人资料头部组件
 *
 * @function ProfileHeader
 * @param {ProfileHeaderProps} props - 组件属性
 * @returns {JSX.Element} 个人资料头部组件
 *
 * @description
 * 提供个人资料头部的完整功能，包括：
 * - 用户头像（带在线状态指示器和星星徽章）
 * - 用户名和状态文本
 * - 位置信息
 * - 操作按钮（发消息、关注）
 * - 个人简介
 * - 数据指标条（文章、关注者、获赞）
 *
 * @layout
 * - 使用 flex 布局
 * - 横向窄条设计，压缩首屏空间
 * - 响应式设计（移动端和桌面端）
 */
export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="bg-white border border-xf-bg/60 rounded-2xl p-4 sm:p-5 mb-6">
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
              <span className="w-px h-3 bg-xf-bg/80" />
              <span className="flex items-center gap-1">
                <span className="font-semibold text-xf-accent">{stats.articles}</span>
                <span>文章</span>
              </span>
              <span className="w-px h-3 bg-xf-bg/80" />
              <span className="flex items-center gap-1">
                <span className="font-semibold text-xf-accent">{stats.followers}</span>
                <span>关注者</span>
              </span>
              <span className="w-px h-3 bg-xf-bg/80" />
              <span className="flex items-center gap-1">
                <span className="font-semibold text-xf-accent">{stats.likes}</span>
                <span>获赞</span>
              </span>
            </div>
          </div>
        </div>

        {/* 关注按钮 */}
        <button
          onClick={handleFollowClick}
          className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium flex items-center gap-1.5 text-xs sm:text-sm ${
            isFollowing
              ? 'bg-xf-light text-xf-medium border border-xf-bg/60'
              : 'bg-xf-accent text-white'
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

      {/* 个人简介 */}
      {user.bio && (
        <p className="mt-3 pt-3 border-t border-xf-bg/60 text-sm text-xf-dark/70 leading-relaxed line-clamp-2">
          {user.bio}
        </p>
      )}
    </div>
  )
}
