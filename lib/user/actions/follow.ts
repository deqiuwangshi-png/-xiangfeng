'use server';

/**
 * 关注功能 Server Actions
 *
 * @module lib/user/actions/follow
 * @description 处理用户关注和取消关注
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 *
 * @优化说明
 * - 使用插入-冲突模式减少数据库查询次数
 * - 触发器自动维护 followers_count/following_count
 * - 通知由数据库触发器自动发送
 * - 使用 withAuth 统一权限控制
 *
 * @权限控制
 * - 匿名用户禁止关注
 * - 认证用户可以关注/取消关注
 */

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/core/user';
import { requireAuth } from '@/lib/auth/core/permissions';
import { withAuth } from '@/lib/auth/core/withPermission';
import { checkFollowUserTask } from '@/lib/rewards/tasks';
import { FOLLOW_MESSAGES, COMMON_ERRORS } from '@/lib/messages';

/**
 * 关注/取消关注结果
 */
export interface ToggleFollowResult {
  success: boolean;
  following: boolean;
  error?: string;
}

/**
 * 关注状态查询结果
 */
export interface FollowStatusResult {
  success: boolean;
  following?: boolean;
  followersCount?: number;
  followingCount?: number;
  error?: string;
}

/**
 * 关注/取消关注用户
 *
 * 优化方案：
 * 1. 直接插入，利用唯一约束判断重复
 * 2. 冲突时删除（取消关注）
 * 3. 触发器自动维护计数和发送通知
 * 4. 减少数据库往返次数
 * 5. 使用 withAuth 统一权限控制
 *
 * @param targetUserId - 目标用户ID
 * @returns 操作结果
 */
export const toggleFollow = withAuth(
  async (targetUserId: string): Promise<ToggleFollowResult> => {
    const user = await requireAuth();
    const supabase = await createClient();

    try {
      // 不能关注自己
      if (user.id === targetUserId) {
        return { success: false, following: false, error: FOLLOW_MESSAGES.SELF_FOLLOW };
      }

      let following = false;

      // 1. 尝试插入关注 - 利用唯一约束防重
      const { error: insertError } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (insertError) {
        // 唯一约束冲突 (23505) = 已关注，取消关注
        if (insertError.code === '23505') {
          const { error: deleteError } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', targetUserId);

          if (deleteError) {
            console.error('取消关注失败:', deleteError);
            return { success: false, following: false, error: FOLLOW_MESSAGES.UNFOLLOW_ERROR };
          }
          following = false;
        } else {
          console.error('关注插入失败:', insertError);
          return { success: false, following: false, error: FOLLOW_MESSAGES.FOLLOW_ERROR };
        }
      } else {
        // 插入成功 = 新关注
        following = true;
        // 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql
        // 异步检测任务，不阻塞主流程
        Promise.resolve().then(async () => {
          const taskSuccess = await checkFollowUserTask()
          if (!taskSuccess) {
            console.warn('[任务系统] 关注用户任务进度更新失败，不影响关注操作')
          }
        })
      }

      // 2. 触发器自动维护计数，直接返回结果
      return {
        success: true,
        following,
      };
    } catch (error) {
      console.error('关注操作失败:', error);
      return { success: false, following: false, error: COMMON_ERRORS.UNKNOWN_ERROR };
    }
  }
);

/**
 * 获取关注状态
 *
 * @param targetUserId - 目标用户ID
 * @returns 关注状态
 */
export async function getFollowStatus(targetUserId: string): Promise<FollowStatusResult> {
  const supabase = await createClient();

  try {
    // 使用统一认证入口获取当前用户
    const user = await getCurrentUser();

    {/* 获取目标用户的粉丝数和关注数 */}
    const { data: profile } = await supabase
      .from('profiles')
      .select('followers_count, following_count')
      .eq('id', targetUserId)
      .single();

    {/* 如果未登录，只返回计数 */}
    if (!user) {
      return {
        success: true,
        following: false,
        followersCount: profile?.followers_count || 0,
        followingCount: profile?.following_count || 0,
      };
    }

    {/* 检查是否已关注 */}
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    return {
      success: true,
      following: !!existingFollow,
      followersCount: profile?.followers_count || 0,
      followingCount: profile?.following_count || 0,
    };
  } catch (error) {
    console.error('获取关注状态失败:', error);
    return { success: false, error: FOLLOW_MESSAGES.GET_STATUS_ERROR };
  }
}

