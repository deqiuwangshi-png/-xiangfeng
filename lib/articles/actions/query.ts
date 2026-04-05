'use server';

/**
 * 文章查询 Server Actions
 *
 * @module lib/articles/actions/query
 * @description 处理文章相关的查询操作
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 * - 所有函数进行输入验证
 * - 错误处理统一，不泄露数据库细节
 * - 认证和授权检查完整
 */

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/core/user';
import { isValidUUID, handleQueryError } from '../helpers/utils';
import type { DraftData } from '@/types/drafts';

/** 文章状态白名单 */
const VALID_STATUSES = ['all', 'draft', 'published', 'archived'] as const;

/** 有效的文章状态类型 */
type ArticleStatus = typeof VALID_STATUSES[number];

/**
 * 验证文章状态
 * @param status - 待验证的状态
 * @returns 是否为有效的状态
 */
function isValidStatus(status: string): status is ArticleStatus {
  return VALID_STATUSES.includes(status as ArticleStatus);
}

/**
 * 获取草稿列表（SWR 缓存用）
 * @description 获取当前用户的所有文章，用于草稿页 SWR 缓存
 * @returns 草稿数据列表
 *
 * @性能优化
 * - 不查询 content 字段，减少数据传输
 * - 摘要优先使用 excerpt 字段，为空时显示占位文本
 * - 编辑时再按需获取完整内容
 *
 * @安全优化
 * - 错误处理不暴露数据库细节
 */
export async function fetchDrafts(): Promise<DraftData[]> {
  const supabase = await createClient();

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser();
  if (!user) throw new Error('用户未登录');

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, excerpt, status, created_at, updated_at')
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      content: '',
      summary: item.excerpt || '暂无摘要',
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch (err) {
    return handleQueryError('fetchDrafts', err);
  }
}

/**
 * 获取当前用户的文章列表（草稿页用）
 *
 * @param status - 文章状态筛选 (all/draft/published/archived)
 * @returns 文章列表
 *
 * @性能优化
 * - 不查询 content 字段，减少数据传输
 * - 摘要优先使用 excerpt 字段，为空时显示占位文本
 * - 编辑时再按需获取完整内容
 *
 * @安全优化
 * - 验证 status 参数白名单
 * - 错误处理不暴露数据库细节
 */
/**
 * 获取当前用户的文章列表
 *
 * @统一认证 2026-03-30
 * - Layout层已拦截未登录用户，此函数理论上不会接收到未登录请求
 * - 但为类型安全和防御性编程，保留空值检查
 * - 未登录时返回空数组而非抛出错误
 */
export async function getArticles(status?: string) {
  const supabase = await createClient();

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser();

  // Layout层已拦截未登录用户，此处 user 理论上不会为 null
  // 但为类型安全，返回空数组而非抛出错误
  if (!user) {
    return [];
  }

  // 安全：验证 status 参数
  const safeStatus = status && isValidStatus(status) ? status : 'all';

  try {
    let query = supabase
      .from('articles')
      .select('id, title, excerpt, status, created_at, updated_at, published_at')
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false });

    if (safeStatus !== 'all') {
      query = query.eq('status', safeStatus);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      content: '',
      summary: item.excerpt || '暂无摘要',
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      published_at: item.published_at,
    }));
  } catch (err) {
    return handleQueryError('getArticles', err);
  }
}

/**
 * 获取已发布文章（首页用，所有人可见）
 *
 * @returns 已发布文章列表
 *
 * @性能优化 P1: 只查询必要字段，不返回完整 content
 * - 首页卡片只需要摘要，不需要完整正文
 * - 减少数据传输量和内存开销
 *
 * @业务规则
 * - 过滤停用用户(is_active=false)的文章
 *
 * @安全优化
 * - 错误处理不暴露数据库细节
 */
export async function getPublishedArticles() {
  const supabase = await createClient();

  try {
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
        author:profiles!inner(username, avatar_url, is_active)
      `)
      .eq('status', 'published')
      .eq('author.is_active', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
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
        avatar: (item.author as { avatar_url?: string })?.avatar_url || undefined,
      },
      likesCount: item.like_count || 0,
      commentsCount: item.comment_count || 0,
      viewsCount: item.view_count || 0,
    }));
  } catch (err) {
    return handleQueryError('getPublishedArticles', err);
  }
}

/**
 * 获取公开文章详情（详情页用）
 *
 * @description 只返回已发布状态的文章，用于公开页面展示
 * @param id - 文章ID
 * @returns 文章详情
 *
 * @业务规则
 * - 停用用户(is_active=false)的文章不可见
 *
 * @安全优化
 * - 验证 UUID 格式
 * - 错误处理不暴露数据库细节
 */
export async function getPublicArticleById(id: string) {
  // 安全：验证 UUID 格式
  if (!isValidUUID(id)) {
    console.error('[getPublicArticleById] 无效的文章ID格式');
    return null;
  }

  const supabase = await createClient();

  try {
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
  } catch {
    console.error('[getPublicArticleById] 查询失败');
    return null;
  }
}

/**
 * 获取文章详情（编辑用）
 *
 * @description 获取当前用户的文章详情，用于编辑草稿
 * @param id - 文章ID
 * @returns 文章详情，如果不是当前用户文章返回null
 *
 * @安全优化
 * - 验证 UUID 格式
 * - 错误处理不暴露数据库细节
 */
export async function getArticleById(id: string) {
  // 安全：验证 UUID 格式
  if (!isValidUUID(id)) {
    console.error('[getArticleById] 无效的文章ID格式');
    return null;
  }

  try {
    const supabase = await createClient();

    // 使用统一认证入口获取当前用户
    const user = await getCurrentUser();
    if (!user) {
      console.error('[getArticleById] 用户未登录');
      return null;
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('author_id', user.id)
      .single();

    if (error) {
      console.error('[getArticleById] 查询失败:', error);
      return null;
    }

    if (!data) {
      console.error('[getArticleById] 文章不存在');
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      content_json: data.content_json,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('[getArticleById] 查询失败:', error);
    return null;
  }
}

/**
 * 获取指定用户的公开文章列表（个人主页用）
 *
 * @param userId - 用户ID
 * @returns 该用户的已发布文章列表
 *
 * @性能优化
 * - 只查询必要字段，不返回完整 content
 * - 只返回已发布状态的文章
 * - 按发布时间倒序排列
 *
 * @业务规则
 * - 只显示已发布(published)状态的文章
 * - 不检查当前登录用户，任何人都可以查看公开文章
 *
 * @安全优化
 * - 验证 UUID 格式
 * - 错误处理不暴露数据库细节
 */
export async function getUserPublicArticles(userId: string) {
  // 安全：验证 UUID 格式
  if (!isValidUUID(userId)) {
    console.error('[getUserPublicArticles] 无效的用户ID格式');
    return [];
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, excerpt, status, created_at, updated_at, published_at, like_count, comment_count')
      .eq('author_id', userId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      content: '',
      summary: item.excerpt || '暂无摘要',
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      published_at: item.published_at,
      likes_count: item.like_count || 0,
      comments_count: item.comment_count || 0,
    }));
  } catch (err) {
    return handleQueryError('getUserPublicArticles', err);
  }
}
