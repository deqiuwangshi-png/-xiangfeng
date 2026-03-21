'use client'

import { MessageCircle, Loader2 } from '@/components/icons'
import { CommentCard } from './CommentCard'
import type { CommentListProps } from './types'

/**
 * 评论列表组件
 *
 * @param comments - 评论列表
 * @param hasMore - 是否还有更多
 * @param loadingMore - 加载中状态
 * @param onLoadMore - 加载更多回调
 * @param onLike - 点赞回调
 * @param onDelete - 删除回调
 * @param currentUser - 当前用户
 * @returns 评论列表JSX
 */
export function CommentList({
  comments,
  hasMore,
  loadingMore,
  onLoadMore,
  onLike,
  onDelete,
  currentUser,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-xf-primary/10 flex items-center justify-center mb-5">
          <MessageCircle className="w-10 h-10 text-xf-primary/60" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          暂无评论
        </h3>
        <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
          成为第一个发表评论的人，分享你的观点和想法
        </p>
      </div>
    )
  }

  return (
    <>
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onLike={onLike}
          onDelete={onDelete}
          currentUser={currentUser}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-4 py-2 text-sm text-xf-medium hover:text-xf-primary transition-colors"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                加载中...
              </>
            ) : (
              '加载更多评论'
            )}
          </button>
        </div>
      )}
    </>
  )
}
