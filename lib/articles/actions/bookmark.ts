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
 * - 使用 withAuth 统一权限控制
 *
 * @权限控制
 * - 匿名用户禁止收藏
 * - 认证用户可以收藏/取消收藏
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth, withAuth } from '@/lib/auth/server';
import { checkCollectArticleTask } from '@/lib/rewards/tasks';
import { isValidUUID } from '../helpers/utils';
import { ARTICLE_ERROR_MESSAGES, ARTICLE_INTERACTION_MESSAGES, COMMON_ERRORS } from '@/lib/messages';

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
 * 5. 使用 withAuth 统一权限控制
 *
 * @param articleId - 文章ID
 * @returns 收藏结果
 */
export const toggleArticleBookmark = withAuth(
  async (articleId: string): Promise<ToggleBookmarkResult> => {
    // 1. 验证 articleId 格式
    if (!isValidUUID(articleId)) {
      return { success: false, favorited: false, favorites: 0, error: ARTICLE_ERROR_MESSAGES.NOT_FOUND };
    }

    const user = await requireAuth();
    const supabase = await createClient();
    const currentUserId = user.id;
    const currentArticleId = articleId;

    try {
      let favorited = false;

      // 2. 尝试插入收藏 - 利用唯一约束防重
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          article_id: currentArticleId,
          user_id: currentUserId,
        });

      if (insertError) {
        // 唯一约束冲突 (23505) = 已收藏，取消收藏
        if (insertError.code === '23505') {
          const { error: deleteError } = await supabase
            .from('favorites')
            .delete()
            .eq('article_id', currentArticleId)
            .eq('user_id', currentUserId);

          if (deleteError) {
            console.error('取消收藏失败:', deleteError);
            return { success: false, favorited: false, favorites: 0, error: ARTICLE_INTERACTION_MESSAGES.UNBOOKMARK_ERROR };
          }
          favorited = false;
        } else if (insertError.code === '23503') {
          // 外键约束错误 - 文章不存在
          console.error('收藏失败，文章不存在:', insertError);
          return { success: false, favorited: false, favorites: 0, error: ARTICLE_ERROR_MESSAGES.NOT_FOUND };
        } else {
          console.error('收藏插入失败:', insertError);
          return { success: false, favorited: false, favorites: 0, error: ARTICLE_INTERACTION_MESSAGES.BOOKMARK_ERROR };
        }
      } else {
        // 插入成功 = 新收藏
        favorited = true;
        // 异步检测任务，不阻塞主流程 - 使用局部变量避免闭包问题
        setImmediate(async () => {
          try {
            const taskSuccess = await checkCollectArticleTask();
            if (!taskSuccess) {
              console.warn('[任务系统] 收藏文章任务进度更新失败，不影响收藏操作');
            }
          } catch (taskError) {
            console.warn('[任务系统] 任务检测异常:', taskError);
          }
        });
      }

      // 3. 查询数据库获取实时收藏计数
      const { data: articleData, error: countError } = await supabase
        .from('articles')
        .select('favorite_count')
        .eq('id', currentArticleId)
        .single();

      if (countError) {
        console.error('获取收藏计数失败:', countError);
      }

      return {
        success: true,
        favorited,
        favorites: articleData?.favorite_count ?? (favorited ? 1 : 0),
      };
    } catch (error) {
      console.error('收藏操作失败:', error);
      return { success: false, favorited: false, favorites: 0, error: COMMON_ERRORS.UNKNOWN_ERROR };
    }
  }
);
