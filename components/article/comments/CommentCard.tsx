'use client'

import { Heart, CornerUpLeft, Trash2 } from '@/components/icons'
import { formatDistanceToNow } from '@/lib/utils/date'
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder'
import type { CommentCardProps } from './types'

/**
 * 单条评论卡片组件
 *
 * @param comment - 评论数据
 * @param onLike - 点赞回调
 * @param onDelete - 删除回调
 * @param currentUser - 当前用户
 * @param isLiking - 是否正在点赞中
 * @returns 评论卡片JSX
 */
export function CommentCard({ comment, onLike, onDelete, currentUser, isLiking }: CommentCardProps) {
  const canDelete = currentUser?.id === comment.author.id

  return (
    <div className="comment-item">
      <div className="comment-avatar relative">
        <AvatarPlaceholder
          name={comment.author.name}
          userId={comment.author.id}
          avatarUrl={comment.author.avatar}
          size="sm"
        />
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author.name}</span>
          <span className="comment-time">{formatDistanceToNow(comment.created_at)}</span>
        </div>

        <p className="comment-text">{comment.content}</p>

        <div className="comment-actions">
          <div
            className={`comment-action ${comment.liked ? 'liked' : ''} ${isLiking ? 'opacity-50' : ''}`}
            onClick={() => !isLiking && currentUser && onLike(comment.id)}
          >
            <Heart
              className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`}
            />
            <span>{comment.likes}</span>
          </div>

          <div className="comment-action">
            <CornerUpLeft className="w-4 h-4" />
            <span>回复</span>
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
      </div>
    </div>
  )
}
