/**
 * 权限保护包装器
 * @module lib/auth/withPermission
 * @description 为Server Action提供统一的权限保护
 */

import {
  checkWritePermission,
  requireAuth,
  requireOwnership,
  type WriteOperation,
} from './permissions';

/**
 * Server Action 函数类型
 * @typedef ServerAction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerAction<T extends any[], R> = (...args: T) => Promise<R>;

/**
 * 权限保护选项
 * @interface WithPermissionOptions
 */
interface WithPermissionOptions {
  /** 需要的操作类型 */
  operation: WriteOperation;
  /** 是否需要资源所有权（从参数中提取资源所有者ID） */
  getResourceOwnerId?: (...args: unknown[]) => string | undefined;
  /** 自定义错误消息 */
  errorMessage?: string;
}

/**
 * 包装Server Action，添加权限检查
 *
 * @param {WithPermissionOptions} options - 权限选项
 * @param {ServerAction} action - 被保护的Server Action
 * @returns {ServerAction} 包装后的Server Action
 *
 * @example
 */
export function withPermission<T extends unknown[], R>(
  options: WithPermissionOptions,
  action: ServerAction<T, R>
): ServerAction<T, R | { success: false; error: string }> {
  return async (...args: T): Promise<R | { success: false; error: string }> => {
    {/* 检查权限 */}
    const resourceOwnerId = options.getResourceOwnerId?.(...args);
    const check = await checkWritePermission(options.operation, resourceOwnerId);

    if (!check.allowed) {
      return {
        success: false,
        error: options.errorMessage || check.error || '权限不足',
      };
    }

    {/* 执行原始操作 */}
    try {
      return await action(...args);
    } catch (error) {
      console.error(`[权限保护] ${options.operation} 操作失败:`, error);
      return {
        success: false,
        error: '操作失败，请稍后重试',
      };
    }
  };
}

/**
 * 要求认证的包装器
 *
 * @param {ServerAction} action - 被保护的Server Action
 * @returns {ServerAction} 包装后的Server Action
 *
 * @example
 * export const createComment = withAuth(
 *   async (articleId: string, content: string) => {
 *     const user = await requireAuth();

 *   }
 * );
 */
export function withAuth<T extends unknown[], R>(
  action: ServerAction<T, R>
): ServerAction<T, R | { success: false; error: string }> {
  return async (...args: T): Promise<R | { success: false; error: string }> => {
    try {
      await requireAuth();
      return await action(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : '请先登录后再进行此操作';
      return {
        success: false,
        error: message,
      };
    }
  };
}

/**
 * 要求资源所有权的包装器
 *
 * @param {Function} getResourceOwnerId - 从参数中提取资源所有者ID的函数
 * @param {ServerAction} action - 被保护的Server Action
 * @returns {ServerAction} 包装后的Server Action
 *
 * @example
 * export const deleteArticle = withOwnership(
 *   (articleId: string) => getArticleAuthorId(articleId),
 *   async (articleId: string) => {
 *
 *   }
 * );
 */
export function withOwnership<T extends unknown[], R>(
  getResourceOwnerId: (...args: T) => string | Promise<string>,
  action: ServerAction<T, R>
): ServerAction<T, R | { success: false; error: string }> {
  return async (...args: T): Promise<R | { success: false; error: string }> => {
    try {
      const ownerId = await getResourceOwnerId(...args);
      await requireOwnership(ownerId);
      return await action(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : '权限不足';
      return {
        success: false,
        error: message,
      };
    }
  };
}

/**
 * 批量保护多个Server Action
 *
 * @param {WriteOperation} operation - 操作类型
 * @param {Record<string, ServerAction>} actions - 需要保护的操作集合
 * @returns {Record<string, ServerAction>} 保护后的操作集合
 *
 * @example
 * const protectedActions = protectActions('like', {
 *   likeArticle: async (id) => { return { success: true }; },
 *   unlikeArticle: async (id) => { return { success: true }; },
 * });
 */
export function protectActions<T extends Record<string, ServerAction<unknown[], unknown>>>(
  operation: WriteOperation,
  actions: T
): { [K in keyof T]: T[K] } {
  const protectedActions = {} as { [K in keyof T]: T[K] };

  for (const [key, action] of Object.entries(actions)) {
    (protectedActions as Record<string, unknown>)[key] = withPermission(
      { operation },
      action as ServerAction<unknown[], unknown>
    );
  }

  return protectedActions;
}
