/**
 * 评论数据查询 - Server Side Only
 * 所有查询在服务端执行，返回给 Server Components
 */

import { createClient } from '@/lib/supabase/server';
import type { CommentWithAuthor } from '@/types';

export type { CommentWithAuthor } from '@/types';

/**
 * 获取文章评论列表（优化版 - 使用关联查询避免 N+1）
 *
 * @param articleId - 文章ID
 * @returns 评论列表（包含作者信息）
 */
export async function getArticleComments(articleId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!user_id(username, avatar_url)
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(comment => ({
    ...comment,
    author: {
      id: comment.user_id,
      name: comment.author?.username || '匿名',
      avatar: comment.author?.avatar_url || undefined,
    },
    liked: false,
  }));
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

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('comments')
    .select(
      `*,
      author:profiles!user_id(username, avatar_url)`,
      { count: 'exact' }
    )
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error || !data) {
    return { comments: [], totalCount: 0, hasMore: false };
  }

  const comments = data.map(comment => ({
    ...comment,
    author: {
      id: comment.user_id,
      name: comment.author?.username || '匿名',
      avatar: comment.author?.avatar_url || undefined,
    },
    liked: false,
  }));

  return {
    comments,
    totalCount: count || 0,
    hasMore: (count || 0) > to + 1,
  };
}
