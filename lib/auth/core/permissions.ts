/**
 * 权限控制系统（服务端专用）
 * @module lib/auth/permissions
 * @description 统一管理用户权限，区分匿名用户和认证用户的操作权限
 *
 * @权限规则
 * - 匿名用户(ANONYMOUS): 只能浏览公开内容，禁止任何写入操作
 * - 认证用户(AUTHENTICATED): 可以操作自己的资源，禁止操作他人资源
 * - 管理员(ADMIN): 拥有所有权限
 *
 * @注意 此模块只能在服务端使用（Server Components / Server Actions）
 * 因为它依赖 next/headers 和 @/lib/supabase/server
 *
 * @统一认证 2026-03-30
 * - 统一使用 lib/auth/user.ts 作为用户获取唯一入口
 * - 避免重复定义 getCurrentUser 和 isAuthenticated
 * - 使用 React cache() 确保同一请求内共享用户数据
 */

import { LOGIN_MESSAGES, COMMON_ERRORS } from '@/lib/messages';
import { getCurrentUser } from '@/lib/auth/core/user';
import type { User } from '@supabase/supabase-js';
import type {
  UserRole,
  WriteOperation,
  PermissionCheckResult,
} from '@/types/auth/permissions';

export type { UserRole, WriteOperation, PermissionCheckResult } from '@/types/auth/permissions';

/**
 * 扩展权限检查结果接口（服务端版本，包含用户对象）
 * @interface ServerPermissionCheckResult
 */
interface ServerPermissionCheckResult extends PermissionCheckResult {
  /** 当前用户 */
  user: User | null;
}

/**
 * 获取当前用户及角色
 *
 * @returns {Promise<{user: User | null, role: UserRole}>} 用户信息和角色
 *
 * @example
 * const { user, role } = await getCurrentUserWithRole()
 * if (role === 'admin') {
 *   // 管理员操作
 * }
 *
 * @优化说明
 * - 使用 lib/supabase/user.ts 中的 getCurrentUser() 获取用户
 * - 自动享受 React cache() 的缓存 benefits
 */
export async function getCurrentUserWithRole(): Promise<{
  user: User | null;
  role: UserRole;
}> {
  // 使用统一的用户获取入口（带缓存）
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, role: 'anonymous' };
  }

  {/* 检查是否为管理员 - 通过用户元数据或数据库配置判断 */}
  const isAdmin = user.app_metadata?.role === 'admin' ||
                  user.user_metadata?.role === 'admin';

  return {
    user,
    role: isAdmin ? 'admin' : 'authenticated',
  };
}

/**
 * 检查是否为认证用户
 *
 * @returns {Promise<boolean>} 是否已认证
 *
 * @注意 此函数保留用于向后兼容，内部使用 getCurrentUserWithRole()
 * 推荐使用 lib/supabase/user.ts 中的 isAuthenticated() 进行简单的登录检查
 */
export async function isAuthenticated(): Promise<boolean> {
  const { role } = await getCurrentUserWithRole();
  return role === 'authenticated' || role === 'admin';
}

/**
 * 检查是否为管理员
 *
 * @returns {Promise<boolean>} 是否为管理员
 *
 * @注意 此函数保留用于向后兼容，内部使用 getCurrentUserWithRole()
 */
export async function isAdmin(): Promise<boolean> {
  const { role } = await getCurrentUserWithRole();
  return role === 'admin';
}

/**
 * 验证写入操作权限
 *
 * @param {WriteOperation} _operation - 操作类型
 * @param {string} [resourceOwnerId] - 资源所有者ID（用于验证是否操作自己的资源）
 * @returns {Promise<PermissionCheckResult>} 权限检查结果
 *
 * @example
 * @example

 */
export async function checkWritePermission(
  _operation: WriteOperation,
  resourceOwnerId?: string
): Promise<ServerPermissionCheckResult> {
  const { user, role } = await getCurrentUserWithRole();

  {/* 管理员拥有所有权限 */}
  if (role === 'admin') {
    return { allowed: true, user, role };
  }

  {/* 匿名用户禁止所有写入操作 */}
  if (role === 'anonymous') {
    return {
      allowed: false,
      error: LOGIN_MESSAGES.NOT_AUTHENTICATED,
      user: null,
      role: 'anonymous',
    };
  }

  {/* 认证用户检查资源所有权 */}
  if (resourceOwnerId && user) {
    {/* 只能操作自己的资源 */}
    if (resourceOwnerId !== user.id) {
      return {
        allowed: false,
        error: COMMON_ERRORS.FORBIDDEN,
        user,
        role: 'authenticated',
      };
    }
  }

  return { allowed: true, user, role: 'authenticated' };
}

/**
 * 要求认证用户（用于Server Action）
 *
 * @returns {Promise<User>} 当前用户对象
 * @throws {Error} 如果用户未登录
 *
 * @example

 */
export async function requireAuth(): Promise<User> {
  const { user, role } = await getCurrentUserWithRole();

  if (role === 'anonymous' || !user) {
    throw new Error(LOGIN_MESSAGES.NOT_AUTHENTICATED);
  }

  return user;
}

/**
 * 要求资源所有权（用于Server Action）
 *
 * @param {string} resourceOwnerId - 资源所有者ID
 * @returns {Promise<User>} 当前用户对象
 * @throws {Error} 如果用户未登录或无权限
 *
 * @example

 */
export async function requireOwnership(resourceOwnerId: string): Promise<User> {
  const user = await requireAuth();

  {/* 管理员可以操作任何资源 */}
  const { role } = await getCurrentUserWithRole();
  if (role === 'admin') {
    return user;
  }

  if (user.id !== resourceOwnerId) {
    throw new Error(COMMON_ERRORS.FORBIDDEN);
  }

  return user;
}

/**
 * 创建权限守卫函数（用于重复使用的权限检查）
 *
 * @param {WriteOperation[]} allowedOperations - 允许的操作列表
 * @returns {Function} 权限检查函数
 *
 * @example

 */
export function createPermissionGuard(allowedOperations: WriteOperation[]) {
  return async (
    operation: WriteOperation,
    resourceOwnerId?: string
  ): Promise<ServerPermissionCheckResult> => {
    if (!allowedOperations.includes(operation)) {
      return {
        allowed: false,
        error: COMMON_ERRORS.INVALID_PARAMS,
        user: null,
        role: 'anonymous',
      };
    }

    return checkWritePermission(operation, resourceOwnerId);
  };
}
