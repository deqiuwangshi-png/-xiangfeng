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
 * 获取文章评论列表（优化版 - 使用关联查询避免 N+1）
 *
 * @param articleId - 文章ID
 * @param currentUserId - 当前用户ID（可选，避免重复获取）
 * @returns 评论列表（包含作者信息和当前用户点赞状态）
 *
 * @性能优化 P-02: 通过参数传入 currentUserId，避免重复调用 auth.getUser()
 */
export async function getArticleComments(
  articleId: string,
  currentUserId?: string | null
): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();

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
 * @param currentUserId - 当前用户ID（可选，避免重复获取）
 * @returns 评论列表、总数和是否还有更多
 *
 * @性能优化 P-01: 使用 estimated 替代 exact 计数，大表下性能更好
 * @性能优化 P-02: 通过参数传入 currentUserId，避免重复调用 auth.getUser()
 */
export async function getArticleCommentsPaginated(
  articleId: string,
  page: number = 1,
  limit: number = 10,
  currentUserId?: string | null
): Promise<{ comments: CommentWithAuthor[]; totalCount: number; hasMore: boolean }> {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  /**
   * @性能优化 P-01: 使用 estimated 替代 exact 计数
   * - exact: 精确计数，需要全表扫描，大数据量时性能差
   * - estimated: 估算计数，使用 PostgreSQL 统计信息，性能更好
   * - planned: 计划计数，返回查询计划中的估计行数
   */
  const { data, error, count } = await supabase
    .from('comments')
    .select(
      `*,
      author:profiles!user_id(username, avatar_url),
      comment_likes!left(user_id)`,
      { count: 'estimated' }
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
