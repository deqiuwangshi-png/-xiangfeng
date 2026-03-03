/**
 * 认证错误处理 Hook
 * @module lib/auth/useAuthError
 * @description 统一管理认证页面的错误状态和处理逻辑
 */

import { useState, useCallback } from 'react';
import { mapSupabaseError } from './errorMessages';

/**
 * 认证错误处理 Hook 返回值
 * @interface UseAuthErrorReturn
 */
interface UseAuthErrorReturn {
  /** 当前错误消息 */
  error: string | null;
  /** 设置错误消息 */
  setError: (error: string | null) => void;
  /** 处理 Supabase 错误 */
  handleSupabaseError: (err: unknown, context: 'login' | 'register' | 'forgot-password' | 'reset-password') => void;
  /** 清除错误 */
  clearError: () => void;
}

/**
 * 认证错误处理 Hook
 * @returns {UseAuthErrorReturn} 错误处理方法和状态
 * 
 * @example
 * const { error, handleSupabaseError, clearError } = useAuthError();
 * 
 * try {
 *   await supabase.auth.signInWithPassword({ email, password });
 * } catch (err) {
 *   handleSupabaseError(err, 'login');
 * }
 */
export function useAuthError(): UseAuthErrorReturn {
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理 Supabase 错误
   * @param err - 错误对象
   * @param context - 错误上下文
   */
  const handleSupabaseError = useCallback(
    (err: unknown, context: 'login' | 'register' | 'forgot-password' | 'reset-password') => {
      if (err instanceof Error) {
        const friendlyMessage = mapSupabaseError(err.message, context);
        setError(friendlyMessage);
      } else {
        setError('操作失败，请稍后重试');
      }
    },
    []
  );

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleSupabaseError,
    clearError,
  };
}
