'use client'

/**
 * @fileoverview 编辑器状态管理 Hook
 * @module hooks/publish/useEditorState
 * @description 管理编辑器的状态，包括标题、内容、保存状态等
 *
 * @类型依赖
 * - 类型定义位于: types/publish/editor.ts
 * - 导入: EditorState, ValidationResult, FULLSCREEN_STORAGE_KEY
 */

import { useState, useCallback } from 'react'
import { extractTextFromJSON, isContentEmpty } from '@/lib/utils/json'
import type { EditorState, ValidationResult } from '@/types/publish/editor'
import { FULLSCREEN_STORAGE_KEY } from '@/types/publish/editor'

// 重新导出 isContentEmpty 以便向后兼容
export { isContentEmpty }

/**
 * 获取内容长度（字符数）
 * @param jsonString - JSON 字符串
 * @returns 字符数
 */
function getContentLength(jsonString: string): number {
  return extractTextFromJSON(jsonString).length
}

/**
 * 从 localStorage 获取专注模式初始状态
 * @returns {boolean} 是否启用专注模式
 */
const getInitialFullscreen = (): boolean => {
  try {
    const savedFullscreen = localStorage.getItem(FULLSCREEN_STORAGE_KEY)
    return savedFullscreen === 'true'
  } catch {
    return false
  }
}

/**
 * 编辑器状态管理 Hook
 *
 * @param initialTitle - 初始标题
 * @param initialContent - 初始内容（JSON 字符串）
 * @param initialDraftId - 初始草稿ID
 * @param initialIsPublished - 初始发布状态
 * @returns 编辑器状态和方法
 */
export const useEditorState = (
  initialTitle: string = '',
  initialContent: string = '',
  initialDraftId: string | null = null,
  initialIsPublished: boolean = false
) => {
  const [editorState, setEditorState] = useState<EditorState>({
    title: initialTitle,
    content: initialContent,
    titleLength: initialTitle.length,
    contentLength: getContentLength(initialContent),
    isFullscreen: getInitialFullscreen(),
    isToolbarCollapsed: false,
    draftId: initialDraftId,
    isSaving: false,
    isPublishing: false,
    isPublished: initialIsPublished,
    lastSavedAt: null,
    hasUnsavedChanges: false,
  })

  /**
   * 更新标题
   * @性能优化 使用 useCallback 避免每次渲染创建新函数引用
   */
  const updateTitle = useCallback((title: string) => {
    setEditorState(prev => ({
      ...prev,
      title,
      titleLength: title.length,
      hasUnsavedChanges: true,
    }))
  }, [])

  /**
   * 更新内容
   * @性能优化 使用 useCallback 避免每次渲染创建新函数引用
   */
  const updateContent = useCallback((content: string) => {
    setEditorState(prev => ({
      ...prev,
      content,
      contentLength: getContentLength(content),
      hasUnsavedChanges: true,
    }))
  }, [])

  /**
   * 切换专注模式并持久化到 localStorage
   */
  const toggleFullscreen = useCallback(() => {
    setEditorState(prev => {
      const newFullscreen = !prev.isFullscreen
      try {
        localStorage.setItem(FULLSCREEN_STORAGE_KEY, String(newFullscreen))
      } catch {
        // localStorage 不可用时的静默处理
      }
      return { ...prev, isFullscreen: newFullscreen }
    })
  }, [])

  /**
   * 切换工具栏折叠状态
   * @性能优化 使用 useCallback 避免每次渲染创建新函数引用
   */
  const toggleToolbar = useCallback(() => {
    setEditorState(prev => ({ ...prev, isToolbarCollapsed: !prev.isToolbarCollapsed }))
  }, [])

  /**
   * 标记保存成功
   */
  const markSaved = useCallback(() => {
    setEditorState(prev => ({
      ...prev,
      hasUnsavedChanges: false,
      lastSavedAt: new Date(),
    }))
  }, [])

  /**
   * 标记保存中状态
   */
  const setSaving = useCallback((isSaving: boolean) => {
    setEditorState(prev => ({ ...prev, isSaving }))
  }, [])

  /**
   * 标记发布中状态
   */
  const setPublishing = useCallback((isPublishing: boolean) => {
    setEditorState(prev => ({ ...prev, isPublishing }))
  }, [])

  /**
   * 验证内容是否可保存
   * @returns 验证结果和错误信息
   */
  const validateForSave = useCallback((): ValidationResult => {
    // 标题验证
    const trimmedTitle = editorState.title.trim()
    if (!trimmedTitle) {
      return { valid: false, error: '标题不能为空' }
    }

    if (trimmedTitle.length > 100) {
      return { valid: false, error: '标题不能超过100个字符' }
    }

    // 内容验证 - 检查是否为空
    if (isContentEmpty(editorState.content)) {
      return { valid: false, error: '内容不能为空' }
    }

    // 内容长度验证
    if (editorState.contentLength > 50000) {
      return { valid: false, error: '内容不能超过50000个字符' }
    }

    return { valid: true }
  }, [editorState.title, editorState.content, editorState.contentLength])

  /**
   * 验证内容是否可发布
   * 发布时验证更严格
   */
  const validateForPublish = useCallback((): ValidationResult => {
    // 复用保存验证
    const saveValidation = validateForSave()
    if (!saveValidation.valid) {
      return saveValidation
    }

    // 发布时额外验证：内容不能太短
    if (editorState.contentLength < 10) {
      return { valid: false, error: '发布内容不能少于10个字符' }
    }

    return { valid: true }
  }, [validateForSave, editorState.contentLength])

  return {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    markSaved,
    setSaving,
    setPublishing,
    validateForSave,
    validateForPublish,
    setEditorState,
  }
}
