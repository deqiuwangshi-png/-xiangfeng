'use client'

import { useState, useCallback } from 'react'
import type { Comment } from '../types'
import { getArticleComments, deleteArticleComment } from '@/lib/articles/actions/comment'
import { toggleCommentLike } from '@/lib/articles/actions/like'
import { useArticleToast } from '@/hooks/useArticleToast'

/**
 * 评论数据管理 Hook - 简化版本
 *
 * @param articleId - 文章ID
 * @param initialComments - 初始评论列表
 * @param initialTotalCount - 初始评论总数
 * @returns 评论状态和方法
 */
export function useComments(
  articleId: string,
  initialComments: Comment[],
  initialTotalCount: number
) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const { showDeleteSuccess, showError } = useArticleToast()

  const hasMore = comments.length < totalCount

  /**
   * 加载更多评论
   */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextPage = page + 1

    try {
      const result = await getArticleComments(articleId, nextPage, 10)

      if (result.success && result.comments && result.comments.length > 0) {
        setComments((prev) => [...prev, ...(result.comments as Comment[])])
        setPage(nextPage)
      }
    } catch (error) {
      console.error('加载更多评论失败:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [articleId, hasMore, loadingMore, page])

  /**
   * 添加新评论
   */
  const addComment = useCallback((newComment: Comment) => {
    setComments((prev) => {
      // 防止重复添加
      if (prev.some((c) => c.id === newComment.id)) return prev
      return [newComment, ...prev]
    })
    setTotalCount((prev) => prev + 1)
  }, [])

  /**
   * 切换评论点赞状态
   */
  const toggleLike = useCallback(async (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId)
    if (!comment) return

    // 先更新 UI
    const newLiked = !comment.liked
    const newLikes = newLiked
      ? (comment.likes ?? 0) + 1
      : Math.max(0, (comment.likes ?? 0) - 1)

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, liked: newLiked, likes: newLikes } : c
      )
    )

    // 调用 API
    try {
      const result = await toggleCommentLike(commentId)
      if (!result.success) {
        // 失败则恢复
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, liked: comment.liked, likes: comment.likes }
              : c
          )
        )
      }
    } catch (error) {
      console.error('点赞失败:', error)
      // 恢复状态
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, liked: comment.liked, likes: comment.likes }
            : c
        )
      )
    }
  }, [comments])

  /**
   * 删除评论
   */
  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await deleteArticleComment(commentId)

        if (result.success) {
          setComments((prev) => prev.filter((c) => c.id !== commentId))
          setTotalCount((prev) => Math.max(0, prev - 1))
          showDeleteSuccess('评论')
        } else {
          showError(result.error || '删除评论失败')
        }
      } catch (error) {
        console.error('删除评论失败:', error)
        showError('删除评论失败')
      }
    },
    [showDeleteSuccess, showError]
  )

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
