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
 * - 级联删除关联的媒体资源
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/core/permissions';
import { BatchDeleteSchema } from '../schema';
import { revalidatePathsAsync } from './utils';

/**
 * 批量删除文章关联的媒体资源
 *
 * @param supabase - Supabase客户端
 * @param articleIds - 文章ID数组
 * @returns 删除结果
 *
 * @安全说明
 * - 只删除与指定文章关联的媒体
 * - 同时删除Storage中的文件
 * - 错误不影响主流程，记录日志
 */
async function batchDeleteArticlesMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleIds: string[]
): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  if (articleIds.length === 0) {
    return { success: true, deletedCount: 0 };
  }

  try {
    // 1. 查询关联的媒体记录
    const { data: mediaRecords, error: fetchError } = await supabase
      .from('media')
      .select('id, storage_path')
      .in('article_id', articleIds);

    if (fetchError) {
      console.error('批量查询文章媒体失败:', fetchError);
      return { success: false, deletedCount: 0, error: fetchError.message };
    }

    if (!mediaRecords || mediaRecords.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    // 2. 从Storage删除文件
    const storagePaths = mediaRecords.map((m) => m.storage_path);
    const { error: storageError } = await supabase.storage
      .from('wenjian')
      .remove(storagePaths);

    if (storageError) {
      console.error('批量删除Storage文件失败:', storageError);
      // 继续删除数据库记录，不中断流程
    }

    // 3. 删除数据库记录
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .in('article_id', articleIds);

    if (deleteError) {
      console.error('批量删除媒体记录失败:', deleteError);
      return { success: false, deletedCount: 0, error: deleteError.message };
    }

    return { success: true, deletedCount: mediaRecords.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('批量删除文章媒体异常:', message);
    return { success: false, deletedCount: 0, error: message };
  }
}

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
  /** 删除的媒体资源数量 */
  mediaDeleted?: number;
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
  let mediaDeletedCount = 0;

  if (authorizedIds.length > 0) {
    // 1. 先批量删除关联的媒体资源（级联删除）
    const mediaResult = await batchDeleteArticlesMedia(supabase, authorizedIds);
    if (mediaResult.success) {
      mediaDeletedCount = mediaResult.deletedCount;
    } else {
      console.warn('批量删除媒体资源失败:', mediaResult.error);
      // 继续删除文章，不中断流程
    }

    // 2. 批量删除文章
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
      media_deleted: mediaDeletedCount,
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
    mediaDeleted: mediaDeletedCount,
  };
}
