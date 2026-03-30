'use client'

/**
 * 编辑器提示 Hook
 *
 * 统一封装编辑器相关的 toast 提示，避免重复定义和分散管理
 * 支持草稿保存、发布、验证等各类场景的提示
 *
 * @module useEditorToast
 * @example
 * ```typescript
 * const { showDraftSaved, showPublished, showValidationError } = useEditorToast()
 * showDraftSaved() // 显示草稿保存成功提示
 * ```
 */

import { toast } from 'sonner'
import { useCallback } from 'react'

/**
 * Toast 提示配置选项
 */
interface ToastOptions {
  /** 是否显示 toast，默认为 true */
  enabled?: boolean
  /** 自定义消息内容 */
  message?: string
}

/**
 * 编辑器 Toast Hook 返回值
 */
interface UseEditorToastReturn {
  // ========== 成功提示 ==========
  /** 草稿保存成功 */
  showDraftSaved: (options?: ToastOptions) => void
  /** 草稿更新成功 */
  showDraftUpdated: (options?: ToastOptions) => void
  /** 文章发布成功 */
  showPublished: (options?: ToastOptions) => void

  // ========== 验证错误提示 ==========
  /** 标题为空 */
  showTitleRequired: (focusTitle?: () => void) => void
  /** 内容为空 */
  showContentRequired: () => void

  // ========== 操作错误提示 ==========
  /** 保存失败 */
  showSaveError: (error?: Error | string) => void
  /** 发布失败 */
  showPublishError: (error?: Error | string) => void
  /** 状态更新失败 */
  showStatusError: () => void

  // ========== 媒体上传提示 ==========
  /** 图片上传成功 */
  showImageUploadSuccess: (options?: ToastOptions) => void
  /** 图片上传失败 */
  showImageUploadError: (error?: Error | string) => void

  // ========== 通用方法 ==========
  /** 显示成功提示 */
  success: (message: string) => void
  /** 显示错误提示 */
  error: (message: string) => void
  /** 显示警告提示 */
  warning: (message: string) => void
}

/**
 * 编辑器 Toast 提示 Hook
 *
 * @returns 各类 toast 提示方法
 */
export function useEditorToast(): UseEditorToastReturn {
  /**
   * 草稿保存成功提示
   *
   * @param options - 提示配置选项
   */
  const showDraftSaved = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '草稿保存成功' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 草稿更新成功提示
   *
   * @param options - 提示配置选项
   */
  const showDraftUpdated = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '草稿更新成功' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 文章发布成功提示
   *
   * @param options - 提示配置选项
   */
  const showPublished = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '发布成功！' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 标题必填验证提示
   *
   * @param focusTitle - 聚焦标题输入框的回调函数
   */
  const showTitleRequired = useCallback((focusTitle?: () => void) => {
    toast.error('请输入标题')
    focusTitle?.()
  }, [])

  /**
   * 内容必填验证提示
   */
  const showContentRequired = useCallback(() => {
    toast.error('请输入文章内容')
  }, [])

  /**
   * 保存失败提示
   *
   * @param error - 错误对象或错误消息
   */
  const showSaveError = useCallback((error?: Error | string) => {
    const message = error instanceof Error ? error.message : error || '保存失败'
    toast.error(message)
  }, [])

  /**
   * 发布失败提示
   *
   * @param error - 错误对象或错误消息
   */
  const showPublishError = useCallback((error?: Error | string) => {
    const message = error instanceof Error ? error.message : error || '发布失败，请重试'
    toast.error(message)
  }, [])

  /**
   * 状态更新失败提示
   */
  const showStatusError = useCallback(() => {
    toast.error('文章状态更新失败，请重试')
  }, [])

  /**
   * 图片上传成功提示
   *
   * @param options - 提示配置选项
   */
  const showImageUploadSuccess = useCallback((options?: ToastOptions) => {
    const { enabled = true, message = '图片上传成功' } = options || {}
    if (enabled) {
      toast.success(message)
    }
  }, [])

  /**
   * 图片上传失败提示
   *
   * @param error - 错误对象或错误消息
   */
  const showImageUploadError = useCallback((error?: Error | string) => {
    const message = error instanceof Error ? error.message : error || '图片上传失败'
    toast.error(message)
  }, [])

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

  return {
    // 成功提示
    showDraftSaved,
    showDraftUpdated,
    showPublished,

    // 验证错误提示
    showTitleRequired,
    showContentRequired,

    // 操作错误提示
    showSaveError,
    showPublishError,
    showStatusError,

    // 媒体上传提示
    showImageUploadSuccess,
    showImageUploadError,

    // 通用方法
    success,
    error,
    warning,
  }
}

export type { ToastOptions, UseEditorToastReturn }
