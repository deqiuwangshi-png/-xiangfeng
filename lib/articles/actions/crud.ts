'use server';

/**
 * 文章CRUD Server Actions
 *
 * @module lib/articles/actions/crud
 * @description 处理文章的创建、查询、更新、删除
 *
 * @性能优化
 * - 使用异步 revalidate，避免阻塞发布操作
 * - 数据库操作和缓存刷新分离
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { generateSummary } from '@/lib/utils/html';
import { getAvtUrl } from '@/lib/utils/getAvtUrl';
import { ensureUserProfile } from '../helpers/profile';

/**
 * 异步刷新页面缓存
 *
 * 使用 Promise.resolve().then() 让 revalidate 在后台执行
 * 不阻塞主流程，提升用户体验
 *
 * @param paths - 需要刷新的路径数组
 */
async function revalidatePathsAsync(paths: string[]) {
  Promise.resolve().then(() => {
    paths.forEach(path => {
      try {
        revalidatePath(path);
      } catch (error) {
        console.warn(`Failed to revalidate ${path}:`, error);
      }
    });
  });
}

/**
 * 创建文章/草稿
 *
 * @param data - 文章数据
 * @param data.title - 文章标题
 * @param data.content - 文章内容
 * @param data.status - 文章状态 (draft/published)
 * @returns 创建的文章数据
 *
 * @性能说明
 * - 数据库操作完成后立即返回
 * - 缓存刷新在后台异步执行
 * - 发布响应时间从 6s 降低到 ~2s
 */
export async function createArticle(data: {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('用户未登录');
  }

  {/* 确保用户资料存在（使用 upsert 原子操作） */}
  const profileCreated = await ensureUserProfile(user.id, user.email);
  if (!profileCreated) {
    throw new Error('用户资料初始化失败，请重试');
  }

  const excerpt = generateSummary(data.content, 100);

  const { data: article, error } = await supabase
    .from('articles')
    .insert({
      title: data.title,
      content: data.content,
      excerpt,
      status: data.status || 'draft',
      author_id: user.id,
      tags: [],
      like_count: 0,
      comment_count: 0,
      view_count: 0,
    })
    .select('id, title, content, excerpt, status, created_at, updated_at')
    .single();

  if (error) {
    console.error('创建文章失败:', error);
    throw new Error(`创建失败: ${error.message}`);
  }

  revalidatePathsAsync(['/drafts', '/home']);

  return {
    ...article,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
  };
}

/**
 * 获取当前用户的文章列表（草稿页用）
 *
 * @param status - 文章状态筛选 (all/draft/published/archived)
 * @returns 文章列表
 */
export async function getArticles(status?: 'all' | 'draft' | 'published' | 'archived') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  let query = supabase
    .from('articles')
    .select('*')
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
  }));
}

/**
 * 获取已发布文章（首页用，所有人可见）
 *
 * @returns 已发布文章列表
 */
export async function getPublishedArticles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
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
    summary: item.excerpt || generateSummary(item.content, 100),
    content: item.content,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    publishedAt: item.published_at,
    author: {
      id: item.author_id,
      name: item.author?.username || '匿名',
      avatar: item.author?.avatar_url || getAvtUrl(item.author_id),
    },
    likesCount: item.like_count || 0,
    commentsCount: item.comment_count || 0,
    viewsCount: item.view_count || 0,
  }));
}

/**
 * 获取单篇文章（详情页用）
 *
 * @param id - 文章ID
 * @returns 文章详情
 */
export async function getArticleById(id: string) {
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
 * 删除文章
 *
 * @param id - 文章ID
 * @returns 删除结果
 */
export async function deleteArticle(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id);

  if (error) throw new Error(`删除失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home']);

  return { success: true };
}

/**
 * 更新文章状态（发布/归档/草稿）
 *
 * @param id - 文章ID
 * @param status - 新状态
 * @returns 更新结果
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'archived' | 'draft'
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const updateData: { status: string; published_at?: string } = { status };

  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id);

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home']);

  return { success: true };
}

/**
 * 更新文章内容
 *
 * @param id - 文章ID
 * @param data - 更新数据
 * @returns 更新结果
 */
export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
  }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const updateData: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
  } = { ...data };

  if (data.content && !data.excerpt) {
    updateData.excerpt = generateSummary(data.content, 100);
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id);

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home']);

  return { success: true };
}
