'use client';

import React from 'react';
import { toast } from 'sonner';
import { CircleCheck, CircleAlert, CircleX, Info, WifiOff } from 'lucide-react';

/**
 * Toast 类型定义
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * 文章模块 Toast Hook
 * @description 统一文章相关操作的提示规范
 * @returns Toast 操作方法集合
 */
export function useArticleToast() {
  /**
   * 显示成功提示
   * @param action - 动作名称，如"关注"、"收藏"
   * @param isUndo - 是否为取消操作
   * @param extra - 额外描述信息（可选）
   */
  const showSuccess = (action: string, isUndo = false, extra?: string) => {
    let message = isUndo ? `已取消${action}` : `${action}成功`;
    if (extra) {
      message = `${message}，${extra}`;
    }

    toast.success(message, {
      duration: 3000,
      icon: React.createElement(CircleCheck, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示错误提示
   * @param reason - 错误原因
   * @param guidance - 用户引导（可选）
   */
  const showError = (reason: string, guidance?: string) => {
    const message = guidance ? `${reason}，${guidance}` : reason;

    toast.error(message, {
      duration: 4000,
      icon: React.createElement(CircleX, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示网络错误提示
   * @param guidance - 用户引导（可选，默认"请检查网络连接"）
   */
  const showNetworkError = (guidance = '请检查网络连接') => {
    toast.error(`网络错误，${guidance}`, {
      duration: 4000,
      icon: React.createElement(WifiOff, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示登录 required 错误
   * @param action - 需要登录才能进行的操作描述
   */
  const showAuthRequired = (action: string) => {
    toast.error(`请先登录，登录后即可${action}`, {
      duration: 4000,
      icon: React.createElement(CircleAlert, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示警告提示
   * @param message - 警告内容
   */
  const showWarning = (message: string) => {
    toast.warning(message, {
      duration: 4000,
      icon: React.createElement(CircleAlert, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示信息提示
   * @param message - 信息内容
   * @param description - 详细描述（可选）
   */
  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
      icon: React.createElement(Info, { className: 'w-4 h-4' }),
    });
  };

  /**
   * 显示操作失败提示
   * @param error - 错误信息（可选）
   * @param fallback - 兜底提示（默认"操作失败，请稍后重试"）
   */
  const showOperationFailed = (error?: string, fallback = '操作失败，请稍后重试') => {
    const message = error || fallback;
    showError(message);
  };

  /**
   * 显示删除成功提示
   * @param item - 被删除的项名称（默认"内容"）
   */
  const showDeleteSuccess = (item = '内容') => {
    showSuccess(`删除${item}`);
  };

  /**
   * 显示复制成功提示
   * @param item - 被复制的项名称（默认"链接"）
   */
  const showCopySuccess = (item = '链接') => {
    toast.success(`${item}已复制`, {
      duration: 2000,
      icon: React.createElement(CircleCheck, { className: 'w-4 h-4' }),
    });
  };

  return {
    showSuccess,
    showError,
    showNetworkError,
    showAuthRequired,
    showWarning,
    showInfo,
    showOperationFailed,
    showDeleteSuccess,
    showCopySuccess,
  };
}
