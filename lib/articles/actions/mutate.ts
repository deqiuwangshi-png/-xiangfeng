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
 * 验证 JSON 内容格式
 * @param content - 内容字符串
 * @returns 是否为有效的 TipTap JSON
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
 * 创建文章/草稿
 * @param data - 文章数据
 * @param data.title - 文章标题，为空时会使用默认标题
 * @param data.content - 文章内容（JSON 格式）
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
    const user = await requireAuth();

    // 验证内容 JSON 格式
    const contentValidation = validateContentJSON(data.content);
    if (!contentValidation.valid) {
      throw new Error(contentValidation.error);
    }

    // 处理空标题：如果标题为空或仅包含空白字符，使用默认标题
    const normalizedTitle = data.title?.trim() || '无标题';

    // 生成摘要
    const excerpt = generateSummaryFromJSON(data.content, 100);

    // 生成 HTML 用于展示
    const contentHtml = generateHTMLFromJSON(data.content);

    const insertData = {
      title: normalizedTitle,
      content: contentHtml,  // 存储 HTML 用于展示
      content_json: JSON.parse(data.content) as TipTapJSON,  // 存储 JSON 用于编辑
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
 * @param data.content - 文章内容（JSON 格式）
 * @returns 更新后的文章对象
 * @throws 数据库操作失败时抛出错误
 */
export async function updateArticle(
  id: string,
  data: { title?: string; content?: string }
) {
  try {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};

    // 处理标题更新
    if (data.title !== undefined) {
      updateData.title = data.title.trim() || '无标题';
    }

    // 处理内容更新
    if (data.content !== undefined) {
      // 验证 JSON 格式
      const contentValidation = validateContentJSON(data.content);
      if (!contentValidation.valid) {
        throw new Error(contentValidation.error);
      }

      // 生成 HTML 用于展示
      const contentHtml = generateHTMLFromJSON(data.content);

      updateData.content = contentHtml;  // 存储 HTML 用于展示
      updateData.content_json = JSON.parse(data.content) as TipTapJSON;  // 存储 JSON 用于编辑
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
