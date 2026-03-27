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
 */

import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type {
  UserRole,
  WriteOperation,
  PermissionCheckResult,
} from '@/types/permissions';

export type { UserRole, WriteOperation, PermissionCheckResult } from '@/types/permissions';

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

 */
export async function getCurrentUserWithRole(): Promise<{
  user: User | null;
  role: UserRole;
}> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
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
 */
export async function isAuthenticated(): Promise<boolean> {
  const { role } = await getCurrentUserWithRole();
  return role === 'authenticated' || role === 'admin';
}

/**
 * 检查是否为管理员
 *
 * @returns {Promise<boolean>} 是否为管理员
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
      error: '请先登录后再进行此操作',
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
        error: '您没有权限操作此资源',
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
    throw new Error('请先登录后再进行此操作');
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
    throw new Error('您没有权限操作此资源');
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
        error: '不支持此操作类型',
        user: null,
        role: 'anonymous',
      };
    }

    return checkWritePermission(operation, resourceOwnerId);
  };
}
