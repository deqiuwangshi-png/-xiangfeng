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
 * - 输入参数验证
 * - 错误信息脱敏
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getFeatureCookieConfig } from '@/lib/auth/server';
import { isValidUUID } from '../helpers/utils';

/**
 * 安全错误日志记录
 * 记录详细错误但不暴露给客户端
 */
function logSecurityError(context: string, error: unknown): void {
  const errorCode = error instanceof Error ? error.name : 'UNKNOWN';
  console.error(`[${context}] 操作失败`, { errorCode });
}

/**
 * 增加文章浏览量（安全增强版）
 *
 * @param articleId - 文章ID
 * @returns 操作结果
 *
 * @安全机制
 * - 使用 cookie 标记已浏览的文章，防止同一会话重复计数
 * - 同一用户在同一会话内多次访问只计一次
 * - 使用数据库函数保证原子性操作
 * - 验证文章ID格式
 * - 错误信息脱敏
 *
 * @安全优化 S-01: 验证 articleId 为有效 UUID
 * @安全优化 S-02: 错误信息脱敏，不返回数据库原始错误
 * @安全优化 S-03: 仅对已发布文章增加浏览量
 */
export async function incrementArticleView(articleId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  // 安全：验证 UUID 格式
  if (!isValidUUID(articleId)) {
    console.error('[incrementArticleView] 无效的文章ID格式');
    return { success: false, error: '无效的文章ID' };
  }

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

    // 安全：先检查文章是否存在且已发布
    const { data: article, error: checkError } = await supabase
      .from('articles')
      .select('id, status')
      .eq('id', articleId)
      .eq('status', 'published')
      .single();

    if (checkError || !article) {
      // 文章不存在或未发布，不增加浏览量但不报错（防止枚举攻击）
      return { success: true };
    }

    {/* 使用数据库函数原子性增加浏览量 */}
    const { error } = await supabase.rpc('increment_article_view', {
      p_article_id: articleId,
    });

    if (error) {
      logSecurityError('incrementArticleView', error);
      return { success: false, error: '操作失败，请稍后重试' };
    }

    {/* 设置 cookie 标记已浏览，24小时内不再计数 */}
    cookieStore.set(viewKey, '1', getFeatureCookieConfig(24 * 60 * 60)); // 24小时

    return { success: true };
  } catch {
    logSecurityError('incrementArticleView', new Error('Unexpected error'));
    return { success: false, error: '操作失败，请稍后重试' };
  }
}

/**
 * 获取文章浏览量（实时）
 *
 * @param articleId - 文章ID
 * @returns 当前浏览量
 *
 * @安全优化 S-01: 验证 articleId 为有效 UUID
 * @安全优化 S-02: 错误处理不暴露数据库细节
 */
export async function getArticleViewCount(articleId: string): Promise<number> {
  // 安全：验证 UUID 格式
  if (!isValidUUID(articleId)) {
    console.error('[getArticleViewCount] 无效的文章ID格式');
    return 0;
  }

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
  } catch {
    logSecurityError('getArticleViewCount', new Error('Unexpected error'));
    return 0;
  }
}
