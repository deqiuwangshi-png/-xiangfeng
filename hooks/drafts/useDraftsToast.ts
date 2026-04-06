'use client'

/**
 * @fileoverview 草稿管理提示 Hook
 * @module hooks/drafts/useDraftsToast
 * @description 统一封装草稿管理相关的 toast 提示，避免重复定义和分散管理
 * 支持删除、发布、归档等各类批量操作的提示
 *
 * @类型依赖
 * - 类型定义位于: types/drafts.ts
 * - 导入: ToastOptions, UseDraftsToastReturn
 *
 * @example
 * ```typescript
 * const { showDeleteSuccess, showBatchPartialSuccess, showNoDraftsToClear } = useDraftsToast()
 * showDeleteSuccess() // 显示删除成功提示
 * ```
 */

import { toast } from 'sonner'
import { useCallback } from 'react'
import type { ToastOptions, UseDraftsToastReturn } from '@/types/drafts'

/**
 * 草稿管理 Toast 提示 Hook
 *
 * @returns 各类 toast 提示方法
 */
export function useDraftsToast(): UseDraftsToastReturn {
  // ========== 删除操作提示 ==========

  /**
   * 删除成功提示
   *
   * @param options - 提示配置选项
   */
  const showDeleteSuccess = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '删除成功' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 删除失败提示
   *
   * @param error - 错误对象或错误消息
   */
  const showDeleteError = useCallback((error?: Error | string) => {
    const message = error instanceof Error ? error.message : error || '删除失败'
    toast.error(message)
  }, [])

  /**
   * 批量删除部分成功提示
   *
   * @param successCount - 成功数量
   * @param failedCount - 失败数量
   */
  const showBatchDeletePartialSuccess = useCallback((successCount: number, failedCount: number) => {
    toast.warning(`成功删除 ${successCount} 篇，${failedCount} 篇删除失败`)
  }, [])

  // ========== 发布操作提示 ==========

  /**
   * 发布成功提示
   *
   * @param options - 提示配置选项
   */
  const showPublishSuccess = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '发布成功' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 发布失败提示
   *
   * @param error - 错误对象或错误消息
   */
  const showPublishError = useCallback((error?: Error | string) => {
    const message = error instanceof Error ? error.message : error || '发布失败'
    toast.error(message)
  }, [])

  // ========== 归档操作提示 ==========

  /**
   * 归档成功提示
   *
   * @param options - 提示配置选项
   */
  const showArchiveSuccess = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '归档成功' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 归档失败提示
   *
   * @param error - 错误对象或错误消息
   */
  const showArchiveError = useCallback((error?: Error | string) => {
    const message = error instanceof Error ? error.message : error || '归档失败'
    toast.error(message)
  }, [])

  // ========== 批量操作提示 ==========

  /**
   * 批量操作全部成功提示
   *
   * @param successMessage - 成功消息
   * @param count - 成功数量（可选）
   */
  const showBatchSuccess = useCallback((successMessage: string, count?: number) => {
    const message = count !== undefined ? `${successMessage} ${count} 篇` : successMessage
    toast.success(message)
  }, [])

  /**
   * 批量操作全部失败提示
   */
  const showBatchAllFailed = useCallback(() => {
    toast.error('所有操作失败，请重试')
  }, [])

  /**
   * 批量操作部分成功提示
   *
   * @param successCount - 成功数量
   * @param failedCount - 失败数量
   */
  const showBatchPartialSuccess = useCallback((successCount: number, failedCount: number) => {
    toast.warning(`成功 ${successCount} 篇，失败 ${failedCount} 篇`)
  }, [])

  // ========== 清空操作提示 ==========

  /**
   * 没有可清空的草稿提示
   */
  const showNoDraftsToClear = useCallback(() => {
    toast.info('没有可清空的草稿')
  }, [])

  // ========== 通用方法 ==========

  /**
   * 通用成功提示
   *
   * @param message - 提示消息
   */
  const success = useCallback((message: string) => {
    toast.success(message)
  }, [])

  /**
   * 通用错误提示
   *
   * @param message - 提示消息
   */
  const error = useCallback((message: string) => {
    toast.error(message)
  }, [])

  /**
   * 通用警告提示
   *
   * @param message - 提示消息
   */
  const warning = useCallback((message: string) => {
    toast.warning(message)
  }, [])

  /**
   * 通用信息提示
   *
   * @param message - 提示消息
   */
  const info = useCallback((message: string) => {
    toast.info(message)
  }, [])

  return {
    // 删除操作提示
    showDeleteSuccess,
    showDeleteError,
    showBatchDeletePartialSuccess,

    // 发布操作提示
    showPublishSuccess,
    showPublishError,

    // 归档操作提示
    showArchiveSuccess,
    showArchiveError,

    // 批量操作提示
    showBatchSuccess,
    showBatchAllFailed,
    showBatchPartialSuccess,

    // 清空操作提示
    showNoDraftsToClear,

    // 通用方法
    success,
    error,
    warning,
    info,
  }
}

// 重新导出类型以便向后兼容
export type { ToastOptions, UseDraftsToastReturn }
