'use client'

import { Heart, Trash2 } from '@/components/icons'
import { useArticleToast } from '@/hooks/useArticleToast'
import type { CommentCardActionsProps } from '@/types'

/**
 * 评论卡片交互组件 - 客户端组件
 * 处理点赞、删除等交互
 */
export function CommentCardActions({
  comment,
  currentUser,
  onLike,
  onDelete,
}: CommentCardActionsProps) {
  const canDelete = currentUser?.id === comment.author.id
  const { showAuthRequired } = useArticleToast()

  /**
   * 处理点赞点击
   * - 未登录时提示登录
   * - 已登录时执行点赞
   */
  const handleLikeClick = () => {
    if (!currentUser) {
      showAuthRequired('点赞评论')
      return
    }
    onLike(comment.id)
  }

  return (
    <div className="comment-actions">
      <div
        className={`comment-action ${comment.liked ? 'liked' : ''}`}
        onClick={handleLikeClick}
      >
        <Heart
          className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`}
        />
        <span>{comment.likes}</span>
      </div>

      {canDelete && (
        <div
          className="comment-action delete"
          onClick={() => onDelete(comment.id)}
        >
          <Trash2 className="w-4 h-4" />
          <span>删除</span>
        </div>
      )}
    </div>
  )
}
