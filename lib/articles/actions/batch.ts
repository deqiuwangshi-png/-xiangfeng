'use server';

/**
 * 文章批量操作 Server Actions
 *
 * @module lib/articles/actions/batch
 * @description 处理文章的批量操作
 *
 * @安全特性
 * - 批量验证所有权，防止越权删除
 * - 限制单次删除数量（最多50篇）
 * - 记录安全审计日志
 * - 区分成功、失败、无权、不存在的情况
 */

import { createClient } from '@/lib/supabase/server';
import { BatchDeleteSchema } from '../schema';
import { revalidatePathsAsync } from './utils';

/**
 * 批量删除文章（安全增强版）
 *
 * @param ids - 文章ID数组
 * @returns 删除结果详情
 */
export async function batchDeleteArticles(ids: string[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  // 验证ID列表格式
  const validationResult = BatchDeleteSchema.safeParse({ ids });
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues[0]?.message || '无效的ID列表');
  }

  const { ids: validIds } = validationResult.data;

  // 批量查询文章所有权
  const { data: articles, error: queryError } = await supabase
    .from('articles')
    .select('id, author_id, title')
    .in('id', validIds);

  if (queryError) {
    throw new Error(`查询失败: ${queryError.message}`);
  }

  // 分类处理结果
  const result = {
    success: true as const,
    deleted: [] as string[],
    notFound: [] as string[],
    unauthorized: [] as string[],
  };

  const foundIds = new Set(articles?.map(a => a.id) || []);
  const authorizedIds: string[] = [];

  // 验证每个ID
  for (const id of validIds) {
    if (!foundIds.has(id)) {
      result.notFound.push(id);
    } else {
      const article = articles?.find(a => a.id === id);
      if (article?.author_id === user.id) {
        authorizedIds.push(id);
      } else {
        result.unauthorized.push(id);
      }
    }
  }

  // 记录越权尝试（安全审计）
  if (result.unauthorized.length > 0) {
    await supabase.from('security_logs').insert({
      user_id: user.id,
      action: 'batch_delete_unauthorized_attempt',
      target_ids: result.unauthorized,
      ip_address: null, // 可通过 headers 获取
      created_at: new Date().toISOString(),
    });
  }

  // 执行批量删除
  if (authorizedIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .in('id', authorizedIds)
      .eq('author_id', user.id);

    if (deleteError) {
      throw new Error(`删除失败: ${deleteError.message}`);
    }

    result.deleted = authorizedIds;

    // 记录操作日志
    await supabase.from('operation_logs').insert({
      user_id: user.id,
      action: 'batch_delete',
      target_count: authorizedIds.length,
      target_ids: authorizedIds,
      created_at: new Date().toISOString(),
    });
  }

  revalidatePathsAsync(['/drafts', '/home']);

  return result;
}
