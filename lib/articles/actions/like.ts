'use server';

/**
 * 点赞功能 Server Actions (优化版)
 *
 * @module lib/articles/actions/like
 * @description 处理文章点赞和评论点赞
 *
 * @优化说明
 * - 使用数据库唯一约束防止重复点赞
 * - 利用 PostgreSQL 触发器自动维护计数
 * - 减少数据库往返次数
 */

import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '../helpers/profile';

/**
 * 点赞/取消点赞结果
 */
export interface ToggleLikeResult {
  success: boolean;
  liked: boolean;
  likes: number;
  error?: string;
}

/**
 * 评论点赞/取消点赞结果
 */
export interface ToggleCommentLikeResult {
  success: boolean;
  liked: boolean;
  likes: number;
  error?: string;
}

/**
 * 文章点赞/取消点赞
 *
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消点赞）
 * 3. 触发器自动维护 like_count
 *
 * @param articleId - 文章ID
 * @returns 点赞结果
 */
export async function toggleArticleLike(articleId: string): Promise<ToggleLikeResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, liked: false, likes: 0, error: '请先登录' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, liked: false, likes: 0, error: '用户资料初始化失败' };
    }

    let liked = false;

    try {
      {/* 尝试插入点赞 - 利用唯一约束防重 */}
      const { error: insertError } = await supabase
        .from('article_likes')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      if (insertError) {
        {/* 唯一约束冲突 (23505) = 已点赞，取消点赞 */}
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
          throw insertError;
        }
      } else {
        {/* 插入成功 = 新点赞 */}
        liked = true;

        {/* 发送点赞通知给文章作者（不是自己点赞自己） */}
        try {
          const { data: article } = await supabase
            .from('articles')
            .select('author_id, title')
            .eq('id', articleId)
            .single();

          if (article && article.author_id !== user.id) {
            await supabase.from('notifications').insert({
              user_id: article.author_id,
              actor_id: user.id,
              type: 'article_liked',
              title: '文章被点赞',
              content: `赞了你的文章《${article.title || '无标题'}》`,
              article_id: articleId,
            });
          }
        } catch (notifyError) {
          {/* 通知失败不影响点赞成功 */}
          console.error('发送点赞通知失败:', notifyError);
        }
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      return { success: false, liked: false, likes: 0, error: '操作失败' };
    }

    {/* 获取最新的点赞数（触发器已自动更新） */}
    const { data: article } = await supabase
      .from('articles')
      .select('like_count')
      .eq('id', articleId)
      .single();

    return {
      success: true,
      liked,
      likes: article?.like_count || 0,
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
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, liked: false, likes: 0, error: '请先登录' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, liked: false, likes: 0, error: '用户资料初始化失败' };
    }

    let liked = false;

    try {
      {/* 尝试插入点赞 - 利用唯一约束防重 */}
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
        });

      if (insertError) {
        {/* 唯一约束冲突 (23505) = 已点赞，取消点赞 */}
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
          throw insertError;
        }
      } else {
        {/* 插入成功 = 新点赞 */}
        liked = true;

        {/* 发送评论点赞通知给评论作者（不是自己点赞自己） */}
        try {
          const { data: comment } = await supabase
            .from('comments')
            .select('user_id, content, article_id')
            .eq('id', commentId)
            .single();

          if (comment && comment.user_id !== user.id) {
            {/* 截取评论内容前50字 */}
            const shortContent = comment.content?.slice(0, 50) || '无内容';
            const displayContent = comment.content?.length > 50 ? `${shortContent}...` : shortContent;

            await supabase.from('notifications').insert({
              user_id: comment.user_id,
              actor_id: user.id,
              type: 'comment_liked',
              title: '评论被点赞',
              content: `赞了你的评论"${displayContent}"`,
              article_id: comment.article_id,
              comment_id: commentId,
            });
          }
        } catch (notifyError) {
          {/* 通知失败不影响点赞成功 */}
          console.error('发送评论点赞通知失败:', notifyError);
        }
      }
    } catch (error) {
      console.error('评论点赞操作失败:', error);
      return { success: false, liked: false, likes: 0, error: '操作失败' };
    }

    {/* 获取最新点赞数（触发器已自动更新） */}
    const { data: comment } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single();

    return {
      success: true,
      liked,
      likes: comment?.likes || 0,
    };
  } catch (error) {
    console.error('评论点赞操作失败:', error);
    return { success: false, liked: false, likes: 0, error: '操作失败' };
  }
}
