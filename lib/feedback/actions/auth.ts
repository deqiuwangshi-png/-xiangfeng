'use server';

/**
 * 反馈模块用户认证工具
 * @module lib/feedback/actions/auth
 * @description 反馈模块专用的用户认证工具函数
 *
 * @统一认证 2026-03-30
 * - 统一使用 lib/auth/user.ts 作为用户获取入口
 * - 避免重复定义 getCurrentUser
 * - 使用 React cache() 确保同一请求内共享用户数据
 */

import { getCurrentUser as getGlobalCurrentUser } from '@/lib/auth/server';

/**
 * 获取当前登录用户信息（反馈模块专用格式）
 *
 * @returns 用户ID和邮箱，如果未登录则返回空对象
 *
 * @注意 此函数是 lib/auth/user.ts 的包装器
 * 保持返回格式与原有代码兼容
 */
export async function getCurrentUser(): Promise<{ userId?: string; userEmail?: string }> {
  try {
    // 使用统一的用户获取入口（带缓存）
    const user = await getGlobalCurrentUser();

    if (user) {
      return {
        userId: user.id,
        userEmail: user.email,
      };
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }

  return {};
}
