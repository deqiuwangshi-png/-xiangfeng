/**
 * 已登录 Server Action 包装
 * @module lib/auth/withPermission
 * @description 注入 `User`；若需要 `SupabaseClient` 请用 `withAuthSession`（`lib/auth/core/sessionContext`）
 */

import { requireAuth } from './permissions';
import type { User } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerAction<T extends any[], R> = (...args: T) => Promise<R>;

/**
 * 已登录 Server Action：注入 `User`，其余参数为业务参数。
 */
export function withAuth<T extends unknown[], R>(
  action: (user: User, ...args: T) => Promise<R>
): ServerAction<T, R | { success: false; error: string }> {
  return async (...args: T): Promise<R | { success: false; error: string }> => {
    try {
      const user = await requireAuth();
      return await action(user, ...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : '请先登录后再进行此操作';
      return {
        success: false,
        error: message,
      };
    }
  };
}
