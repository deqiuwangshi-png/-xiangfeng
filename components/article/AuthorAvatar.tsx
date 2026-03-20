'use client'

/**
 * 作者头像组件
 * @module components/article/AuthorAvatar
 * @description 显示作者头像，带关注功能按钮
 */

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import type { AuthorAvatarProps } from '@/types'
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder'
import { toggleFollow, getFollowStatus } from '@/lib/user/actions/follow'
import { useArticleToast } from '@/hooks/useArticleToast'

/**
 * 作者头像组件
 *
 * @param {AuthorAvatarProps} props - 组件属性
 * @returns {JSX.Element} 作者头像组件
 *
 * @description
 * 作者头像+关注按钮
 * - 显示作者头像
 * - 底部白色加号按钮表示可关注
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
  const { showSuccess, showError, showAuthRequired, showWarning } = useArticleToast()

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
   */
  const handleFollow = async () => {
    {/* 未登录提示 */}
    if (!currentUser) {
      showAuthRequired('关注作者')
      return
    }

    {/* 不能关注自己 */}
    if (currentUser.id === authorId) {
      showWarning('不能关注自己')
      return
    }

    setIsLoading(true)

    try {
      {/* 调用真实关注API */}
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

  return (
    <div className="author-avatar-container">
      {/* 头像 */}
      <div className="author-avatar-wrapper">
        <div className="author-avatar-image">
          <AvatarPlaceholder
            name={authorName}
            avatarUrl={authorAvatar}
            size="md"
          />
        </div>

        {/* 关注按钮 - 白色圆形加号 */}
        <button
          className={`follow-btn ${isFollowing ? 'following' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={handleFollow}
          disabled={isLoading}
          title={isFollowing ? '取消关注' : '关注作者'}
        >
          {isFollowing ? (
            // 已关注状态显示对勾
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
            // 未关注状态显示加号
            <Plus className="w-3 h-3 text-gray-600" strokeWidth={3} />
          )}
        </button>
      </div>
    </div>
  )
}
