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
  author_id: string;  // ✅ 使用 author_id
  created_at: string;
  updated_at: string;
  author: ArticleAuthor;
  publishedAt: string;
  readTime: number;
  likesCount: number;
  commentsCount: number;
}

/**
 * 评论数据
 */
export interface CommentWithAuthor {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  liked: boolean;
  author_id: string;  // ✅ 使用 author_id
  article_id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * 根据ID获取文章详情（优化版 - 使用关联查询避免 N+1）
 *
 * @param id - 文章ID
 * @returns 文章详情（包含作者信息）
 */
export async function getArticleById(id: string): Promise<ArticleWithAuthor | null> {
  const supabase = await createClient();

  // 使用关联查询一次性获取文章和作者信息
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id(username, avatar_url, bio)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    author: {
      id: data.author_id,
      name: data.author?.username || '匿名',
      avatar: data.author?.avatar_url || undefined,
      bio: data.author?.bio || undefined,
    },
    publishedAt: data.created_at,
    readTime: Math.ceil(data.content.length / 500), // 估算阅读时间
    likesCount: data.like_count || 0,
    commentsCount: data.comment_count || 0,
  };
}

/**
 * 获取文章评论列表（优化版 - 使用关联查询避免 N+1）
 *
 * @param articleId - 文章ID
 * @returns 评论列表（包含作者信息）
 */
export async function getArticleComments(articleId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();

  // 使用关联查询一次性获取评论和作者信息
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!author_id(username, avatar_url)
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(comment => ({
    ...comment,
    author: {
      id: comment.author_id,
      name: comment.author?.username || '匿名',
      avatar: comment.author?.avatar_url || undefined,
    },
    liked: false, // 需要根据当前用户判断是否已点赞
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

  // 使用关联查询一次性获取评论、作者信息和总数
  const { data, error, count } = await supabase
    .from('comments')
    .select(
      `*,
      author:profiles!author_id(username, avatar_url)`,
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
      id: comment.author_id,
      name: comment.author?.username || '匿名',
      avatar: comment.author?.avatar_url || undefined,
    },
    liked: false, // 需要根据当前用户判断是否已点赞
  }));

  return {
    comments,
    totalCount: count || 0,
    hasMore: (count || 0) > to + 1,
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

  // 获取当前文章的标签
  const { data: article } = await supabase
    .from('articles')
    .select('tags')
    .eq('id', articleId)
    .single();

  if (!article?.tags?.length) return [];

  // 获取相同标签的文章 - 使用 author_id
  const { data } = await supabase
    .from('articles')
    .select('id, title, summary, created_at, author_id')  // ✅ 使用 author_id
    .contains('tags', article.tags.slice(0, 1)) // 取第一个标签匹配
    .neq('id', articleId)
    .eq('status', 'published')
    .limit(limit);

  return data || [];
}
