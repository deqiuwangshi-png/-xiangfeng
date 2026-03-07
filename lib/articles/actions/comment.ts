'use server';

/**
 * 评论功能 Server Actions
 *
 * @module lib/articles/actions/comment
 * @description 处理评论提交、删除、查询
 */

import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '../helpers/profile';
import { getArticleCommentsPaginated } from '../queries/comment';

/**
 * 评论提交结果
 */
export interface SubmitCommentResult {
  success: boolean;
  comment?: {
    id: string;
    content: string;
    created_at: string;
    likes: number;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    liked: boolean;
  };
  error?: string;
}

/**
 * 评论列表结果
 */
export interface GetCommentsResult {
  success: boolean;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    likes: number;
    liked: boolean;
    author_id: string;
    article_id: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  totalCount?: number;
  hasMore?: boolean;
  error?: string;
}

/**
 * 删除评论结果
 */
export interface DeleteCommentResult {
  success: boolean;
  error?: string;
}

/**
 * 获取文章评论列表（分页）
 *
 * @param articleId - 文章ID
 * @param page - 页码
 * @param limit - 每页数量
 * @returns 评论列表结果
 */
export async function getArticleComments(
  articleId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetCommentsResult> {
  try {
    const { comments, totalCount, hasMore } = await getArticleCommentsPaginated(
      articleId,
      page,
      limit
    );

    return {
      success: true,
      comments,
      totalCount,
      hasMore,
    };
  } catch (error) {
    console.error('获取评论失败:', error);
    return { success: false, error: '获取评论失败' };
  }
}

/**
 * 提交文章评论
 *
 * @param articleId - 文章ID
 * @param content - 评论内容
 * @returns 提交结果
 */
export async function submitArticleComment(
  articleId: string,
  content: string
): Promise<SubmitCommentResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '请先登录' };
    }

    {/* 验证评论内容 */}
    if (!content || content.trim().length === 0) {
      return { success: false, error: '评论内容不能为空' };
    }

    if (content.length > 500) {
      return { success: false, error: '评论内容不能超过500字' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, error: '用户资料初始化失败' };
    }

    {/* 插入评论到数据库 - 使用关联查询一次性返回作者信息 */}
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        article_id: articleId,
        user_id: user.id,
        content: content.trim(),
      })
      .select(`
        *,
        author:profiles!user_id(username, avatar_url)
      `)
      .single();

    if (error || !comment) {
      console.error('插入评论失败:', error);
      return { success: false, error: `评论提交失败: ${error?.message || '未知错误'}` };
    }

    return {
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        likes: comment.likes || 0,
        author: {
          id: user.id,
          name: comment.author?.username || '匿名用户',
          avatar: comment.author?.avatar_url || undefined,
        },
        liked: false,
      },
    };
  } catch (error) {
    console.error('提交评论失败:', error);
    return { success: false, error: '评论提交失败' };
  }
}

/**
 * 删除评论
 *
 * @param commentId - 评论ID
 * @returns 删除结果
 */
export async function deleteArticleComment(commentId: string): Promise<DeleteCommentResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '请先登录' };
    }

    {/* 删除评论 */}
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('删除评论失败:', error);
      return { success: false, error: '删除评论失败' };
    }

    return { success: true };
  } catch (error) {
    console.error('删除评论操作失败:', error);
    return { success: false, error: '操作失败' };
  }
}
