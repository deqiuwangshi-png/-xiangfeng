'use server';

/**
 * 文章批量操作 Server Actions
 * @module lib/articles/actions/batch
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { BatchDeleteSchema } from '../schema';
import { revalidatePathsAsync } from './utils';

interface BatchDeleteResult {
  success: boolean;
  deletedCount: number;
  failedCount: number;
  mediaDeleted: number;
}

/**
 * 批量删除文章关联的媒体资源
 */
async function deleteArticlesMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleIds: string[]
): Promise<number> {
  if (articleIds.length === 0) return 0;

  try {
    const { data: records } = await supabase
      .from('media')
      .select('storage_path')
      .in('article_id', articleIds);

    if (!records?.length) return 0;

    const paths = records.map(r => r.storage_path);
    const { error: storageError } = await supabase.storage
      .from('wenjian')
      .remove(paths);

    if (storageError) console.error('删除Storage失败:', storageError);

    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .in('article_id', articleIds);

    if (dbError) {
      console.error('删除媒体记录失败:', dbError);
      return 0;
    }

    return records.length;
  } catch (err) {
    console.error('删除媒体异常:', err);
    return 0;
  }
}

/**
 * 批量删除文章
 */
export async function batchDeleteArticles(ids: string[]): Promise<BatchDeleteResult> {
  const supabase = await createClient();
  const user = await requireAuth();

  const validation = BatchDeleteSchema.safeParse({ ids });
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message || '无效的ID列表');
  }

  const { ids: validIds } = validation.data;

  // 查询文章并验证所有权
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, author_id')
    .in('id', validIds);

  if (error) throw new Error(`查询失败: ${error.message}`);

  const articleMap = new Map(articles?.map(a => [a.id, a.author_id]));

  // 分离已授权和未授权的ID
  const authorizedIds: string[] = [];
  const unauthorizedCount = validIds.filter(id => {
    const authorId = articleMap.get(id);
    if (authorId === user.id) {
      authorizedIds.push(id);
      return false;
    }
    return authorId !== undefined; // 未找到的文章不计入越权
  }).length;

  // 记录越权尝试
  if (unauthorizedCount > 0) {
    await supabase.from('security_logs').insert({
      user_id: user.id,
      action: 'batch_delete_unauthorized_attempt',
      target_count: unauthorizedCount,
      created_at: new Date().toISOString(),
    });
  }

  // 执行删除
  let deletedCount = 0;
  let mediaDeleted = 0;

  if (authorizedIds.length > 0) {
    mediaDeleted = await deleteArticlesMedia(supabase, authorizedIds);

    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .in('id', authorizedIds)
      .eq('author_id', user.id);

    if (deleteError) throw new Error(`删除失败: ${deleteError.message}`);

    deletedCount = authorizedIds.length;

    await supabase.from('operation_logs').insert({
      user_id: user.id,
      action: 'batch_delete',
      target_count: deletedCount,
      media_deleted: mediaDeleted,
      created_at: new Date().toISOString(),
    });
  }

  revalidatePathsAsync(['/drafts', '/home']);

  const failedCount = validIds.length - deletedCount;

  return {
    success: failedCount === 0,
    deletedCount,
    failedCount,
    mediaDeleted,
  };
}
