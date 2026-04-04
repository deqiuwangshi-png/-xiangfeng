'use server';

/**
 * 文章增删改 Server Actions - 简化版
 * 所有安全校验由 Supabase RLS 处理
 */

import { createClient } from '@/lib/supabase/server';
import { generateSummary } from '@/lib/utils/html';

/**
 * 创建文章/草稿
 */
export async function createArticle(data: {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('[createArticle] 获取用户信息失败:', authError);
      throw new Error('未登录');
    }
    if (!user) {
      throw new Error('未登录');
    }

    const insertData = {
      title: data.title,
      content: data.content,
      excerpt: generateSummary(data.content, 100),
      status: data.status || 'draft',
      author_id: user.id,
      tags: [],
      like_count: 0,
      comment_count: 0,
      view_count: 0,
      ...(data.status === 'published' && { published_at: new Date().toISOString() }),
    };

    const { data: article, error } = await supabase
      .from('articles')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[createArticle] 创建文章失败:', error);
      throw new Error(error.message);
    }

    return article;
  } catch (error) {
    console.error('[createArticle] 失败:', error);
    throw error;
  }
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteArticle] 删除文章失败:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('[deleteArticle] 失败:', error);
    throw error;
  }
}

/**
 * 更新文章
 */
export async function updateArticle(
  id: string,
  data: { title?: string; content?: string }
) {
  try {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = { ...data };
    if (data.content) {
      updateData.excerpt = generateSummary(data.content, 100);
    }

    const { data: article, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[updateArticle] 更新文章失败:', error);
      throw new Error(error.message);
    }

    return article;
  } catch (error) {
    console.error('[updateArticle] 失败:', error);
    throw error;
  }
}

/**
 * 更新文章状态
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'archived' | 'draft'
) {
  try {
    const supabase = await createClient();

    const updateData: { status: string; published_at?: string } = { status };
    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('[updateArticleStatus] 更新文章状态失败:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('[updateArticleStatus] 失败:', error);
    throw error;
  }
}
