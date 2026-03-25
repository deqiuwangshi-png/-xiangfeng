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
 */

import { createClient } from '@/lib/supabase/server';
import { checkLikeArticleTask } from '@/lib/rewards/actions/tasks';
import type { ToggleLikeResult, ToggleCommentLikeResult } from '@/types';

export type { ToggleLikeResult, ToggleCommentLikeResult } from '@/types';

/**
 * 文章点赞/取消点赞
 *
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消点赞）
 * 3. 触发器自动维护 like_count
 * 4. 通知发送改为异步非阻塞
 *
 * @param articleId - 文章ID
 * @returns 点赞结果
 */
export async function toggleArticleLike(articleId: string): Promise<ToggleLikeResult> {
  const supabase = await createClient();

  try {
    // 1. 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, liked: false, likes: 0, error: '请先登录' };
    }

    let liked = false;

    // 2. 尝试插入点赞 - 利用唯一约束防重
    const { error: insertError } = await supabase
      .from('article_likes')
      .insert({
        article_id: articleId,
        user_id: user.id,
      });

    if (insertError) {
      // 唯一约束冲突 (23505) = 已点赞，取消点赞
      if (insertError.code === '23505') {
        const { error: deleteError } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('取消点赞失败:', deleteError);
          return { success: false, liked: false, likes: 0, error: '取消点赞失败' };
        }
        liked = false;
      } else {
        console.error('点赞插入失败:', insertError);
        return { success: false, liked: false, likes: 0, error: '操作失败' };
      }
    } else {
      liked = true;
      Promise.resolve().then(async () => {
        const taskSuccess = await checkLikeArticleTask()
        if (!taskSuccess) {
          console.warn('[任务系统] 点赞文章任务进度更新失败，不影响点赞操作')
        }
      })
    }

    // 触发器自动维护 like_count
    // 查询最新的点赞总数返回给前端
    const { data: article, error: countError } = await supabase
      .from('articles')
      .select('like_count')
      .eq('id', articleId)
      .single();

    if (countError) {
      console.error('获取点赞数失败:', countError);
    }

    return {
      success: true,
      liked,
      likes: article?.like_count ?? 0,
    };
  } catch (error) {
    console.error('点赞操作失败:', error);
    return { success: false, liked: false, likes: 0, error: '操作失败' };
  }
}

/**
 * 评论点赞/取消点赞
 *
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消点赞）
 * 3. 触发器自动维护 likes 计数
 *
 * @param commentId - 评论ID
 * @returns 点赞结果
 */
export async function toggleCommentLike(commentId: string): Promise<ToggleCommentLikeResult> {
  const supabase = await createClient();

  try {
    // 1. 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, liked: false, likes: 0, error: '请先登录' };
    }

    let liked = false;

    // 2. 尝试插入点赞 - 利用唯一约束防重
    const { error: insertError } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.id,
      });

    if (insertError) {
      // 唯一约束冲突 (23505) = 已点赞，取消点赞
      if (insertError.code === '23505') {
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('取消评论点赞失败:', deleteError);
          return { success: false, liked: false, likes: 0, error: '取消点赞失败' };
        }
        liked = false;
      } else {
        console.error('评论点赞插入失败:', insertError);
        return { success: false, liked: false, likes: 0, error: '操作失败' };
      }
    } else {
      // 插入成功 = 新点赞
      liked = true;
      // 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql
    }

    // 触发器自动维护 likes 计数
    // 查询最新的点赞总数返回给前端
    const { data: comment, error: countError } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single();

    if (countError) {
      console.error('获取评论点赞数失败:', countError);
    }

    return {
      success: true,
      liked,
      likes: comment?.likes ?? 0,
    };
  } catch (error) {
    console.error('评论点赞操作失败:', error);
    return { success: false, liked: false, likes: 0, error: '操作失败' };
  }
}

// 注意：所有通知发送逻辑已迁移到数据库触发器，详见 docs/sql文件/15通知触发器.sql
