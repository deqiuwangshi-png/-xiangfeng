'use client'

import { Heart, CornerUpLeft, Trash2 } from '@/components/icons'
import { useArticleToast } from '@/hooks/useArticleToast'
import type { CommentCardActionsProps } from '@/types'

/**
 * 评论卡片交互组件 - 客户端组件
 * 处理点赞、回复、删除等交互
 * 包裹服务端渲染的内容
 */
export function CommentCardActions({
  comment,
  currentUser,
  isLiking,
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
    if (!isLiking) {
      onLike(comment.id)
    }
  }

  return (
    <div className="comment-actions">
      <div
        className={`comment-action ${comment.liked ? 'liked' : ''} ${isLiking ? 'opacity-50' : ''}`}
        onClick={handleLikeClick}
      >
        <Heart
          className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`}
        />
        <span>{comment.likes}</span>
      </div>

      {/* 回复功能暂未实现，先隐藏
      <div className="comment-action">
        <CornerUpLeft className="w-4 h-4" />
        <span>回复</span>
      </div>
      */}

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
