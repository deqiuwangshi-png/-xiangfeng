'use server';

/**
 * 文章增删改 Server Actions - 简化版
 * 所有安全校验由 Supabase RLS 处理
 */

import { createClient } from '@/lib/supabase/server';

/**
 * 创建文章/草稿
 */
export async function createArticle(data: {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');

  const insertData = {
    title: data.title,
    content: data.content,
    excerpt: data.content.slice(0, 100),
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

  if (error) throw new Error(error.message);

  return article;
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  return { success: true };
}

/**
 * 更新文章
 */
export async function updateArticle(
  id: string,
  data: { title?: string; content?: string }
) {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { ...data };
  if (data.content) {
    updateData.excerpt = data.content.slice(0, 100);
  }

  const { data: article, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return article;
}

/**
 * 更新文章状态
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'archived' | 'draft'
) {
  const supabase = await createClient();

  const updateData: { status: string; published_at?: string } = { status };
  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(error.message);

  return { success: true };
}
