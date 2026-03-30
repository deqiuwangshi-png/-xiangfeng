'use client'

/**
 * 作者头像组件
 * @module components/article/AuthorAvatar
 * @description 显示作者头像，带关注功能按钮
 *
 * @安全特性
 * - 匿名用户无法点击头像跳转主页
 * - 匿名用户无法关注作者
 * - 点击时提示需要登录
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { AuthorAvatarProps } from '@/types'
import { UserAvt } from '@/components/ui'
import { toggleFollow, getFollowStatus } from '@/lib/user/actions/follow'
import { useArticleToast } from '@/hooks/article/useArticleToast'

/**
 * 作者头像组件
 *
 * @param {AuthorAvatarProps} props - 组件属性
 * @returns {JSX.Element} 作者头像组件
 *
 * @description
 * 作者头像+关注按钮
 * - 显示作者头像，已登录用户点击可跳转到作者个人主页
 * - 匿名用户点击头像提示登录
 * - 底部白色加号按钮表示可关注（仅登录用户可见）
 * - 点击后切换关注状态
 */
export function AuthorAvatar({
  authorId,
  authorName,
  authorAvatar,
  currentUser,
}: AuthorAvatarProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError, showAuthRequired } = useArticleToast()

  /**
   * 获取初始关注状态
   */
  const fetchFollowStatus = useCallback(async () => {
    if (!currentUser) {
      return
    }

    try {
      const result = await getFollowStatus(authorId)
      if (result.success && result.following !== undefined) {
        setIsFollowing(result.following)
      }
    } catch {
      // 获取失败时保持默认状态
    }
  }, [authorId, currentUser])

  /**
   * 组件加载时获取关注状态
   */
  useEffect(() => {
    fetchFollowStatus()
  }, [fetchFollowStatus])

  /**
   * 处理关注/取消关注
   *
   * @param {React.MouseEvent} e - 点击事件
   */
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 未登录提示
    if (!currentUser) {
      showAuthRequired('关注作者')
      return
    }

    // 不能关注自己
    if (currentUser.id === authorId) {
      return
    }

    setIsLoading(true)

    try {
      const result = await toggleFollow(authorId)

      if (result.success) {
        setIsFollowing(result.following)
        showSuccess('关注', !result.following)
      } else {
        showError(result.error || '操作失败', '请稍后重试')
      }
    } catch {
      showError('操作失败', '请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理头像点击 - 匿名用户提示登录
   *
   * @param {React.MouseEvent} e - 点击事件
   */
  const handleAvatarClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault()
      showAuthRequired('查看作者主页')
    }
  }

  return (
    <div className="author-avatar-container">
      {/* 头像 - 已登录用户点击跳转到作者个人主页 */}
      <Link
        href={`/profile/${authorId}`}
        className={`author-avatar-wrapper ${currentUser ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        title={currentUser ? `查看 ${authorName} 的个人主页` : '登录后查看作者主页'}
        onClick={handleAvatarClick}
      >
        <div className="author-avatar-image">
          <UserAvt
            name={authorName}
            userId={authorId}
            avatarUrl={authorAvatar}
            size="sm"
          />
        </div>

        {/* 关注按钮 - 仅登录用户可见且可操作 */}
        {currentUser && (
          <button
            className={`follow-btn ${isFollowing ? 'following' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFollow}
            disabled={isLoading}
            title={isFollowing ? '取消关注' : '关注作者'}
          >
            {isFollowing ? (
              <svg
                className="w-3 h-3 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <Plus className="w-3 h-3 text-gray-600" strokeWidth={3} />
            )}
          </button>
        )}
      </Link>
    </div>
  )
}

export default AuthorAvatar
