'use server';

/**
 * 收藏功能 Server Actions
 *
 * @module lib/articles/actions/bookmark
 * @description 处理文章收藏
 *
 * @优化说明
 * - 使用插入-冲突模式减少数据库查询次数
 * - 移除 ensureUserProfile 检查（应在注册时完成）
 * - 触发器自动维护 favorite_count
 */

import { createClient } from '@/lib/supabase/server';
import { checkCollectArticleTask } from '@/lib/rewards/actions/tasks';

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
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消收藏）
 * 3. 触发器自动维护 favorite_count
 * 4. 减少数据库往返次数
 *
 * @param articleId - 文章ID
 * @returns 收藏结果
 */
export async function toggleArticleBookmark(articleId: string): Promise<ToggleBookmarkResult> {
  const supabase = await createClient();

  try {
    // 1. 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, favorited: false, favorites: 0, error: '请先登录' };
    }

    let favorited = false;

    // 2. 尝试插入收藏 - 利用唯一约束防重
    const { error: insertError } = await supabase
      .from('favorites')
      .insert({
        article_id: articleId,
        user_id: user.id,
      });

    if (insertError) {
      // 唯一约束冲突 (23505) = 已收藏，取消收藏
      if (insertError.code === '23505') {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('取消收藏失败:', deleteError);
          return { success: false, favorited: false, favorites: 0, error: '取消收藏失败' };
        }
        favorited = false;
      } else {
        console.error('收藏插入失败:', insertError);
        return { success: false, favorited: false, favorites: 0, error: '操作失败' };
      }
    } else {
      // 插入成功 = 新收藏
      favorited = true;
      // 异步检测任务，不阻塞主流程
      Promise.resolve().then(async () => {
        const taskSuccess = await checkCollectArticleTask()
        if (!taskSuccess) {
          console.warn('[任务系统] 收藏文章任务进度更新失败，不影响收藏操作')
        }
      })
    }

    // 3. 触发器自动维护 favorite_count，返回乐观更新值
    return {
      success: true,
      favorited,
      favorites: favorited ? 1 : 0, // 前端会根据当前状态计算
    };
  } catch (error) {
    console.error('收藏操作失败:', error);
    return { success: false, favorited: false, favorites: 0, error: '操作失败' };
  }
}
