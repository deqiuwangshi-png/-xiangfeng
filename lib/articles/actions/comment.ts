'use server';

/**
 * 评论功能 Server Actions
 *
 * @module lib/articles/actions/comment
 * @description 处理评论提交、删除、查询
 *
 * @安全特性
 * - 使用 Zod 进行输入验证
 * - 内容净化防止 XSS
 * - 严格的权限验证
 * - 速率限制保护
 * - 使用 withAuth 统一权限控制
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth, withAuth } from '@/lib/auth/server';
import { getArticleCommentsPaginated } from '../queries/comment';
import { checkCommentArticleTask } from '@/lib/rewards/tasks';
import { CommentSchema, CommentIdSchema } from '../schema';
import { verifyCommentOwnership } from './_secure';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { sanitizePlainText } from '@/lib/utils/purify';
import { COMMENT_ERROR_MESSAGES, COMMON_ERRORS } from '@/lib/messages';
import type { SubmitCommentResult, GetCommentsResult, DeleteCommentResult, Comment } from '@/types';

/**
 * 获取文章评论列表（SWR 缓存用）
 * @description 获取文章的所有评论，用于 SWR 缓存
 * @优化 改为只获取第一页（10条），避免不必要的大数据量传输
 * @param articleId - 文章ID
 * @returns 评论列表
 */
export async function fetchComments(articleId: string): Promise<Comment[]> {
  const result = await getArticleCommentsPaginated(articleId, 1, 10);
  return result.comments as Comment[];
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
    return { success: false, error: COMMENT_ERROR_MESSAGES.FETCH_ERROR };
  }
}

/**
 * 提交文章评论（支持回复）
 *
 * @param articleId - 文章ID
 * @param content - 评论内容
 * @param parentId - 回复的评论ID（可选）
 * @returns 提交结果
 *
 * @安全说明
 * - 使用 Zod 验证输入数据
 * - 净化内容防止 XSS
 * - 速率限制防止滥用
 * - 使用 withAuth 统一权限控制
 */
export const submitArticleComment = withAuth(
  async (
    articleId: string,
    content: string,
    parentId?: string
  ): Promise<SubmitCommentResult> => {
    const user = await requireAuth();
    const supabase = await createClient();

    try {
      {/* 速率限制检查：每用户每分钟最多 10 条评论 */}
      const rateLimit = await checkServerRateLimit(`comment:${user.id}`, {
        maxAttempts: 10,
        windowMs: 60 * 1000, // 1分钟
      });

      if (!rateLimit.allowed) {
        return { success: false, error: COMMENT_ERROR_MESSAGES.RATE_LIMITED };
      }

      {/* Zod 输入验证 */}
      const validationResult = CommentSchema.safeParse({
        articleId,
        content,
        parentId,
      });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0]?.message || '输入数据无效';
        return { success: false, error: errorMessage };
      }

      const validatedData = validationResult.data;

      {/* 净化评论内容 - 评论只允许纯文本 - 使用 DOMPurify */}
      const sanitizedContent = sanitizePlainText(validatedData.content);



      {/* 准备插入数据 */}
      const insertData: {
        article_id: string;
        user_id: string;
        content: string;
        parent_id?: string;
        reply_to_user_id?: string;
        reply_to_username?: string;
      } = {
        article_id: validatedData.articleId,
        user_id: user.id,
        content: sanitizedContent,
      };

      {/* 如果是回复，获取父评论信息 */}
      if (validatedData.parentId) {
        const { data: parent } = await supabase
          .from('comments')
          .select('user_id, author:profiles!user_id(username)')
          .eq('id', validatedData.parentId)
          .single();

        if (parent) {
          {/* Supabase 关联查询返回数组，取第一个元素 */}
          const authorArray = parent.author as unknown as Array<{ username: string }>;
          const author = authorArray?.[0];
          insertData.parent_id = validatedData.parentId;
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
        return { success: false, error: COMMENT_ERROR_MESSAGES.CREATE_ERROR };
      }

      {/* 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql */}

      {/* 检测评论文章任务 - 异步执行不阻塞 */}
      Promise.resolve().then(async () => {
        const taskSuccess = await checkCommentArticleTask()
        if (!taskSuccess) {
          console.warn('[任务系统] 评论任务进度更新失败，不影响评论提交')
        }
      })

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
      return { success: false, error: COMMENT_ERROR_MESSAGES.CREATE_ERROR };
    }
  }
);

/**
 * 删除评论
 *
 * @param commentId - 评论ID
 * @returns 删除结果
 *
 * @安全说明
 * - 验证评论ID格式
 * - 验证用户是否为评论作者
 * - 使用 withAuth 统一权限控制
 */
export const deleteArticleComment = withAuth(
  async (commentId: string): Promise<DeleteCommentResult> => {
    const user = await requireAuth();
    const supabase = await createClient();

    try {
      {/* 验证评论ID格式 */}
      const idValidation = CommentIdSchema.safeParse(commentId);
      if (!idValidation.success) {
        return { success: false, error: COMMENT_ERROR_MESSAGES.INVALID_ID };
      }

      {/* 验证用户是否为评论作者 */}
      const isOwner = await verifyCommentOwnership(commentId, user.id);
      if (!isOwner) {
        return { success: false, error: COMMENT_ERROR_MESSAGES.NO_PERMISSION };
      }

      {/* 删除评论 */}
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('删除评论失败:', error);
        return { success: false, error: COMMENT_ERROR_MESSAGES.DELETE_ERROR };
      }

      return { success: true };
    } catch (error) {
      console.error('删除评论操作失败:', error);
      return { success: false, error: COMMON_ERRORS.UNKNOWN_ERROR };
    }
  }
);

