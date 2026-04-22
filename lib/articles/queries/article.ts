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
import { getCurrentUserId } from '@/lib/auth/server';
import { generateHTMLFromJSON } from '@/lib/utils/tiptap-html';
import type { TipTapJSON } from '@/lib/utils/json';
import type { ArticleWithAuthor } from '@/types';
import { mapArticleDetailDto } from '../dto';

/** 相关文章最大返回数量 */
const MAX_RELATED_ARTICLES = 20;
const RANDOM_POOL_LIMIT = 30;

export interface SuggestedArticle {
  id: string;
  title: string;
  authorName: string;
  publishedAt: string | null;
  readTime: number;
}

interface SuggestedArticleRow {
  id: string;
  title: string;
  content: string | null;
  published_at: string | null;
  author:
    | {
        username: string | null;
      }
    | Array<{
        username: string | null;
      }>
    | null;
}

function mapSuggestedArticle(row: SuggestedArticleRow): SuggestedArticle {
  const author = Array.isArray(row.author) ? row.author[0] : row.author;
  const textLength = (row.content || '').length;
  return {
    id: row.id,
    title: row.title,
    authorName: author?.username || '匿名作者',
    publishedAt: row.published_at,
    readTime: Math.max(1, Math.ceil(textLength / 500)),
  };
}

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
      author:profiles!inner(username, avatar_url, bio, account_status)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .eq('author.account_status', 'active')
    .single();

  if (error || !data) return null;

  // 优先使用 content_json 重新生成 HTML，避免历史 content 字段样式丢失
  const contentFromJson = data.content_json
    ? generateHTMLFromJSON(data.content_json as string | TipTapJSON)
    : '';

  if (contentFromJson) {
    data.content = contentFromJson;
  }

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
        .from('favorites')
        .select('id')
        .eq('article_id', id)
        .eq('user_id', currentUserId)
        .maybeSingle(),
    ]);

    isLiked = !!likeResult.data;
    isBookmarked = !!bookmarkResult.data;
  }

  return mapArticleDetailDto(data, { isLiked, isBookmarked });
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
      author:profiles!inner(account_status)
    `)
    .contains('tags', article.tags.slice(0, 1))
    .neq('id', articleId)
    .eq('status', 'published')
    .eq('author.account_status', 'active')
    .limit(safeLimit);

  return data || [];
}

/**
 * 获取“下一篇 + 随机一篇”推荐（详情页底部继续阅读）
 */
export async function getNextAndRandomArticles(
  currentArticleId: string,
  currentPublishedAt: string | null
): Promise<{ next: SuggestedArticle | null; random: SuggestedArticle | null }> {
  const supabase = await createClient();

  const baseSelect = `
    id,
    title,
    content,
    published_at,
    author:profiles!inner(username, account_status)
  `;

  let nextRow: SuggestedArticleRow | null = null;

  if (currentPublishedAt) {
    const { data } = await supabase
      .from('articles')
      .select(baseSelect)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .eq('author.account_status', 'active')
      .gt('published_at', currentPublishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    nextRow = (data as SuggestedArticleRow | null) || null;
  }

  // 无“更晚”文章时，回到最早一篇（循环阅读）
  if (!nextRow) {
    const { data } = await supabase
      .from('articles')
      .select(baseSelect)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .eq('author.account_status', 'active')
      .neq('id', currentArticleId)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    nextRow = (data as SuggestedArticleRow | null) || null;
  }

  // 从最近一批文章中随机选一篇，排除当前文章与 next 文章
  const randomExclude = new Set<string>([currentArticleId]);
  if (nextRow?.id) randomExclude.add(nextRow.id);

  const { data: randomPool } = await supabase
    .from('articles')
    .select(baseSelect)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .eq('author.account_status', 'active')
    .neq('id', currentArticleId)
    .order('published_at', { ascending: false })
    .limit(RANDOM_POOL_LIMIT);

  const availableRandom = ((randomPool || []) as unknown as SuggestedArticleRow[]).filter(
    (item) => !randomExclude.has(item.id)
  );

  const randomRow =
    availableRandom.length > 0
      ? availableRandom[Math.floor(Math.random() * availableRandom.length)]
      : null;

  return {
    next: nextRow ? mapSuggestedArticle(nextRow) : null,
    random: randomRow ? mapSuggestedArticle(randomRow) : null,
  };
}
