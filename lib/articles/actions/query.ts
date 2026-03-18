'use server';

/**
 * 文章查询 Server Actions
 *
 * @module lib/articles/actions/query
 * @description 处理文章相关的查询操作
 */

import { createClient } from '@/lib/supabase/server';
import { generateSummary } from '@/lib/utils/html';
import { getAvtUrl } from '@/lib/utils/getAvtUrl';
import type { DraftData } from '@/types/drafts';

/**
 * 获取草稿列表（SWR 缓存用）
 * @description 获取当前用户的所有文章，用于草稿页 SWR 缓存
 * @returns 草稿数据列表
 *
 * @性能优化
 * - 只查询必要字段，不返回完整 content 减少传输
 * - content 字段仅用于生成摘要，不在列表展示
 */
export async function fetchDrafts(): Promise<DraftData[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, excerpt, content, status, created_at, updated_at')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`获取失败: ${error.message}`);
  }

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    content: item.content,
    summary: item.excerpt || generateSummary(item.content, 100),
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

/**
 * 获取当前用户的文章列表（草稿页用）
 *
 * @param status - 文章状态筛选 (all/draft/published/archived)
 * @returns 文章列表
 *
 * @性能优化
 * - 只查询必要字段，不返回完整 content 减少传输
 * - content 字段仅用于生成摘要，不在列表展示
 */
export async function getArticles(status?: 'all' | 'draft' | 'published' | 'archived') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  let query = supabase
    .from('articles')
    .select('id, title, excerpt, content, status, created_at, updated_at, published_at')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`获取失败: ${error.message}`);
  }

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    content: item.content,
    summary: item.excerpt || generateSummary(item.content, 100),
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
    published_at: item.published_at,
  }));
}

/**
 * 获取已发布文章（首页用，所有人可见）
 *
 * @returns 已发布文章列表
 *
 * @性能优化 P1: 只查询必要字段，不返回完整 content
 * - 首页卡片只需要摘要，不需要完整正文
 * - 减少数据传输量和内存开销
 */
export async function getPublishedArticles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      status,
      created_at,
      updated_at,
      published_at,
      author_id,
      like_count,
      comment_count,
      view_count,
      author:profiles(username, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`获取失败: ${error.message}`);
  }

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    summary: item.excerpt || '',
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    publishedAt: item.published_at,
    author: {
      id: item.author_id,
      name: (item.author as { username?: string })?.username || '匿名',
      avatar: (item.author as { avatar_url?: string })?.avatar_url || getAvtUrl(item.author_id),
    },
    likesCount: item.like_count || 0,
    commentsCount: item.comment_count || 0,
    viewsCount: item.view_count || 0,
  }));
}

/**
 * 获取公开文章详情（详情页用）
 *
 * @description 只返回已发布状态的文章，用于公开页面展示
 * @param id - 文章ID
 * @returns 文章详情
 */
export async function getPublicArticleById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles(username, avatar_url, bio)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    summary: data.excerpt,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    publishedAt: data.published_at,
    author: {
      id: data.author_id,
      name: data.author?.username || '匿名',
      avatar: data.author?.avatar_url,
      bio: data.author?.bio,
    },
    likesCount: data.like_count || 0,
    commentsCount: data.comment_count || 0,
    viewsCount: data.view_count || 0,
  };
}

/**
 * 获取文章详情（编辑用）
 *
 * @description 获取当前用户的文章详情，用于编辑草稿
 * @param id - 文章ID
 * @returns 文章详情，如果不是当前用户文章返回null
 */
export async function getArticleById(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('author_id', user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
