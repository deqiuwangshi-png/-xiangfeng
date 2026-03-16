'use server';

/**
 * 关注功能 Server Actions
 *
 * @module lib/user/actions/follow
 * @description 处理用户关注和取消关注
 *
 * @优化说明
 * - 使用插入-冲突模式减少数据库查询次数
 * - 触发器自动维护 followers_count/following_count
 * - 通知由数据库触发器自动发送
 */

import { createClient } from '@/lib/supabase/server';
import { checkFollowUserTask } from '@/lib/rewards/actions/tasks';

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
 *
 * @param targetUserId - 目标用户ID
 * @returns 操作结果
 */
export async function toggleFollow(targetUserId: string): Promise<ToggleFollowResult> {
  const supabase = await createClient();

  try {
    // 1. 获取当前登录用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, following: false, error: '请先登录' };
    }

    // 2. 不能关注自己
    if (user.id === targetUserId) {
      return { success: false, following: false, error: '不能关注自己' };
    }

    let following = false;

    // 3. 尝试插入关注 - 利用唯一约束防重
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
          return { success: false, following: false, error: '取消关注失败' };
        }
        following = false;
      } else {
        console.error('关注插入失败:', insertError);
        return { success: false, following: false, error: '操作失败' };
      }
    } else {
      // 插入成功 = 新关注
      following = true;
      // 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql
      // 异步检测任务，不阻塞主流程
      Promise.resolve().then(() => {
        checkFollowUserTask().catch(console.error);
      });
    }

    // 4. 触发器自动维护计数，直接返回结果
    return {
      success: true,
      following,
    };
  } catch (error) {
    console.error('关注操作失败:', error);
    return { success: false, following: false, error: '操作失败' };
  }
}

/**
 * 获取关注状态
 *
 * @param targetUserId - 目标用户ID
 * @returns 关注状态
 */
export async function getFollowStatus(targetUserId: string): Promise<FollowStatusResult> {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

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
    return { success: false, error: '获取关注状态失败' };
  }
}

{/* 注意：所有通知发送逻辑已迁移到数据库触发器，详见 docs/05数据库文档/sql文件/15通知触发器.sql */}
