'use server';

/**
 * 文章相关 Server Actions
 * 
 * 所有查询和插入使用 author_id，user_id 由触发器自动同步
 * 
 * @module articleActions
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 创建文章/草稿
 * 
 * @param data - 文章数据
 * @param data.title - 文章标题
 * @param data.content - 文章内容
 * @param data.status - 文章状态 (draft/published)
 * @returns 创建的文章数据
 * 
 * @example
 * ```typescript
 * const article = await createArticle({
 *   title: '文章标题',
 *   content: '文章内容...',
 *   status: 'draft'
 * });
 * ```
 */
export async function createArticle(data: {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}) {
  const supabase = await createClient();

  // 获取当前登录用户
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('用户未登录');
  }

  // 生成摘要（内容前100字）
  const summary = data.content.slice(0, 100) + (data.content.length > 100 ? '...' : '');

  // 插入数据库 - 使用 author_id，user_id 由触发器自动同步
  const { data: article, error } = await supabase
    .from('articles')
    .insert({
      title: data.title,
      content: data.content,
      summary,
      status: data.status || 'draft',
      author_id: user.id,  // ✅ 使用 author_id，user_id 由触发器自动同步
      fields: [],
      tags: [],
      likes_count: 0,
      comments_count: 0,
      views_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('创建文章失败:', error);
    throw new Error(`创建失败: ${error.message}`);
  }

  // 刷新页面缓存
  revalidatePath('/drafts');
  revalidatePath('/home');

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
 * 
 * @example
 * ```typescript
 * const articles = await getArticles('draft');
 * ```
 */
export async function getArticles(status?: 'all' | 'draft' | 'published' | 'archived') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  let query = supabase
    .from('articles')
    .select('*')
    .eq('author_id', user.id)  // ✅ 使用 author_id
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
    summary: item.summary || item.content.slice(0, 100) + '...',
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

/**
 * 获取已发布文章（首页用，所有人可见）
 * 
 * @returns 已发布文章列表
 * 
 * @example
 * ```typescript
 * const articles = await getPublishedArticles();
 * ```
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
    summary: item.summary || item.content.slice(0, 100) + '...',
    content: item.content,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    publishedAt: item.published_at,
    author: {
      id: item.author_id,
      name: item.author?.username || '匿名',
      avatar: item.author?.avatar_url || `https://api.dicebear.com/7.x/micah/svg?seed=${item.author_id}&backgroundColor=B6CAD7`,
    },
    likesCount: item.likes_count || 0,
    commentsCount: item.comments_count || 0,
    viewsCount: item.views_count || 0,
  }));
}

/**
 * 获取单篇文章（详情页用）
 * 
 * @param id - 文章ID
 * @returns 文章详情
 * 
 * @example
 * ```typescript
 * const article = await getArticleById('article-id');
 * ```
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
    summary: data.summary,
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
    likesCount: data.likes_count || 0,
    commentsCount: data.comments_count || 0,
    viewsCount: data.views_count || 0,
  };
}

/**
 * 删除文章
 * 
 * @param id - 文章ID
 * @returns 删除结果
 * 
 * @example
 * ```typescript
 * await deleteArticle('article-id');
 * ```
 */
export async function deleteArticle(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id);  // ✅ 使用 author_id

  if (error) throw new Error(`删除失败: ${error.message}`);

  revalidatePath('/drafts');
  return { success: true };
}

/**
 * 更新文章状态（发布/归档/草稿）
 * 
 * @param id - 文章ID
 * @param status - 新状态
 * @returns 更新结果
 * 
 * @example
 * ```typescript
 * await updateArticleStatus('article-id', 'published');
 * ```
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'archived' | 'draft'
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  const updateData: any = { status };
  
  // 如果发布，设置发布时间
  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id);  // ✅ 使用 author_id

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePath('/drafts');
  revalidatePath('/home');
  return { success: true };
}

/**
 * 更新文章内容
 * 
 * @param id - 文章ID
 * @param data - 更新数据
 * @returns 更新结果
 * 
 * @example
 * ```typescript
 * await updateArticle('article-id', {
 *   title: '新标题',
 *   content: '新内容...'
 * });
 * ```
 */
export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    summary?: string;
    tags?: string[];
    fields?: string[];
  }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  // 如果更新了内容，自动生成摘要
  const updateData: any = { ...data };
  if (data.content && !data.summary) {
    updateData.summary = data.content.slice(0, 100) + (data.content.length > 100 ? '...' : '');
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id);  // ✅ 使用 author_id

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePath('/drafts');
  revalidatePath('/home');
  return { success: true };
}

/**
 * 点赞文章
 * 
 * @param articleId - 文章ID
 * @returns 点赞结果
 * 
 * @example
 * ```typescript
 * await likeArticle('article-id');
 * ```
 */
export async function likeArticle(articleId: string) {
  const supabase = await createClient();

  // 获取当前登录用户
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('用户未登录');
  }

  // 检查是否已点赞
  const { data: existingLike } = await supabase
    .from('article_likes')
    .select('id')
    .eq('article_id', articleId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    // 已点赞，取消点赞
    const { error: deleteError } = await supabase
      .from('article_likes')
      .delete()
      .eq('article_id', articleId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw new Error(`取消点赞失败: ${deleteError.message}`);
    }

    // 减少点赞计数
    await supabase.rpc('decrement_likes_count', { article_id: articleId });
  } else {
    // 未点赞，添加点赞
    const { error: insertError } = await supabase
      .from('article_likes')
      .insert({
        article_id: articleId,
        user_id: user.id,
      });

    if (insertError) {
      throw new Error(`点赞失败: ${insertError.message}`);
    }

    // 增加点赞计数
    await supabase.rpc('increment_likes_count', { article_id: articleId });
  }

  revalidatePath(`/article/${articleId}`);
  return { success: true, liked: !existingLike };
}

/**
 * 收藏文章
 * 
 * @param articleId - 文章ID
 * @returns 收藏结果
 * 
 * @example
 * ```typescript
 * await bookmarkArticle('article-id');
 * ```
 */
export async function bookmarkArticle(articleId: string) {
  const supabase = await createClient();

  // 获取当前登录用户
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('用户未登录');
  }

  // 检查是否已收藏
  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('article_id', articleId)
    .eq('user_id', user.id)
    .single();

  if (existingBookmark) {
    // 已收藏，取消收藏
    const { error: deleteError } = await supabase
      .from('bookmarks')
      .delete()
      .eq('article_id', articleId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw new Error(`取消收藏失败: ${deleteError.message}`);
    }
  } else {
    // 未收藏，添加收藏
    const { error: insertError } = await supabase
      .from('bookmarks')
      .insert({
        article_id: articleId,
        user_id: user.id,
      });

    if (insertError) {
      throw new Error(`收藏失败: ${insertError.message}`);
    }
  }

  revalidatePath(`/article/${articleId}`);
  return { success: true, bookmarked: !existingBookmark };
}
