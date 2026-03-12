/**
 * 文章数据查询 - Server Side Only
 * 所有查询在服务端执行，返回给 Server Components
 *
 * 注意：所有查询使用 author_id，user_id 由触发器自动同步
 */

import { createClient } from '@/lib/supabase/server';

/**
 * 文章作者信息
 */
interface ArticleAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

/**
 * 完整文章数据
 */
export interface ArticleWithAuthor {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  cover_image: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  author: ArticleAuthor;
  publishedAt: string;
  readTime: number;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

/**
 * 获取文章完整详情（优化版 - 使用关联查询避免 N+1）
 *
 * @description 返回已发布状态的完整文章数据，用于公开页面展示
 * @security 添加 status='published' 过滤，防止暴露草稿/归档文章
 * @param id - 文章ID
 * @param userId - 可选，当前用户ID，用于查询点赞/收藏状态
 * @returns 文章详情（包含作者信息）
 */
export async function getArticleDetailById(id: string, userId?: string): Promise<ArticleWithAuthor | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id(username, avatar_url, bio)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  let isLiked = false;
  let isBookmarked = false;

  if (userId) {
    const [likeResult, bookmarkResult] = await Promise.all([
      supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', id)
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('article_favorites')
        .select('id')
        .eq('article_id', id)
        .eq('user_id', userId)
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
    publishedAt: data.created_at,
    readTime: Math.ceil(data.content.length / 500),
    likesCount: data.like_count || 0,
    commentsCount: data.comment_count || 0,
    isLiked,
    isBookmarked,
  };
}

/**
 * 获取相关文章
 *
 * @param articleId - 当前文章ID
 * @param limit - 返回数量限制
 * @returns 相关文章列表
 */
export async function getRelatedArticles(articleId: string, limit = 5) {
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('tags')
    .eq('id', articleId)
    .single();

  if (!article?.tags?.length) return [];

  const { data } = await supabase
    .from('articles')
    .select('id, title, summary, created_at, author_id')
    .contains('tags', article.tags.slice(0, 1))
    .neq('id', articleId)
    .eq('status', 'published')
    .limit(limit);

  return data || [];
}
