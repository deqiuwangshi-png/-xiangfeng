'use server';

/**
 * 点赞功能 Server Actions
 *
 * @module lib/articles/actions/like
 * @description 处理文章点赞和评论点赞
 *
 * @优化说明
 * - 使用数据库唯一约束防止重复点赞
 * - 利用 PostgreSQL 触发器自动维护计数
 * - 通知发送改为异步非阻塞
 * - 减少数据库往返次数
 * - 使用 withAuth 统一权限控制
 *
 * @权限控制
 * - 匿名用户禁止点赞
 * - 认证用户可以点赞/取消点赞
 */

import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/auth/server';
import { ARTICLE_INTERACTION_MESSAGES, COMMENT_INTERACTION_MESSAGES, COMMON_ERRORS } from '@/lib/messages';
import type { ToggleLikeResult, ToggleCommentLikeResult } from '@/types';

/**
 * 文章点赞/取消点赞
 *
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消点赞）
 * 3. 触发器自动维护 like_count
 * 4. 通知发送改为异步非阻塞
 * 5. 使用 withAuth 统一权限控制
 *
 * @param articleId - 文章ID
 * @returns 点赞结果
 */
export const toggleArticleLike = withAuth(
  async (user, articleId: string): Promise<ToggleLikeResult> => {
    const current = await createClient();
    return setArticleLikeInternal(current, user.id, articleId, null)
  }
);

async function setArticleLikeInternal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  articleId: string,
  desiredLiked: boolean | null
): Promise<ToggleLikeResult> {
  try {
    let liked = false

    if (desiredLiked === true) {
      const { error } = await supabase
        .from('article_likes')
        .insert({ article_id: articleId, user_id: userId })
      if (error && error.code !== '23505') {
        return { success: false, liked: false, likes: 0, error: ARTICLE_INTERACTION_MESSAGES.LIKE_ERROR }
      }
      liked = true
    } else if (desiredLiked === false) {
      const { error } = await supabase
        .from('article_likes')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', userId)
      if (error) {
        return { success: false, liked: false, likes: 0, error: ARTICLE_INTERACTION_MESSAGES.UNLIKE_ERROR }
      }
      liked = false
    } else {
      const { error: insertError } = await supabase
        .from('article_likes')
        .insert({ article_id: articleId, user_id: userId })

      if (insertError) {
        if (insertError.code === '23505') {
          const { error: deleteError } = await supabase
            .from('article_likes')
            .delete()
            .eq('article_id', articleId)
            .eq('user_id', userId)
          if (deleteError) {
            return { success: false, liked: false, likes: 0, error: ARTICLE_INTERACTION_MESSAGES.UNLIKE_ERROR }
          }
          liked = false
        } else {
          return { success: false, liked: false, likes: 0, error: ARTICLE_INTERACTION_MESSAGES.LIKE_ERROR }
        }
      } else {
        liked = true
      }
    }

    const { data: articleData } = await supabase
      .from('articles')
      .select('like_count')
      .eq('id', articleId)
      .single()

    return { success: true, liked, likes: articleData?.like_count || 0 }
  } catch (error) {
    console.error('[点赞 Server] 点赞操作失败:', error)
    return { success: false, liked: false, likes: 0, error: COMMON_ERRORS.UNKNOWN_ERROR }
  }
}

export const setArticleLike = withAuth(
  async (user, articleId: string, liked: boolean): Promise<ToggleLikeResult> => {
    const supabase = await createClient()
    return setArticleLikeInternal(supabase, user.id, articleId, liked)
  }
)

/**
 * 评论点赞/取消点赞
 *
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消点赞）
 * 3. 触发器自动维护 likes 计数
 * 4. 使用 withAuth 统一权限控制
 *
 * @param commentId - 评论ID
 * @returns 点赞结果
 */
export const toggleCommentLike = withAuth(
  async (user, commentId: string): Promise<ToggleCommentLikeResult> => {
    const supabase = await createClient();
    return setCommentLikeInternal(supabase, user.id, commentId, null)
  }
);

async function setCommentLikeInternal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  commentId: string,
  desiredLiked: boolean | null
): Promise<ToggleCommentLikeResult> {
  try {
    let liked = false
    if (desiredLiked === true) {
      const { error } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: userId })
      if (error && error.code !== '23505') {
        return { success: false, liked: false, likes: 0, error: COMMENT_INTERACTION_MESSAGES.LIKE_ERROR }
      }
      liked = true
    } else if (desiredLiked === false) {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId)
      if (error) {
        return { success: false, liked: false, likes: 0, error: COMMENT_INTERACTION_MESSAGES.UNLIKE_ERROR }
      }
      liked = false
    } else {
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: userId })
      if (insertError) {
        if (insertError.code === '23505') {
          const { error: deleteError } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', userId)
          if (deleteError) {
            return { success: false, liked: false, likes: 0, error: COMMENT_INTERACTION_MESSAGES.UNLIKE_ERROR }
          }
          liked = false
        } else {
          return { success: false, liked: false, likes: 0, error: COMMENT_INTERACTION_MESSAGES.LIKE_ERROR }
        }
      } else {
        liked = true
      }
    }

    return { success: true, liked, likes: 0 }
  } catch (error) {
    console.error('[点赞 Server] 评论点赞操作失败:', error)
    return { success: false, liked: false, likes: 0, error: COMMON_ERRORS.UNKNOWN_ERROR }
  }
}

export const setCommentLike = withAuth(
  async (user, commentId: string, liked: boolean): Promise<ToggleCommentLikeResult> => {
    const supabase = await createClient()
    return setCommentLikeInternal(supabase, user.id, commentId, liked)
  }
)
