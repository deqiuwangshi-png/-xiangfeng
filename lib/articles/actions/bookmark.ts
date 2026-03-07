'use server';

/**
 * 收藏功能 Server Actions
 *
 * @module lib/articles/actions/bookmark
 * @description 处理文章收藏
 */

import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '../helpers/profile';

/**
 * 收藏/取消收藏结果
 */
export interface ToggleBookmarkResult {
  success: boolean;
  favorited: boolean;
  favorites: number;
  error?: string;
}

/**
 * 文章收藏/取消收藏
 *
 * @param articleId - 文章ID
 * @returns 收藏结果
 */
export async function toggleArticleBookmark(articleId: string): Promise<ToggleBookmarkResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, favorited: false, favorites: 0, error: '请先登录' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, favorited: false, favorites: 0, error: '用户资料初始化失败' };
    }

    {/* 检查是否已收藏 */}
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('检查收藏状态失败:', checkError);
      return { success: false, favorited: false, favorites: 0, error: '操作失败' };
    }

    let favorited = false;

    if (existingFavorite) {
      {/* 已收藏，取消收藏 */}
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existingFavorite.id);

      if (deleteError) {
        console.error('取消收藏失败:', deleteError);
        return { success: false, favorited: false, favorites: 0, error: '取消收藏失败' };
      }
      favorited = false;
    } else {
      {/* 未收藏，添加收藏 */}
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      if (insertError) {
        console.error('收藏失败:', insertError);
        return { success: false, favorited: false, favorites: 0, error: '收藏失败' };
      }
      favorited = true;
    }

    {/* 获取最新的收藏数 */}
    const { data: article } = await supabase
      .from('articles')
      .select('favorite_count')
      .eq('id', articleId)
      .single();

    return {
      success: true,
      favorited,
      favorites: article?.favorite_count || 0,
    };
  } catch (error) {
    console.error('收藏操作失败:', error);
    return { success: false, favorited: false, favorites: 0, error: '操作失败' };
  }
}
