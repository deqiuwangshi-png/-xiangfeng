/**
 * 评论数据查询 - Server Side Only
 * 所有查询在服务端执行，返回给 Server Components
 *
 * @优化说明
 * - 使用关联查询避免 N+1
 * - 查询当前用户点赞状态
 * - 减少不必要的数据传输
 */

import { createClient } from '@/lib/supabase/server';
import type { CommentWithAuthor } from '@/types';

export type { CommentWithAuthor } from '@/types';

/**
 * 获取当前用户ID（辅助函数）
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * 获取文章评论列表（优化版 - 使用关联查询避免 N+1）
 *
 * @param articleId - 文章ID
 * @returns 评论列表（包含作者信息和当前用户点赞状态）
 */
export async function getArticleComments(articleId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  // 使用单个查询获取评论、作者信息和当前用户点赞状态
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!user_id(username, avatar_url),
      comment_likes!left(user_id)
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(comment => {
    // 检查当前用户是否点赞
    const likes = comment.comment_likes as Array<{ user_id: string }> | null;
    const liked = currentUserId ? likes?.some(like => like.user_id === currentUserId) ?? false : false;

    return {
      ...comment,
      author: {
        id: comment.user_id,
        name: comment.author?.username || '匿名',
        avatar: comment.author?.avatar_url || undefined,
      },
      liked,
    };
  });
}

/**
 * 分页获取文章评论列表（优化版 - 使用关联查询避免 N+1）
 *
 * @param articleId - 文章ID
 * @param page - 页码（从1开始）
 * @param limit - 每页数量
 * @returns 评论列表、总数和是否还有更多
 */
export async function getArticleCommentsPaginated(
  articleId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ comments: CommentWithAuthor[]; totalCount: number; hasMore: boolean }> {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('comments')
    .select(
      `*,
      author:profiles!user_id(username, avatar_url),
      comment_likes!left(user_id)`,
      { count: 'exact' }
    )
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error || !data) {
    return { comments: [], totalCount: 0, hasMore: false };
  }

  const comments = data.map(comment => {
    // 检查当前用户是否点赞
    const likes = comment.comment_likes as Array<{ user_id: string }> | null;
    const liked = currentUserId ? likes?.some(like => like.user_id === currentUserId) ?? false : false;

    return {
      ...comment,
      author: {
        id: comment.user_id,
        name: comment.author?.username || '匿名',
        avatar: comment.author?.avatar_url || undefined,
      },
      liked,
    };
  });

  return {
    comments,
    totalCount: count || 0,
    hasMore: (count || 0) > to + 1,
  };
}
