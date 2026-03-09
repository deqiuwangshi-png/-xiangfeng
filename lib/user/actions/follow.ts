'use server';

/**
 * 关注功能 Server Actions
 *
 * @module lib/user/actions/follow
 * @description 处理用户关注和取消关注
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
 * @param targetUserId - 目标用户ID
 * @returns 操作结果
 */
export async function toggleFollow(targetUserId: string): Promise<ToggleFollowResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, following: false, error: '请先登录' };
    }

    {/* 不能关注自己 */}
    if (user.id === targetUserId) {
      return { success: false, following: false, error: '不能关注自己' };
    }

    {/* 检查是否已关注 */}
    const { data: existingFollow, error: checkError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('检查关注状态失败:', checkError);
      return { success: false, following: false, error: '操作失败' };
    }

    let following = false;

    if (existingFollow) {
      {/* 已关注，取消关注 */}
      const { error: deleteError } = await supabase
        .from('follows')
        .delete()
        .eq('id', existingFollow.id);

      if (deleteError) {
        console.error('取消关注失败:', deleteError);
        return { success: false, following: false, error: '取消关注失败' };
      }
      following = false;
    } else {
      {/* 未关注，添加关注 */}
      const { error: insertError } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (insertError) {
        console.error('关注失败:', insertError);
        return { success: false, following: false, error: '关注失败' };
      }
      following = true;
      {/* 注意：通知由数据库触发器自动发送，详见 15通知触发器.sql */}
      
      {/* 检测关注用户任务 - 异步执行不阻塞 */}
      Promise.resolve().then(() => {
        checkFollowUserTask().catch(console.error);
      });
    }

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
