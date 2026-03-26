'use client';

import React from 'react';
import { toast } from 'sonner';
import { CircleAlert, CircleCheck, CircleX, WifiOff, Clock, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { AuthErrorType } from '@/types';

export type { AuthErrorType } from '@/types';

/**
 * 错误码映射
 */
const ERROR_CODE_MAP: Record<string, AuthErrorType> = {
  NETWORK_ERROR: 'network',
  TOO_MANY_REQUESTS: 'rateLimit',
  INVALID_CREDENTIALS: 'validation',
  EMAIL_NOT_CONFIRMED: 'validation',
  USER_NOT_FOUND: 'validation',
  EMAIL_ALREADY_REGISTERED: 'validation',
  USERNAME_ALREADY_TAKEN: 'validation',
  INVALID_EMAIL: 'validation',
  EMAIL_NOT_ALLOWED: 'validation',
  PASSWORD_TOO_WEAK: 'validation',
  PASSWORD_MISMATCH: 'validation',
  TERMS_NOT_ACCEPTED: 'validation',
  LINK_EXPIRED: 'validation',
};

/**
 * 关键词映射（兜底）
 */
const ERROR_KEYWORDS: { keywords: string[]; type: AuthErrorType }[] = [
  { keywords: ['网络', '连接', 'timeout', 'fetch', 'Network'], type: 'network' },
  { keywords: ['频繁', 'rate', 'limit', 'too many'], type: 'rateLimit' },
  { keywords: ['服务器', 'server', '500', '503'], type: 'server' },
];

/**
 * 获取错误类型
 * @param error - 错误消息或错误码
 * @returns 错误类型
 */
function getErrorType(error: string): AuthErrorType {
  // 优先匹配错误码
  for (const [code, type] of Object.entries(ERROR_CODE_MAP)) {
    if (error.includes(code)) return type;
  }

  // 兜底：关键词匹配
  for (const { keywords, type } of ERROR_KEYWORDS) {
    if (keywords.some(kw => error.toLowerCase().includes(kw.toLowerCase()))) {
      return type;
    }
  }

  return 'unknown';
}

/**
 * 错误类型配置
 */
const ERROR_CONFIG: Record<AuthErrorType, { icon: LucideIcon; duration: number }> = {
  network: { icon: WifiOff, duration: 4000 },
  validation: { icon: CircleAlert, duration: 4000 },
  rateLimit: { icon: Clock, duration: 5000 },
  server: { icon: ShieldAlert, duration: 4000 },
  unknown: { icon: CircleX, duration: 4000 },
};

/**
 * 认证系统 Toast Hook
 * @returns Toast 操作方法
 */
export function useAuthToast() {
  /**
   * 显示错误提示
   * @param message - 错误消息
   * @param type - 错误类型（可选，自动推断）
   */
  const showError = (message: string, type?: AuthErrorType) => {
    const errorType = type || getErrorType(message);
    const config = ERROR_CONFIG[errorType];
    const IconComponent = config.icon;

    toast.error(message, {
      duration: config.duration,
      icon: React.createElement(IconComponent, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示成功提示
   * @param message - 成功消息
   */
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      icon: React.createElement(CircleCheck, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示加载提示
   * @param message - 加载消息（如"登录中..."）
   * @returns toastId - 用于手动关闭
   */
  const showLoading = (message: string): string | number => {
    return toast.loading(message, {
      duration: Infinity,
    });
  };

  /**
   * 关闭指定toast
   * @param toastId - toast ID
   */
  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  /**
   * 将加载转为成功
   * @param toastId - loading toast ID
   * @param message - 成功消息
   */
  const successFromLoading = (toastId: string | number, message: string) => {
    toast.success(message, {
      id: toastId,
      duration: 3000,
      icon: React.createElement(CircleCheck, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 将加载转为错误
   * @param toastId - loading toast ID
   * @param message - 错误消息
   */
  const errorFromLoading = (toastId: string | number, message: string) => {
    const errorType = getErrorType(message);
    const config = ERROR_CONFIG[errorType];
    const IconComponent = config.icon;

    toast.error(message, {
      id: toastId,
      duration: config.duration,
      icon: React.createElement(IconComponent, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示需要登录的提示
   * @param action - 操作名称（如"点赞"、"评论"）
   */
  const showLoginRequired = (action?: string) => {
    const message = action ? `请先登录后再${action}` : '请先登录';
    toast.info(message, {
      duration: 3000,
      icon: React.createElement(ShieldAlert, { className: 'w-4 h-4' }),
    });
  };

  return {
    showError,
    showSuccess,
    showLoading,
    dismiss,
    successFromLoading,
    errorFromLoading,
    showLoginRequired,
  };
}
