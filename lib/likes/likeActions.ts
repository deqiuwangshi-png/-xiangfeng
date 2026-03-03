'use server';

/**
 * 点赞相关 Server Actions
 *
 * 职责：处理文章点赞/取消点赞功能
 *
 * @module likeActions
 */

import { createClient } from '@/lib/supabase/server';

/**
 * 点赞文章
 *
 * @param articleId - 文章ID
 * @returns 更新后的点赞数和点赞状态
 *
 * @example
 * ```typescript
 * const { likesCount, isLiked } = await likeArticle('article-id');
 * ```
 */
export async function likeArticle(articleId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('用户未登录');

  // 先检查是否已经点赞
  const { data: existingLike } = await supabase
    .from('likes')
    .select('*')
    .eq('article_id', articleId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    // 取消点赞
    await supabase
      .from('likes')
      .delete()
      .eq('article_id', articleId)
      .eq('user_id', user.id);

    // 减少文章点赞数
    const { data: article } = await supabase
      .from('articles')
      .select('likes_count')
      .eq('id', articleId)
      .single();

    const newCount = Math.max(0, (article?.likes_count || 0) - 1);

    await supabase
      .from('articles')
      .update({ likes_count: newCount })
      .eq('id', articleId);

    return { likesCount: newCount, isLiked: false };
  } else {
    // 添加点赞
    await supabase
      .from('likes')
      .insert({
        article_id: articleId,
        user_id: user.id,
      });

    // 增加文章点赞数
    const { data: article } = await supabase
      .from('articles')
      .select('likes_count')
      .eq('id', articleId)
      .single();

    const newCount = (article?.likes_count || 0) + 1;

    await supabase
      .from('articles')
      .update({ likes_count: newCount })
      .eq('id', articleId);

    return { likesCount: newCount, isLiked: true };
  }
}

/**
 * 检查用户是否已点赞文章
 *
 * @param articleId - 文章ID
 * @returns 是否已点赞
 *
 * @example
 * ```typescript
 * const { isLiked } = await checkIsLiked('article-id');
 * ```
 */
export async function checkIsLiked(articleId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isLiked: false };

  const { data } = await supabase
    .from('likes')
    .select('*')
    .eq('article_id', articleId)
    .eq('user_id', user.id)
    .single();

  return { isLiked: !!data };
}
