'use server';

/**
 * 文章增删改 Server Actions - JSON 版本
 * 支持 content_json 字段存储 TipTap JSON 格式
 * 同时生成 HTML 用于文章展示
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { generateSummaryFromJSON } from '@/lib/utils/json';
import { generateHTMLFromJSON } from '@/lib/utils/tiptap-html';

/**
 * TipTap JSON 类型
 */
interface TipTapJSON {
  type: 'doc'
  content?: unknown[]
}

/**
 * 生成 URL 友好的 slug
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
 * 验证 JSON 内容格式
 */
function validateContentJSON(content: string): { valid: boolean; error?: string } {
  if (!content) {
    return { valid: false, error: '内容不能为空' };
  }

  try {
    const parsed = JSON.parse(content) as TipTapJSON;

    if (parsed.type !== 'doc') {
      return { valid: false, error: '内容格式错误：缺少 doc 类型' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: '内容格式错误：无效的 JSON' };
  }
}

/**
 * 验证文章所有权
 * @throws 无权限时抛出错误
 */
async function verifyArticleOwnership(articleId: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', articleId)
    .single();

  if (error || !article) {
    throw new Error('文章不存在');
  }

  if (article.author_id !== userId) {
    throw new Error('无权操作此文章');
  }
}

/**
 * 创建文章/草稿
 */
export async function createArticle(data: {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 验证内容 JSON 格式
  const contentValidation = validateContentJSON(data.content);
  if (!contentValidation.valid) {
    throw new Error(contentValidation.error);
  }

  // 处理空标题
  const normalizedTitle = data.title?.trim() || '无标题';

  // 生成摘要和 HTML
  const excerpt = generateSummaryFromJSON(data.content, 100);
  const contentHtml = generateHTMLFromJSON(data.content);

  const insertData = {
    title: normalizedTitle,
    content: contentHtml,
    content_json: JSON.parse(data.content) as TipTapJSON,
    slug: generateSlug(normalizedTitle),
    excerpt,
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
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 验证所有权
  await verifyArticleOwnership(id, user.id);

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteArticle] 删除文章失败:', error);
    throw new Error(error.message);
  }

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
  const user = await requireAuth();

  // 验证所有权
  await verifyArticleOwnership(id, user.id);

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) {
    updateData.title = data.title.trim() || '无标题';
  }

  if (data.content !== undefined) {
    const contentValidation = validateContentJSON(data.content);
    if (!contentValidation.valid) {
      throw new Error(contentValidation.error);
    }

    const contentHtml = generateHTMLFromJSON(data.content);
    updateData.content = contentHtml;
    updateData.content_json = JSON.parse(data.content) as TipTapJSON;
    updateData.excerpt = generateSummaryFromJSON(data.content, 100);
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
}

/**
 * 更新文章状态
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'archived' | 'draft'
) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 验证所有权
  await verifyArticleOwnership(id, user.id);

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
}
