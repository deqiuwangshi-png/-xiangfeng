'use server';

/**
 * 用户资料辅助函数
 *
 * @module lib/articles/helpers/profile
 * @description 处理用户资料的检查和创建
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 * - 强制验证当前用户只能创建自己的资料
 * - 输入参数进行格式校验
 * - 错误日志脱敏处理
 */

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/user';

/**
 * 验证UUID格式
 * @param userId - 待验证的用户ID
 * @returns 是否为有效的UUID
 */
function isValidUUID(userId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
}

/**
 * 验证邮箱格式
 * @param email - 待验证的邮箱
 * @returns 是否为有效的邮箱格式
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 检查并创建用户资料（安全增强版）
 *
 * 使用 Supabase upsert 原子操作，避免竞态条件
 * 相比先查后插方案：
 * - 1次数据库往返（vs 2次）
 * - 原子操作，无线程安全问题
 * - 代码更简洁
 *
 * @安全优化 S-01: 强制验证当前用户只能创建自己的资料，防止越权
 * @安全优化 S-02: 输入参数格式校验，防止非法数据
 * @安全优化 S-03: 错误日志脱敏，防止信息泄露
 *
 * @param userId - 用户ID（必须为当前登录用户）
 * @param email - 用户邮箱（可选）
 * @returns 是否成功
 */
export async function ensureUserProfile(userId: string, email?: string): Promise<boolean> {
  // 安全：输入参数格式校验
  if (!userId || typeof userId !== 'string') {
    console.error('[ensureUserProfile] 无效的用户ID格式');
    return false;
  }

  if (!isValidUUID(userId)) {
    console.error('[ensureUserProfile] 用户ID不是有效的UUID格式');
    return false;
  }

  if (email !== undefined && !isValidEmail(email)) {
    console.error('[ensureUserProfile] 邮箱格式无效');
    return false;
  }

  const supabase = await createClient();

  // 安全：获取当前登录用户，确保只能创建自己的资料 - 使用统一认证入口
  const user = await getCurrentUser();

  if (!user) {
    console.error('[ensureUserProfile] 用户未登录');
    return false;
  }

  // 安全：强制验证只能创建自己的资料
  if (user.id !== userId) {
    console.error('[ensureUserProfile] 越权尝试：用户尝试创建他人资料', {
      currentUser: user.id,
      targetUser: userId,
    });
    return false;
  }

  // 安全：生成用户名时防止过长
  const username = email
    ? email.split('@')[0].slice(0, 30)
    : `user_${userId.slice(0, 8)}`;

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        username,
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    );

  if (error) {
    // 安全：错误日志脱敏，不输出完整错误详情
    console.error('[ensureUserProfile] 创建用户资料失败', {
      userId: userId.slice(0, 8) + '...',
      errorCode: error.code,
    });
    return false;
  }

  return true;
}
