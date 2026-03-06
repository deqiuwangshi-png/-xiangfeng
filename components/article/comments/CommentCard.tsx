'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, CornerUpLeft } from 'lucide-react'
import { formatTime } from './utils/formatTime'
import { getInitials } from './utils/getInitials'
import type { CommentCardProps } from './types'

/**
 * 单条评论卡片组件
 *
 * @param comment - 评论数据
 * @param onLike - 点赞回调
 * @param currentUser - 当前用户
 * @returns 评论卡片JSX
 */
export function CommentCard({ comment, onLike, currentUser }: CommentCardProps) {
  {/* 头像加载失败状态 */}
  const [avatarError, setAvatarError] = useState(false)

  return (
    <div className="comment-item">
      <div className="comment-avatar relative">
        {!avatarError ? (
          <Image
            src={
              comment.author.avatar ||
              `https://api.dicebear.com/7.x/micah/svg?seed=${comment.author.id}&backgroundColor=B6CAD7`
            }
            alt={comment.author.name}
            fill
            sizes="40px"
            className="object-cover rounded-full"
            loading="lazy"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-sm font-medium text-gray-600 rounded-full bg-gray-200">
            {getInitials(comment.author.name)}
          </span>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author.name}</span>
          <span className="comment-time">{formatTime(comment.created_at)}</span>
        </div>

        <p className="comment-text">{comment.content}</p>

        <div className="comment-actions">
          <div
            className={`comment-action ${comment.liked ? 'liked' : ''}`}
            onClick={() => currentUser && onLike(comment.id)}
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
        </div>
      </div>
    </div>
  )
}
