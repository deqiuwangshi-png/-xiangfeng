'use client'

import { useState, useCallback, useRef } from 'react'
import useSWR from 'swr'
import type { Comment } from '../types'
import { getArticleComments, deleteArticleComment, fetchComments } from '@/lib/articles/actions/comment'
import { toggleCommentLike } from '@/lib/articles/actions/like'
import { useArticleToast } from '@/hooks/useArticleToast'

/**
 * 评论数据管理 Hook - 统一状态管理版本
 * 
 * 优化说明：
 * - 统一使用 SWR 管理所有评论相关状态
 * - 避免多个独立状态变量导致的同步问题
 * - 简化状态更新逻辑，提高代码可维护性
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
  // 使用 ref 存储初始数据，避免重复初始化
  const initialDataRef = useRef({
    comments: initialComments,
    totalCount: initialTotalCount,
    hasMore: initialHasMore,
  })

  // 统一使用 SWR 管理所有评论相关状态
  const {
    data: comments = initialDataRef.current.comments,
    mutate: mutateComments,
  } = useSWR(
    articleId ? `comments/${articleId}` : null,
    () => fetchComments(articleId),
    {
      fallbackData: initialDataRef.current.comments,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    }
  )

  // 统一状态管理：所有状态都基于 SWR 数据
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set())
  const { showDeleteSuccess, showError } = useArticleToast()

  // 从 SWR 数据派生的状态，确保一致性
  const totalCount = comments.length
  const hasMore = comments.length < initialTotalCount

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
        mutateComments(
          (prev) => [...(prev || []), ...newComments],
          { revalidate: false }
        )
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Failed to load more comments:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [articleId, hasMore, loadingMore, mutateComments, page])

  /**
   * 添加新评论（乐观更新）
   */
  const addComment = useCallback((newComment: Comment) => {
    mutateComments(
      (prev) => [newComment, ...(prev || [])],
      { revalidate: false }
    )
  }, [mutateComments])

  /**
   * 切换评论点赞状态（乐观更新）
   * 
   * 优化说明：
   * - 先从当前 comments 获取目标评论，确保数据存在
   * - 使用函数式更新避免闭包陷阱
   * - 使用 prev || currentComments 确保数据不为空
   *
   * @param commentId - 评论ID
   */
  const toggleLike = useCallback(async (commentId: string) => {
    const currentComments = comments
    const targetComment = currentComments.find(c => c.id === commentId)

    if (!targetComment) {
      console.warn('评论不存在，无法点赞:', commentId)
      return
    }

    const originalLiked = targetComment.liked
    const originalLikes = targetComment.likes ?? 0

    setLikingIds((prev) => new Set(prev).add(commentId))

    const newLiked = !targetComment.liked
    const newLikes = newLiked ? (targetComment.likes ?? 0) + 1 : Math.max(0, (targetComment.likes ?? 0) - 1)

    mutateComments(
      (prev) => {
        const dataToUpdate = prev || currentComments
        return dataToUpdate.map((comment) => {
          if (comment.id !== commentId) return comment
          return { ...comment, liked: newLiked, likes: newLikes }
        })
      },
      false
    )

    try {
      const result = await toggleCommentLike(commentId)

      if (!result.success) {
        console.error('评论点赞失败:', result.error)
        mutateComments(
          (prev) => {
            const dataToUpdate = prev || currentComments
            return dataToUpdate.map((comment) => {
              if (comment.id !== commentId) return comment
              return { ...comment, liked: originalLiked, likes: originalLikes }
            })
          },
          false
        )
      }
    } catch (error) {
      console.error('Failed to like comment:', error)
      mutateComments(
        (prev) => {
          const dataToUpdate = prev || currentComments
          return dataToUpdate.map((comment) => {
            if (comment.id !== commentId) return comment
            return { ...comment, liked: originalLiked, likes: originalLikes }
          })
        },
        false
      )
    } finally {
      setLikingIds((prev) => {
        const next = new Set(prev)
        next.delete(commentId)
        return next
      })
    }
  }, [mutateComments, comments])

  /**
   * 删除评论
   * 使用 Server Action 替代 API Route
   */
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const result = await deleteArticleComment(commentId)

      if (result.success) {
        mutateComments(
          (prev) => (prev || []).filter((comment) => comment.id !== commentId),
          { revalidate: false }
        )
        showDeleteSuccess('评论')
      } else {
        console.error('删除评论失败:', result.error)
        showError(result.error || '删除评论失败')
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
      showError('删除评论失败')
    }
  }, [mutateComments, showDeleteSuccess, showError])

  return {
    comments,
    totalCount,
    hasMore,
    loadingMore,
    loadMore,
    addComment,
    toggleLike,
    deleteComment,
    likingIds,
  }
}
