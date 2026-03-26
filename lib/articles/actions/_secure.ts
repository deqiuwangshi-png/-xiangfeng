/**
 * 文章模块安全工具函数
 *
 * @module lib/articles/actions/_secure
 * @description 提供权限验证、内容净化等安全功能
 */

import { createClient } from '@/lib/supabase/server';

/**
 * 验证用户是否为文章作者
 *
 * @param articleId - 文章ID
 * @param userId - 用户ID
 * @returns 是否为作者
 * @throws 文章不存在时抛出错误
 */
export async function verifyArticleOwnership(
  articleId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', articleId)
    .single();

  if (error || !article) {
    throw new Error('文章不存在');
  }

  return article.author_id === userId;
}

/**
 * 验证用户是否为评论作者
 *
 * @param commentId - 评论ID
 * @param userId - 用户ID
 * @returns 是否为作者
 * @throws 评论不存在时抛出错误
 */
export async function verifyCommentOwnership(
  commentId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: comment, error } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (error || !comment) {
    throw new Error('评论不存在');
  }

  return comment.user_id === userId;
}


