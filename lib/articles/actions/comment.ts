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
 * 提交文章评论（支持回复）
 *
 * @param articleId - 文章ID
 * @param content - 评论内容
 * @param parentId - 回复的评论ID（可选）
 * @returns 提交结果
 */
export async function submitArticleComment(
  articleId: string,
  content: string,
  parentId?: string
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

    {/* 准备插入数据 */}
    const insertData: {
      article_id: string;
      user_id: string;
      content: string;
      parent_id?: string;
      reply_to_user_id?: string;
      reply_to_username?: string;
    } = {
      article_id: articleId,
      user_id: user.id,
      content: content.trim(),
    };

    {/* 如果是回复，获取父评论信息 */}
    let parentComment: { user_id: string; author: { username: string } } | null = null;
    if (parentId) {
      const { data: parent } = await supabase
        .from('comments')
        .select('user_id, author:profiles!user_id(username)')
        .eq('id', parentId)
        .single();

      if (parent) {
        {/* Supabase 关联查询返回数组，取第一个元素 */}
        const authorArray = parent.author as unknown as Array<{ username: string }>;
        const author = authorArray?.[0];
        parentComment = {
          user_id: parent.user_id,
          author: { username: author?.username || '匿名用户' }
        };
        insertData.parent_id = parentId;
        insertData.reply_to_user_id = parent.user_id;
        insertData.reply_to_username = author?.username || '匿名用户';
      }
    }

    {/* 插入评论到数据库 */}
    const { data: comment, error } = await supabase
      .from('comments')
      .insert(insertData)
      .select(`
        *,
        author:profiles!user_id(username, avatar_url)
      `)
      .single();

    if (error || !comment) {
      console.error('插入评论失败:', error);
      return { success: false, error: `评论提交失败: ${error?.message || '未知错误'}` };
    }

    {/* 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql */}

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

{/* 注意：所有通知发送逻辑已迁移到数据库触发器，详见 docs/05数据库文档/sql文件/15通知触发器.sql */}
