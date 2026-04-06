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
import { requireAuth } from '@/lib/auth/core/permissions';
import { withAuth } from '@/lib/auth/core/withPermission';
import { checkLikeArticleTask } from '@/lib/rewards/tasks';
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
  async (articleId: string): Promise<ToggleLikeResult> => {
    console.log('[点赞 Server] toggleArticleLike 被调用:', articleId);

    const user = await requireAuth();
    const supabase = await createClient();

    try {
      console.log('[点赞 Server] 当前用户:', user.id);
      let liked = false;

      // 1. 先查询当前文章的点赞数
      console.log('[点赞 Server] 查询当前文章点赞数...');
      const { data: beforeData } = await supabase
        .from('articles')
        .select('like_count')
        .eq('id', articleId)
        .single();
      console.log('[点赞 Server] 当前点赞数:', beforeData?.like_count || 0);

      // 2. 尝试插入点赞 - 利用唯一约束防重
      console.log('[点赞 Server] 尝试插入点赞记录:', { article_id: articleId, user_id: user.id });
      const { data: insertData, error: insertError } = await supabase
        .from('article_likes')
        .insert({
          article_id: articleId,
          user_id: user.id,
        })
        .select();

      console.log('[点赞 Server] 插入结果:', { data: insertData, error: insertError?.message, code: insertError?.code });

      if (insertError) {
        console.log('[点赞 Server] 插入失败:', insertError.code, insertError.message, insertError.details);

        // 唯一约束冲突 (23505) = 已点赞，取消点赞
        if (insertError.code === '23505') {
          console.log('[点赞 Server] 检测到已点赞，执行取消点赞...');
          const { error: deleteError } = await supabase
            .from('article_likes')
            .delete()
            .eq('article_id', articleId)
            .eq('user_id', user.id);

          if (deleteError) {
            console.error('[点赞 Server] 取消点赞失败:', deleteError);
            return { success: false, liked: false, likes: 0, error: '取消点赞失败' };
          }
          liked = false;
          console.log('[点赞 Server] 取消点赞成功');

          // 手动更新 like_count -1
          console.log('[点赞 Server] 手动更新 like_count -1');
          const { error: updateError } = await supabase.rpc('decrement_article_like', {
            article_id: articleId
          });
          if (updateError) {
            console.error('[点赞 Server] 更新 like_count 失败:', updateError);
          }
        } else {
          console.error('[点赞 Server] 点赞插入失败:', insertError);
          return { success: false, liked: false, likes: 0, error: ARTICLE_INTERACTION_MESSAGES.LIKE_ERROR };
        }
      } else {
        liked = true;
        console.log('[点赞 Server] 点赞成功');

        // 手动更新 like_count（触发器可能因 RLS 失效）
        console.log('[点赞 Server] 手动更新 like_count +1');
        const { error: updateError } = await supabase.rpc('increment_article_like', {
          article_id: articleId
        });
        if (updateError) {
          console.error('[点赞 Server] 更新 like_count 失败:', updateError);
        }

        Promise.resolve().then(async () => {
          const taskSuccess = await checkLikeArticleTask()
          if (!taskSuccess) {
            console.warn('[任务系统] 点赞文章任务进度更新失败，不影响点赞操作')
          }
        })
      }

      // 查询最新的点赞数量
      console.log('[点赞 Server] 查询最新点赞数量...');
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('like_count')
        .eq('id', articleId)
        .single();

      const latestLikeCount = articleData?.like_count || 0;
      console.log('[点赞 Server] 最新点赞数量:', latestLikeCount, articleError ? `错误: ${articleError.message}` : '');

      console.log('[点赞 Server] 返回结果:', { success: true, liked, likes: latestLikeCount });
      return {
        success: true,
        liked,
        likes: latestLikeCount,
      };
    } catch (error) {
      console.error('[点赞 Server] 点赞操作失败:', error);
      return { success: false, liked: false, likes: 0, error: COMMON_ERRORS.UNKNOWN_ERROR };
    }
  }
);

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
  async (commentId: string): Promise<ToggleCommentLikeResult> => {
    console.log('[点赞 Server] toggleCommentLike 被调用:', commentId);

    const user = await requireAuth();
    const supabase = await createClient();

    try {
      console.log('[点赞 Server] 当前用户:', user.id);
      let liked = false;

      // 1. 尝试插入点赞 - 利用唯一约束防重
      console.log('[点赞 Server] 尝试插入评论点赞记录:', { comment_id: commentId, user_id: user.id });
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
        });

      if (insertError) {
        console.log('[点赞 Server] 插入失败:', insertError.code, insertError.message);

        // 唯一约束冲突 (23505) = 已点赞，取消点赞
        if (insertError.code === '23505') {
          console.log('[点赞 Server] 检测到已点赞，执行取消点赞...');
          const { error: deleteError } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);

          if (deleteError) {
            console.error('[点赞 Server] 取消评论点赞失败:', deleteError);
            return { success: false, liked: false, likes: 0, error: COMMENT_INTERACTION_MESSAGES.UNLIKE_ERROR };
          }
          liked = false;
          console.log('[点赞 Server] 取消评论点赞成功');
        } else {
          console.error('[点赞 Server] 评论点赞插入失败:', insertError);
          return { success: false, liked: false, likes: 0, error: COMMENT_INTERACTION_MESSAGES.LIKE_ERROR };
        }
      } else {
        // 插入成功 = 新点赞
        liked = true;
        console.log('[点赞 Server] 评论点赞成功');
        // 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql
      }

      console.log('[点赞 Server] 返回结果:', { success: true, liked });
      return {
        success: true,
        liked,
        likes: 0, // 前端不使用此值
      };
    } catch (error) {
      console.error('[点赞 Server] 评论点赞操作失败:', error);
      return { success: false, liked: false, likes: 0, error: COMMON_ERRORS.UNKNOWN_ERROR };
    }
  }
);
