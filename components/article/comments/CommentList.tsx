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
 * @param likingIds - 正在点赞的评论ID集合
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
  likingIds,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>还没有评论，快来发表第一条吧！</p>
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
          isLiking={likingIds?.has(comment.id)}
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
