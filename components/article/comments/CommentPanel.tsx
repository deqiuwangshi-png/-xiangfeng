'use client'

/**
 * CommentPanel - 评论面板容器组件
 *
 * 作用: 组合所有评论相关子组件，管理面板状态
 *
 * @returns {JSX.Element} 评论面板组件
 */

import { useRef } from 'react'
import { X } from 'lucide-react'
import { useComments } from './hooks/useComments'
import { useCommentSubmit } from './hooks/useCommentSubmit'
import { CommentList } from './CommentList'
import { LoginPrompt } from './LoginPrompt'
import { CommentForm } from './CommentForm'
import { MAX_COMMENTS_WITHOUT_LOGIN } from './types'
import type { CommentPanelProps } from './types'

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
  initialHasMore = false,
  currentUser,
}: CommentPanelProps) {
  const commentsListRef = useRef<HTMLDivElement>(null)

  {/* 使用自定义hooks管理状态 */}
  const {
    comments,
    totalCount,
    hasMore,
    loadingMore,
    loadMore,
    addComment,
  } = useComments(articleId, initialComments, initialTotalCount, initialHasMore)

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
   * 关闭评论面板
   */
  const handleClose = () => {
    const commentPanel = document.querySelector('.comments-panel') as HTMLElement
    const overlay = document.querySelector('.comments-overlay') as HTMLElement

    if (commentPanel && overlay) {
      commentPanel.classList.remove('active')
      overlay.classList.remove('active')
      document.body.classList.remove('comments-open', 'no-scroll')
    }
  }

  return (
    <>
      <div className="comments-overlay" onClick={handleClose} />

      <div className="comments-panel">
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
