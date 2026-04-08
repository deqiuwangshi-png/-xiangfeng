'use client'

/**
 * @fileoverview 编辑器状态管理 Hook
 * @module hooks/publish/useEditorState
 * @description 管理编辑器的状态，包括标题、内容、保存状态等
 */

import { useState, useCallback } from 'react'
import { extractTextFromJSON } from '@/lib/utils/json'
import type { EditorState } from '@/types/publish/editor'
import { FULLSCREEN_STORAGE_KEY } from '@/types/publish/editor'

/**
 * 获取内容长度（字符数）
 */
function getContentLength(jsonString: string): number {
  return extractTextFromJSON(jsonString).length
}

/**
 * 从 localStorage 获取专注模式初始状态
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
   * 切换专注模式
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
   * 设置保存中状态
   */
  const setSaving = useCallback((isSaving: boolean) => {
    setEditorState(prev => ({ ...prev, isSaving }))
  }, [])

  /**
   * 设置发布中状态
   */
  const setPublishing = useCallback((isPublishing: boolean) => {
    setEditorState(prev => ({ ...prev, isPublishing }))
  }, [])

  return {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    markSaved,
    setSaving,
    setPublishing,
    setEditorState,
  }
}

// 重新导出 isContentEmpty 以便向后兼容
export { isContentEmpty } from '@/lib/utils/json'
