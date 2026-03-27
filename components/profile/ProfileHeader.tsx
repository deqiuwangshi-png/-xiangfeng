'use client'

/**
 * 个人资料头部组件 - 紧凑横向布局
 * @module components/profile/ProfileHeader
 * @description 显示用户的头像、用户名、简介和统计信息
 * @更新时间: 2026-03-22
 * @security
 * - 所有用户生成内容（用户名、简介、位置）都经过 escapeHtml 转义
 * - 防止 XSS 攻击，确保恶意脚本不会被执行
 */

import { UserPlus, UserCheck, MapPin, Calendar, FileText, Users, ThumbsUp, Filter } from '@/components/icons'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/ui'
import { VerifyBadge } from '@/components/user/VerifyBadge'
import { UserBadges } from '@/components/user/UserBadges'
import { escapeHtml } from '@/lib/utils/purify'
import { toggleFollow, getFollowStatus } from '@/lib/user/actions/follow'
import type { UserDisplayInfo, UserStats } from '@/types'

interface ProfileHeaderProps {
  user: UserDisplayInfo
  stats: UserStats
}

/**
 * 个人资料头部组件 - 紧凑横向布局
 * @description

 */
export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  /**
   * 获取初始关注状态
   */
  useEffect(() => {
    const loadFollowStatus = async () => {
      try {
        const result = await getFollowStatus(user.id)
        if (result.success && result.following !== undefined) {
          setIsFollowing(result.following)
        }
      } catch (error) {
        console.error('获取关注状态失败:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadFollowStatus()
  }, [user.id])

  /**
   * 处理关注/取消关注
   */
  const handleFollowClick = async () => {
    if (isLoading || isInitialLoading) return

    setIsLoading(true)
    try {
      const result = await toggleFollow(user.id)
      if (result.success) {
        setIsFollowing(result.following)
        toast.success(result.following ? '关注成功' : '已取消关注')
      } else {
        toast.error(result.error || '操作失败')
      }
    } catch (error) {
      toast.error('操作失败，请重试')
      console.error('关注操作失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 对用户生成内容进行 HTML 转义，防止 XSS 攻击
  const safeUsername = escapeHtml(user.username)
  const safeLocation = escapeHtml(user.location)
  const safeBio = escapeHtml(user.bio)

  return (
    <div className="bg-white border border-xf-bg/60 rounded-xl p-4 sm:p-5 mb-4">
      {/* 横向窄条：头像+用户名+操作按钮 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* 头像区域 - 带认证边框 */}
          <div className="relative shrink-0">
            <VerifyBadge role={user.role || 'user'}>
              <UserAvatar
                name={user.username}
                userId={user.id}
                avatarUrl={user.avatarUrl}
                size="lg"
                className="shadow-md w-12 h-12 sm:w-14 sm:h-14"
              />
            </VerifyBadge>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>

          {/* 用户名、等级徽章和位置信息 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif text-xf-accent font-bold truncate">
                {safeUsername}
              </h1>
              {/* 等级徽章 - 水平排列 */}
              {user.level && user.level > 0 && (
                <UserBadges
                  role={user.role || 'user'}
                  level={user.level}
                  size="sm"
                />
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-xf-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{safeLocation || '未设置位置'}</span>
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
          disabled={isLoading || isInitialLoading}
          className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${
            isFollowing
              ? 'bg-xf-light text-xf-medium border border-xf-bg/60'
              : 'bg-xf-accent text-white hover:bg-xf-accent/90'
          } ${isLoading || isInitialLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading || isInitialLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowing ? (
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
      {safeBio && (
        <p className="mt-3 text-sm text-xf-dark/80 leading-relaxed line-clamp-2">
          {safeBio}
        </p>
      )}

      {/* 个人领域标签 - 展示用户的兴趣领域 */}
      {user.domain && user.domain.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-xf-primary shrink-0" />
          {user.domain.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-xf-light text-xf-primary border border-xf-bg/60"
            >
              {item}
            </span>
          ))}
        </div>
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
