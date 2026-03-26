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
 * - 不返回详细错误信息，防止资源枚举攻击
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/permissions';
import { BatchDeleteSchema } from '../schema';
import { revalidatePathsAsync } from './utils';

/**
 * 批量删除文章结果
 * @interface BatchDeleteResult
 * @description 批量删除操作的结果，不包含敏感信息
 */
interface BatchDeleteResult {
  /** 是否成功 */
  success: boolean;
  /** 成功删除的数量 */
  deletedCount: number;
  /** 失败的数量（不包含具体ID，防止信息泄露） */
  failedCount: number;
}

/**
 * 批量删除文章（安全增强版）
 *
 * @param ids - 文章ID数组
 * @returns 删除结果（不包含具体ID详情，防止信息泄露）
 *
 * @安全说明
 * - 不返回 notFound/unauthorized 的具体ID列表
 * - 只返回成功删除数量和失败数量
 * - 防止通过批量删除接口进行资源枚举攻击
 */
export async function batchDeleteArticles(ids: string[]): Promise<BatchDeleteResult> {
  const supabase = await createClient();
  const user = await requireAuth();

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

  const foundIds = new Set(articles?.map(a => a.id) || []);
  const authorizedIds: string[] = [];
  const unauthorizedIds: string[] = [];

  // 验证每个ID（内部统计，不返回给客户端）
  for (const id of validIds) {
    if (!foundIds.has(id)) {
      // 未找到的文章，计入失败但不返回ID
      continue;
    } else {
      const article = articles?.find(a => a.id === id);
      if (article?.author_id === user.id) {
        authorizedIds.push(id);
      } else {
        unauthorizedIds.push(id);
      }
    }
  }

  // 记录越权尝试（安全审计）
  if (unauthorizedIds.length > 0) {
    await supabase.from('security_logs').insert({
      user_id: user.id,
      action: 'batch_delete_unauthorized_attempt',
      target_count: unauthorizedIds.length,
      created_at: new Date().toISOString(),
    });
  }

  // 执行批量删除
  let deletedCount = 0;
  if (authorizedIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .in('id', authorizedIds)
      .eq('author_id', user.id);

    if (deleteError) {
      throw new Error(`删除失败: ${deleteError.message}`);
    }

    deletedCount = authorizedIds.length;

    // 记录操作日志
    await supabase.from('operation_logs').insert({
      user_id: user.id,
      action: 'batch_delete',
      target_count: authorizedIds.length,
      created_at: new Date().toISOString(),
    });
  }

  revalidatePathsAsync(['/drafts', '/home']);

  // 计算失败数量（总数 - 成功数），不暴露具体失败原因
  const failedCount = validIds.length - deletedCount;

  return {
    success: failedCount === 0,
    deletedCount,
    failedCount,
  };
}
