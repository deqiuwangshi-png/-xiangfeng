'use server';

/**
 * 文章增删改 Server Actions - 简化版
 * 所有安全校验由 Supabase RLS 处理
 */

import { createClient } from '@/lib/supabase/server';
import { generateSummary } from '@/lib/utils/html';

/**
 * 生成 URL 友好的 slug
 * @param title - 文章标题
 * @returns 格式化后的 slug
 */
function generateSlug(title: string): string {
  const timestamp = Date.now().toString(36);
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${normalized.slice(0, 50)}-${timestamp}`;
}

/**
 * 创建文章/草稿
 * @param data - 文章数据
 * @param data.title - 文章标题，为空时会使用默认标题
 * @param data.content - 文章内容
 * @param data.status - 文章状态，默认为 'draft'
 * @returns 创建的文章对象
 * @throws 未登录时抛出错误
 * @throws 数据库操作失败时抛出错误
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

    // 处理空标题：如果标题为空或仅包含空白字符，使用默认标题
    const normalizedTitle = data.title?.trim() || '无标题';

    const insertData = {
      title: normalizedTitle,
      content: data.content,
      slug: generateSlug(normalizedTitle),
      excerpt: generateSummary(data.content, 100),
      status: data.status || 'draft',
      author_id: user.id,
      tags: [],
      like_count: 0,
      comment_count: 0,
      view_count: 0,
      visibility: 'public',
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
 * @param id - 文章ID
 * @param data - 更新数据
 * @param data.title - 文章标题，为空时会使用默认标题
 * @param data.content - 文章内容
 * @returns 更新后的文章对象
 * @throws 数据库操作失败时抛出错误
 */
export async function updateArticle(
  id: string,
  data: { title?: string; content?: string }
) {
  try {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = { ...data };

    // 处理空标题：如果标题为空或仅包含空白字符，使用默认标题
    if (data.title !== undefined) {
      updateData.title = data.title.trim() || '无标题';
    }

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
