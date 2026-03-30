/**
 * 文章数据查询 - Server Side Only
 * 所有查询在服务端执行，返回给 Server Components
 *
 * 注意：所有查询使用 author_id，user_id 由触发器自动同步
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 * - userId 由服务端从认证信息获取，不依赖客户端传入
 * - 所有查询过滤已禁用作者的文章
 * - 限制参数范围防止性能问题
 */

import { createClient } from '@/lib/supabase/server';
import { getCurrentUserId } from '@/lib/auth/user';
import type { ArticleWithAuthor } from '@/types';

export type { ArticleWithAuthor } from '@/types';

/** 相关文章最大返回数量 */
const MAX_RELATED_ARTICLES = 20;

/**
 * 获取文章完整详情（安全优化版）
 *
 * @description 返回已发布状态的完整文章数据，用于公开页面展示
 * @security 添加 status='published' 过滤，防止暴露草稿/归档文章
 * @security userId 由服务端内部获取，不依赖客户端传入，防止隐私泄露
 * @param id - 文章ID
 * @returns 文章详情（包含作者信息和当前用户点赞状态）
 *
 * @安全优化 S-01: userId 由服务端从认证信息获取，防止传入任意用户ID获取他人隐私
 * @安全优化 S-02: 过滤已禁用作者的文章
 */
export async function getArticleDetailById(id: string): Promise<ArticleWithAuthor | null> {
  const supabase = await createClient();

  // 从服务端获取当前用户ID，不依赖客户端传入
  const currentUserId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!inner(username, avatar_url, bio, is_active)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .eq('author.is_active', true)
    .single();

  if (error || !data) return null;

  let isLiked = false;
  let isBookmarked = false;

  // 安全：仅查询当前登录用户的点赞/收藏状态
  if (currentUserId) {
    const [likeResult, bookmarkResult] = await Promise.all([
      supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', id)
        .eq('user_id', currentUserId)
        .maybeSingle(),
      supabase
        .from('article_favorites')
        .select('id')
        .eq('article_id', id)
        .eq('user_id', currentUserId)
        .maybeSingle(),
    ]);

    isLiked = !!likeResult.data;
    isBookmarked = !!bookmarkResult.data;
  }

  return {
    ...data,
    author: {
      id: data.author_id,
      name: data.author?.username || '匿名',
      avatar: data.author?.avatar_url || undefined,
      bio: data.author?.bio || undefined,
    },
    publishedAt: data.published_at || data.created_at,
    readTime: Math.ceil(data.content.length / 500),
    likesCount: data.like_count || 0,
    commentsCount: data.comment_count || 0,
    viewsCount: data.view_count || 0,
    isLiked,
    isBookmarked,
  };
}

/**
 * 获取相关文章（安全优化版）
 *
 * @param articleId - 当前文章ID
 * @param limit - 返回数量限制（最大20）
 * @returns 相关文章列表
 *
 * @安全优化 S-01: 过滤已禁用作者的文章
 * @性能优化 P-01: 限制返回数量上限，防止大数据量查询
 */
export async function getRelatedArticles(articleId: string, limit = 5) {
  const supabase = await createClient();

  // 限制返回数量，防止性能问题
  const safeLimit = Math.max(1, Math.min(limit, MAX_RELATED_ARTICLES));

  const { data: article } = await supabase
    .from('articles')
    .select('tags')
    .eq('id', articleId)
    .single();

  if (!article?.tags?.length) return [];

  // 安全：关联查询 profiles 表，过滤已禁用作者的文章
  const { data } = await supabase
    .from('articles')
    .select(`
      id, title, summary, created_at, author_id,
      author:profiles!inner(is_active)
    `)
    .contains('tags', article.tags.slice(0, 1))
    .neq('id', articleId)
    .eq('status', 'published')
    .eq('author.is_active', true)
    .limit(safeLimit);

  return data || [];
}
