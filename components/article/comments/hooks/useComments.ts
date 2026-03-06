'use client'

import { useState, useCallback } from 'react'
import type { Comment } from '../types'

/**
 * 评论数据管理 Hook
 *
 * @param articleId - 文章ID
 * @param initialComments - 初始评论列表
 * @param initialTotalCount - 初始评论总数
 * @param initialHasMore - 是否还有更多评论
 * @returns 评论状态和方法
 */
export function useComments(
  articleId: string,
  initialComments: Comment[],
  initialTotalCount: number,
  initialHasMore: boolean
) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  /**
   * 加载更多评论
   */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = page + 1

    try {
      const response = await fetch(
        `/api/articles/${articleId}/comments?page=${nextPage}&limit=10`
      )

      if (response.ok) {
        const data = await response.json()
        setComments((prev) => [...prev, ...data.comments])
        setTotalCount(data.totalCount)
        setHasMore(data.hasMore)
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Failed to load more comments:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [articleId, hasMore, loadingMore, page])

  /**
   * 添加新评论（乐观更新）
   */
  const addComment = useCallback((newComment: Comment) => {
    setComments((prev) => [newComment, ...prev])
    setTotalCount((prev) => prev + 1)
  }, [])

  /**
   * 切换评论点赞状态
   */
  const toggleLike = useCallback(async (commentId: string) => {
    try {
      const response = await fetch('/api/articles/comment/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      })

      if (response.ok) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  liked: !comment.liked,
                  likes: comment.liked
                    ? comment.likes - 1
                    : comment.likes + 1,
                }
              : comment
          )
        )
      }
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }, [])

  return {
    comments,
    totalCount,
    hasMore,
    loadingMore,
    loadMore,
    addComment,
    toggleLike,
  }
}
