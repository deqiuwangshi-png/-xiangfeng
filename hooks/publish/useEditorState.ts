'use client'

import { useState, useCallback } from 'react'

export interface EditorState {
  title: string
  content: string
  titleLength: number
  contentLength: number
  isFullscreen: boolean
  isToolbarCollapsed: boolean
  draftId: string | null
  isSaving: boolean
  isPublishing: boolean
}

/** localStorage Key for fullscreen mode */
const FULLSCREEN_STORAGE_KEY = 'editor/fullscreen'

const getTextLength = (html: string): number => {
  if (!html) return 0
  const withoutTags = html.replace(/<[^>]*>/g, '')
  const withoutEntities = withoutTags.replace(/&nbsp;|&#160;/g, ' ')
  return withoutEntities.trim().length
}

/**
 * 从 localStorage 获取专注模式初始状态
 *
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
 * @param initialContent - 初始内容
 * @param initialDraftId - 初始草稿ID
 * @returns 编辑器状态和方法
 */
export const useEditorState = (initialTitle: string = '', initialContent: string = '', initialDraftId: string | null = null) => {
  const [editorState, setEditorState] = useState<EditorState>({
    title: initialTitle,
    content: initialContent,
    titleLength: initialTitle.length,
    contentLength: getTextLength(initialContent),
    isFullscreen: getInitialFullscreen(),
    isToolbarCollapsed: false,
    draftId: initialDraftId,
    isSaving: false,
    isPublishing: false,
  })

  /**
   * 更新标题
   * @性能优化 使用 useCallback 避免每次渲染创建新函数引用
   */
  const updateTitle = useCallback((title: string) => {
    setEditorState(prev => ({ ...prev, title, titleLength: title.length }))
  }, [])

  /**
   * 更新内容
   * @性能优化 使用 useCallback 避免每次渲染创建新函数引用
   */
  const updateContent = useCallback((content: string) => {
    setEditorState(prev => ({
      ...prev,
      content,
      contentLength: getTextLength(content),
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

  return {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    setEditorState,
  }
}
