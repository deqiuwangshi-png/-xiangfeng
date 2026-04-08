/**
 * 文章操作 Hook
 * @module hooks/article/useArticleActions
 * @description 提供文章点赞、收藏等操作的统一封装，使用乐观更新
 *
 * @特性
 * - 统一的乐观更新机制
 * - 自动错误处理和回滚
 * - 支持跨组件状态同步
 * - 防止重复提交
 */

'use client'

import { useCallback } from 'react'
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation'
import { ARTICLE_KEYS } from '@/lib/cache/keys'
import { toggleArticleLike, toggleArticleBookmark } from '@/lib/articles/actions'

/**
 * 点赞状态数据
 */
interface LikeData {
  liked: boolean
  likeCount: number
}

/**
 * 收藏状态数据
 */
interface BookmarkData {
  bookmarked: boolean
}

/**
 * useArticleActions Hook 参数
 */
interface UseArticleActionsOptions {
  /** 文章ID */
  articleId: string
  /** 初始点赞状态 */
  initialLiked: boolean
  /** 初始点赞数 */
  initialLikeCount: number
  /** 初始收藏状态 */
  initialBookmarked: boolean
}

/**
 * useArticleActions Hook 返回值
 */
interface UseArticleActionsReturn {
  /** 点赞状态 */
  likeData: LikeData
  /** 收藏状态 */
  bookmarkData: BookmarkData
  /** 是否正在点赞 */
  isLikeLoading: boolean
  /** 是否正在收藏 */
  isBookmarkLoading: boolean
  /** 切换点赞 */
  toggleLike: () => Promise<void>
  /** 切换收藏 */
  toggleBookmark: () => Promise<void>
}

/**
 * 文章操作 Hook
 * 
 * @param options - 配置选项
 * @returns 文章操作方法
 * 
 * @example
 * ```typescript
 * const { 
 *   likeData, 
 *   bookmarkData, 
 *   isLikeLoading, 
 *   toggleLike,
 *   toggleBookmark 
 * } = useArticleActions({
 *   articleId: 'article-123',
 *   initialLiked: false,
 *   initialLikeCount: 10,
 *   initialBookmarked: false,
 * })
 * ```
 */
export function useArticleActions({
  articleId,
  initialLiked,
  initialLikeCount,
  initialBookmarked,
}: UseArticleActionsOptions): UseArticleActionsReturn {
  // ==========================================
  // 点赞操作
  // ==========================================
  const {
    mutate: toggleLikeMutate,
    isMutating: isLikeLoading,
    data: likeResult,
  } = useOptimisticMutation<LikeData, void>({
    cacheKey: ARTICLE_KEYS.likes(articleId),
    mutationFn: async () => {
      const result = await toggleArticleLike(articleId)
      if (!result.success) {
        throw new Error(result.error || '点赞失败')
      }
      return {
        liked: result.liked,
        likeCount: result.likes ?? initialLikeCount,
      }
    },
    optimisticUpdater: (current) => {
      const currentData = current || { liked: initialLiked, likeCount: initialLikeCount }
      const newLiked = !currentData.liked
      return {
        liked: newLiked,
        likeCount: newLiked 
          ? currentData.likeCount + 1 
          : Math.max(0, currentData.likeCount - 1),
      }
    },
    // 不显示 toast，由组件控制提示
    showToast: false,
  })

  // ==========================================
  // 收藏操作
  // ==========================================
  const {
    mutate: toggleBookmarkMutate,
    isMutating: isBookmarkLoading,
    data: bookmarkResult,
  } = useOptimisticMutation<BookmarkData, void>({
    cacheKey: ARTICLE_KEYS.bookmarks(articleId),
    mutationFn: async () => {
      const result = await toggleArticleBookmark(articleId)
      if (!result.success) {
        throw new Error(result.error || '收藏失败')
      }
      return {
        bookmarked: result.favorited,
      }
    },
    optimisticUpdater: (current) => {
      const currentData = current || { bookmarked: initialBookmarked }
      return {
        bookmarked: !currentData.bookmarked,
      }
    },
    successMessage: '操作成功',
    errorMessage: '操作失败，请稍后重试',
  })

  // ==========================================
  // 方法封装
  // ==========================================
  const toggleLike = useCallback(async () => {
    await toggleLikeMutate()
  }, [toggleLikeMutate])

  const toggleBookmark = useCallback(async () => {
    await toggleBookmarkMutate()
  }, [toggleBookmarkMutate])

  // 使用乐观更新的数据或初始数据
  const likeData: LikeData = likeResult || { liked: initialLiked, likeCount: initialLikeCount }
  const bookmarkData: BookmarkData = bookmarkResult || { bookmarked: initialBookmarked }

  return {
    likeData,
    bookmarkData,
    isLikeLoading,
    isBookmarkLoading,
    toggleLike,
    toggleBookmark,
  }
}

export default useArticleActions
