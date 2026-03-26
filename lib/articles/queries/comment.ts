/**
 * 评论数据查询 - Server Side Only
 * 所有查询在服务端执行，返回给 Server Components
 *
 * @优化说明
 * - 使用关联查询避免 N+1
 * - 查询当前用户点赞状态
 * - 减少不必要的数据传输
 *
 * @安全说明
 * - currentUserId 由服务端从认证信息获取，不依赖客户端传入
 * - 不返回 comment_likes 原始数据，仅返回当前用户是否点赞的布尔值
 * - 防止用户ID泄露和身份伪造
 */

import { createClient } from '@/lib/supabase/server';
import type { CommentWithAuthor } from '@/types';

export type { CommentWithAuthor } from '@/types';

/**
 * 获取当前登录用户ID
 * @security 服务端内部使用，不暴露给客户端
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * 获取文章评论列表（安全优化版）
 *
 * @param articleId - 文章ID
 * @returns 评论列表（包含作者信息和当前用户点赞状态）
 *
 * @安全优化 S-01: currentUserId 由服务端从认证信息获取，不依赖客户端传入
 * @安全优化 S-02: 使用子查询仅获取当前用户的点赞状态，不返回所有点赞用户ID
 * @性能优化 P-01: 使用关联查询避免 N+1
 */
export async function getArticleComments(
  articleId: string
): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();

  // 从服务端获取当前用户ID，不依赖客户端传入
  const currentUserId = await getCurrentUserId();

  // 安全查询：不获取 comment_likes 的所有 user_id
  // 仅通过子查询判断当前用户是否点赞
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!user_id(username, avatar_url, role)
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  // 如果有登录用户，批量查询点赞状态
  let likedMap: Map<string, boolean> = new Map();
  if (currentUserId && data.length > 0) {
    const commentIds = data.map(c => c.id);
    const { data: likesData } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', currentUserId)
      .in('comment_id', commentIds);

    likedMap = new Map(
      likesData?.map(like => [like.comment_id, true]) ?? []
    );
  }

  return data.map(comment => ({
    ...comment,
    author: {
      id: comment.user_id,
      name: comment.author?.username || '匿名',
      avatar: comment.author?.avatar_url || undefined,
      role: comment.author?.role || 'user',
    },
    // 安全：仅返回布尔值，不暴露点赞用户ID
    liked: likedMap.get(comment.id) ?? false,
  }));
}

/**
 * 分页获取文章评论列表（安全优化版）
 *
 * @param articleId - 文章ID
 * @param page - 页码（从1开始）
 * @param limit - 每页数量
 * @returns 评论列表、总数和是否还有更多
 *
 * @安全优化 S-01: currentUserId 由服务端从认证信息获取，不依赖客户端传入
 * @安全优化 S-02: 使用子查询仅获取当前用户的点赞状态，不返回所有点赞用户ID
 * @性能优化 P-01: 使用 estimated 替代 exact 计数，大表下性能更好
 * @性能优化 P-02: 使用关联查询避免 N+1
 * @性能优化 P-03: 限制分页参数范围，防止大数据量查询
 */

/** 每页最大评论数限制 */
const MAX_COMMENTS_PER_PAGE = 50;

/** 最大页码限制 */
const MAX_PAGE_NUMBER = 1000;

export async function getArticleCommentsPaginated(
  articleId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ comments: CommentWithAuthor[]; totalCount: number; hasMore: boolean }> {
  const supabase = await createClient();

  // 从服务端获取当前用户ID，不依赖客户端传入
  const currentUserId = await getCurrentUserId();

  /**
   * @性能优化 P-03: 限制分页参数范围
   * - page: 最小1，最大1000
   * - limit: 最小1，最大50
   * 防止恶意或错误的参数导致数据库压力
   */
  const safePage = Math.max(1, Math.min(page, MAX_PAGE_NUMBER));
  const safeLimit = Math.max(1, Math.min(limit, MAX_COMMENTS_PER_PAGE));

  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

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
      author:profiles!user_id(username, avatar_url, role)`,
      { count: 'estimated' }
    )
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error || !data) {
    return { comments: [], totalCount: 0, hasMore: false };
  }

  // 如果有登录用户，批量查询点赞状态
  let likedMap: Map<string, boolean> = new Map();
  if (currentUserId && data.length > 0) {
    const commentIds = data.map(c => c.id);
    const { data: likesData } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', currentUserId)
      .in('comment_id', commentIds);

    likedMap = new Map(
      likesData?.map(like => [like.comment_id, true]) ?? []
    );
  }

  const comments = data.map(comment => ({
    ...comment,
    author: {
      id: comment.user_id,
      name: comment.author?.username || '匿名',
      avatar: comment.author?.avatar_url || undefined,
      role: comment.author?.role || 'user',
    },
    // 安全：仅返回布尔值，不暴露点赞用户ID
    liked: likedMap.get(comment.id) ?? false,
  }));

  return {
    comments,
    totalCount: count || 0,
    hasMore: (count || 0) > to + 1,
  };
}
