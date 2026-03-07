'use client'

import { useState, useCallback } from 'react'
import type { Comment } from '../types'
import { getArticleComments, deleteArticleComment } from '@/lib/articles/actions/comment'
import { toggleCommentLike } from '@/lib/articles/actions/like'

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
   * 使用 Server Action 替代 API Route
   */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = page + 1

    try {
      const result = await getArticleComments(articleId, nextPage, 10)

      if (result.success && result.comments && result.comments.length > 0) {
        const newComments = result.comments as Comment[]
        setComments((prev) => [...prev, ...newComments])
        setTotalCount(result.totalCount || 0)
        setHasMore(result.hasMore || false)
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
   * 使用 Server Action 替代 API Route
   */
  const toggleLike = useCallback(async (commentId: string) => {
    try {
      const result = await toggleCommentLike(commentId)

      if (result.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  liked: result.liked,
                  likes: result.likes,
                }
              : comment
          )
        )
      } else {
        console.error('评论点赞失败:', result.error)
      }
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }, [])

  /**
   * 删除评论
   * 使用 Server Action 替代 API Route
   */
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const result = await deleteArticleComment(commentId)

      if (result.success) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId))
        setTotalCount((prev) => prev - 1)
      } else {
        console.error('删除评论失败:', result.error)
        alert(result.error || '删除评论失败')
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('删除评论失败')
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
    deleteComment,
  }
}
