'use client'

/**
 * CommentPanel - 评论面板容器组件
 *
 * 作用: 组合所有评论相关子组件，管理面板状态
 *
 * @returns {JSX.Element} 评论面板组件
 */

import { useRef, useState, useEffect } from 'react'
import { X } from '@/components/icons'
import { useComments } from '@/hooks/article/useComments'
import { useCommentSubmit } from '@/hooks/article/useCommentSub'
import { CommentList } from './CommentList'
import { LoginPrompt } from './LoginPrompt'
import { CommentForm } from './CommentForm'
import { MAX_COMMENTS_WITHOUT_LOGIN } from '@/types'
import type { CommentPanelProps } from '@/types'

/**
 * 评论面板容器组件
 *
 * @function CommentPanel
 * @param {CommentPanelProps} props - 组件属性
 * @returns {JSX.Element} 评论面板组件
 */
export function CommentPanel({
  articleId,
  initialComments,
  initialTotalCount = initialComments.length,
  currentUser,
}: CommentPanelProps) {
  const commentsListRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  {/* 使用自定义hooks管理状态 */}
  const {
    comments,
    totalCount,
    hasMore,
    loadingMore,
    loadMore,
    addComment,
    toggleLike,
    deleteComment,
  } = useComments(articleId, initialComments, initialTotalCount)

  const { sending, submitError, submit, clearError } = useCommentSubmit(
    articleId,
    addComment
  )

  {/* 根据登录状态决定显示哪些评论 */}
  const visibleComments = currentUser
    ? comments
    : comments.slice(0, MAX_COMMENTS_WITHOUT_LOGIN)

  {/* 未登录时是否有更多评论被隐藏 */}
  const hasHiddenComments =
    !currentUser && comments.length > MAX_COMMENTS_WITHOUT_LOGIN

  /**
   * 打开评论面板
   */
  const handleOpen = () => {
    setIsOpen(true)
    document.body.classList.add('comments-open', 'no-scroll')
  }

  /**
   * 关闭评论面板
   */
  const handleClose = () => {
    setIsOpen(false)
    document.body.classList.remove('comments-open', 'no-scroll')
  }

  /**
   * 监听自定义事件打开面板
   */
  useEffect(() => {
    const handleOpenEvent = () => handleOpen()
    window.addEventListener('open-comments-panel', handleOpenEvent)
    return () => window.removeEventListener('open-comments-panel', handleOpenEvent)
  }, [])

  return (
    <>
      <div
        className={`comments-overlay ${isOpen ? 'active' : ''}`}
        onClick={handleClose}
        suppressHydrationWarning
      />

      <div className={`comments-panel ${isOpen ? 'active' : ''}`} suppressHydrationWarning>
        <div className="comments-header">
          <div className="comments-title">
            <span>评论</span>
            <span className="comments-count">{totalCount}</span>
          </div>
          <div className="close-comments" onClick={handleClose}>
            <X className="w-5 h-5" />
          </div>
        </div>

        <div className="comments-list" ref={commentsListRef}>
          <CommentList
            comments={visibleComments}
            hasMore={currentUser ? hasMore : false}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            onLike={toggleLike}
            onDelete={deleteComment}
            currentUser={currentUser}
          />

          {/* 未登录时显示登录提示 */}
          {hasHiddenComments && (
            <LoginPrompt
              hiddenCount={comments.length - MAX_COMMENTS_WITHOUT_LOGIN}
            />
          )}
        </div>

        {/* 错误提示 */}
        {submitError && (
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mx-4 mb-2">
            {submitError}
          </div>
        )}

        <CommentForm
          onSubmit={async (content) => {
            clearError()
            const success = await submit(content)
            return success
          }}
          currentUser={currentUser}
          disabled={sending}
        />
      </div>
    </>
  )
}
