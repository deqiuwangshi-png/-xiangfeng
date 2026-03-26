'use server';

/**
 * 文章浏览量统计 Server Actions
 *
 * @module lib/articles/actions/view
 * @description 处理文章浏览量的增加和统计
 *
 * @安全特性
 * - 使用会话存储防止重复计数
 * - 使用数据库函数原子性增加
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * 增加文章浏览量
 *
 * @param articleId - 文章ID
 * @returns 操作结果
 *
 * @安全机制
 * - 使用 cookie 标记已浏览的文章，防止同一会话重复计数
 * - 同一用户在同一会话内多次访问只计一次
 * - 使用数据库函数保证原子性操作
 */
export async function incrementArticleView(articleId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    {/* 检查当前会话是否已浏览过该文章 */}
    const viewKey = `article_view_${articleId}`;
    const hasViewed = cookieStore.get(viewKey);

    {/* 如果已浏览过，直接返回成功但不增加计数 */}
    if (hasViewed) {
      return { success: true };
    }

    {/* 使用数据库函数原子性增加浏览量 */}
    const { error } = await supabase.rpc('increment_article_view', {
      p_article_id: articleId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    {/* 设置 cookie 标记已浏览，24小时内不再计数 */}
    cookieStore.set(viewKey, '1', {
      maxAge: 24 * 60 * 60, // 24小时
      path: '/',
      sameSite: 'strict',
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: '操作失败' };
  }
}

/**
 * 获取文章浏览量（实时）
 *
 * @param articleId - 文章ID
 * @returns 当前浏览量
 */
export async function getArticleViewCount(articleId: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('articles')
      .select('view_count')
      .eq('id', articleId)
      .single();

    if (error || !data) {
      return 0;
    }

    return data.view_count || 0;
  } catch (err) {
    return 0;
  }
}
