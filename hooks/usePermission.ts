/**
 * 权限控制 Hook
 * @module hooks/usePermission
 * @description 前端权限检查Hook，用于控制UI元素显示和操作
 *
 * @使用场景
 * - 控制按钮显示/隐藏（如：未登录隐藏点赞按钮）
 * - 操作前权限预检
 * - 根据权限显示不同UI
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthToast } from './useAuthToast';

/**
 * 权限Hook返回值接口
 * @interface UsePermissionReturn
 */
export interface UsePermissionReturn {
  /** 是否正在检查权限 */
  isChecking: boolean;
  /** 检查是否已认证 */
  checkAuth: () => Promise<boolean>;
  /** 要求认证（未登录时跳转） */
  requireAuth: (redirectTo?: string) => Promise<boolean>;
  /** 显示登录提示 */
  showAuthRequired: (action?: string) => void;
}

/**
 * 权限控制 Hook
 *
 * @returns {UsePermissionReturn} 权限控制方法和状态
 *
 * @example
 *   function LikeButton({ articleId }: { articleId: string }) {
 *     const { requireAuth, isChecking } = usePermission();
 *
 *     const handleLike = async () => {
 *       const hasAuth = await requireAuth();
 *       if (!hasAuth) return;
 *     };
 *
 *     return (
 *       <button onClick={handleLike} disabled={isChecking}>
 *         点赞
 *       </button>
 *     );
 *   }
 *
 * @example
 *   function CommentForm() {
 *     const { showAuthRequired, checkAuth } = usePermission();
 *
 *     const handleSubmit = async (content: string) => {
 *       const hasAuth = await checkAuth();
 *       if (!hasAuth) {
 *         showAuthRequired('评论');
 *         return;
 *       }
 *     };
 *   }
 */
export function usePermission(): UsePermissionReturn {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();
  const { showLoginRequired } = useAuthToast();

  /**
   * 检查用户是否已认证
   * 通过调用API检查会话状态
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.authenticated === true;
    } catch {
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * 要求用户认证，未登录时跳转登录页
   */
  const requireAuth = useCallback(
    async (redirectTo?: string): Promise<boolean> => {
      const hasAuth = await checkAuth();

      if (!hasAuth) {
        const currentPath = window.location.pathname;
        const loginUrl = `/login?redirect=${encodeURIComponent(redirectTo || currentPath)}`;
        router.push(loginUrl);
        return false;
      }

      return true;
    },
    [checkAuth, router]
  );

  /**
   * 显示需要登录的提示
   */
  const showAuthRequired = useCallback(
    (action?: string) => {
      showLoginRequired(action);
    },
    [showLoginRequired]
  );

  return {
    isChecking,
    checkAuth,
    requireAuth,
    showAuthRequired,
  };
}

/**
 * 简化的权限检查Hook（仅返回认证状态）
 *
 * @returns {boolean} 是否已认证
 *
 * @example
 * function ActionButton() {
 *   const isAuthenticated = useIsAuthenticated();
 *
 *   return (
 *     <button disabled={!isAuthenticated}>
 *       执行操作
 *     </button>
 *   );
 * }
 */
export function useIsAuthenticated(): boolean {
  {/* 此Hook需要配合AuthProvider使用，从上下文中获取认证状态 */}
  {/* 暂时返回false，实际项目中应从AuthContext获取 */}
  return false;
}
