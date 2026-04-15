'use client'

/**
 * 文章操作按钮组件
 *
 * @module components/article/ArtAct
 * @description 提供文章点赞、评论、分享、收藏功能
 * @version 2.0.0
 * @更新说明 使用统一的 useOptimisticMutation 进行乐观更新
 */

import { useState } from 'react'
import { Heart, MessageCircle } from '@/components/icons'
import type { ArtActProps } from '@/types'
import { AuthorAvatar } from '../ui/AuthorAvatar'
import { MoreActions } from './MoreActions'
import { useArticleToast } from '@/hooks/article/useArticleToast'
import { useArticleActions } from '@/hooks/article/useArticleActions'

/**
 * 文章操作按钮组件
 *
 * @param {ArtActProps} props - 组件属性
 * @returns {JSX.Element} 文章操作按钮组件
 */
export default function ArtAct({
  articleId,
  authorId,
  authorName,
  authorAvatar,
  currentUser,
  initialLikeCount = 0,
  initialCommentCount = 0,
  initialLiked = false,
  initialBookmarked = false,
}: ArtActProps) {
  // ==========================================
  // 使用统一的文章操作 Hook
  // ==========================================
  const {
    likeData,
    bookmarkData,
    isLikeLoading,
    isBookmarkLoading,
    toggleLike,
    toggleBookmark,
  } = useArticleActions({
    articleId,
    initialLiked,
    initialLikeCount,
    initialBookmarked,
  })

  const [commentCount] = useState(() => initialCommentCount)
  const { showAuthRequired } = useArticleToast()

  /**
   * 检查用户是否登录
   */
  const checkAuth = () => {
    if (!currentUser) {
      showAuthRequired('进行此操作')
      return false
    }
    return true
  }

  /**
   * 处理点赞
   * 使用统一的乐观更新 Hook
   */
  const handleLike = async () => {
    if (!checkAuth()) return
    await toggleLike()
  }

  /**
   * 处理收藏
   * 使用统一的乐观更新 Hook
   */
  const handleBookmark = async () => {
    if (!checkAuth()) return
    await toggleBookmark()
  }

  /**
   * 打开评论面板
   * 使用自定义事件触发，避免直接操作DOM
   */
  const handleCommentsClick = () => {
    window.dispatchEvent(new CustomEvent('open-comments-panel'))
  }

  return (
    <div className="douyin-sidebar">
      {/* 作者头像+关注按钮 */}
      <AuthorAvatar
        articleId={articleId}
        authorId={authorId}
        authorName={authorName}
        authorAvatar={authorAvatar}
        currentUser={currentUser}
      />

      {/* 点赞按钮 */}
      <div
        className={`douyin-action-btn ${likeData.liked ? 'liked' : ''} ${!currentUser || isLikeLoading ? 'opacity-50' : ''}`}
        onClick={!isLikeLoading ? handleLike : undefined}
        title={currentUser ? (isLikeLoading ? '处理中...' : '点赞') : '请先登录'}
      >
        <Heart className={`douyin-icon ${isLikeLoading ? 'animate-pulse' : ''}`} />
        <span className="douyin-count">{likeData.likeCount}</span>
      </div>

      {/* 评论按钮 */}
      <div
        className="douyin-action-btn comments-btn"
        onClick={handleCommentsClick}
      >
        <MessageCircle className="douyin-icon" />
        <span className="douyin-count">{commentCount}</span>
      </div>

      {/* 更多操作（分享、收藏、举报） */}
      <MoreActions
        articleId={articleId}
        authorId={authorId}
        currentUser={currentUser}
        initialBookmarked={bookmarkData.bookmarked}
        onBookmark={handleBookmark}
        isBookmarkLoading={isBookmarkLoading}
      />
    </div>
  )
}
