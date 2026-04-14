'use client'

/**
 * @fileoverview 编辑器状态管理 Hook
 * @module hooks/publish/useEditorState
 */

import { useState, useCallback } from 'react'
import { extractTextFromJSON } from '@/lib/utils/json'
import type { EditorState, UseEditorStateReturn } from '@/types/publish/editor'

const FULLSCREEN_STORAGE_KEY = 'editor:fullscreen'

function getContentLength(jsonString: string): number {
  return extractTextFromJSON(jsonString).length
}

const getInitialFullscreen = (): boolean => {
  try {
    const savedFullscreen = localStorage.getItem(FULLSCREEN_STORAGE_KEY)
    return savedFullscreen === 'true'
  } catch {
    return false
  }
}

export const useEditorState = (
  initialTitle: string = '',
  initialContent: string = '',
  initialDraftId: string | null = null,
  initialPublished: boolean = false
): UseEditorStateReturn => {
  const [state, setState] = useState<EditorState>({
    title: initialTitle,
    content: initialContent,
    draftId: initialDraftId,
    isPublished: initialPublished,
    hasUnsavedChanges: false,
    lastSavedAt: null,
    titleLength: initialTitle.length,
    contentLength: getContentLength(initialContent),
    isFullscreen: getInitialFullscreen(),
    isPreview: false,
    isFocusMode: false,
    isToolbarSticky: true,
    canUndo: false,
    canRedo: false,
  })

  const setTitle = useCallback((title: string) => {
    setState(prev => ({
      ...prev,
      title,
      titleLength: title.length,
    }))
  }, [])

  const setContent = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      content,
      contentLength: getContentLength(content),
    }))
  }, [])

  const setDraftId = useCallback((draftId: string | null) => {
    setState(prev => ({ ...prev, draftId }))
  }, [])

  const setPublished = useCallback((isPublished: boolean) => {
    setState(prev => ({ ...prev, isPublished }))
  }, [])

  const setUnsavedChanges = useCallback((hasUnsavedChanges: boolean) => {
    setState(prev => ({ ...prev, hasUnsavedChanges }))
  }, [])

  const setLastSavedAt = useCallback((lastSavedAt: Date | null) => {
    setState(prev => ({ ...prev, lastSavedAt }))
  }, [])

  const setFullscreen = useCallback((value: boolean) => {
    setState(prev => {
      try {
        localStorage.setItem(FULLSCREEN_STORAGE_KEY, String(value))
      } catch {}
      return { ...prev, isFullscreen: value }
    })
  }, [])

  const setPreview = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isPreview: value }))
  }, [])

  const setFocusMode = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isFocusMode: value }))
  }, [])

  const toggleFullscreen = useCallback(() => {
    setFullscreen(!state.isFullscreen)
  }, [state.isFullscreen, setFullscreen])

  const togglePreview = useCallback(() => {
    setPreview(!state.isPreview)
  }, [state.isPreview, setPreview])

  const toggleFocusMode = useCallback(() => {
    setFocusMode(!state.isFocusMode)
  }, [state.isFocusMode, setFocusMode])

  const undo = useCallback(() => {
    // 实现撤销逻辑
  }, [])

  const redo = useCallback(() => {
    // 实现重做逻辑
  }, [])

  const reset = useCallback(() => {
    setState({
      title: '',
      content: '',
      draftId: null,
      isPublished: false,
      hasUnsavedChanges: false,
      lastSavedAt: null,
      titleLength: 0,
      contentLength: 0,
      isFullscreen: getInitialFullscreen(),
      isPreview: false,
      isFocusMode: false,
      isToolbarSticky: true,
      canUndo: false,
      canRedo: false,
    })
  }, [])

  return {
    ...state,
    setTitle,
    setContent,
    setDraftId,
    setPublished,
    setUnsavedChanges,
    setLastSavedAt,
    setFullscreen,
    setPreview,
    setFocusMode,
    toggleFullscreen,
    togglePreview,
    toggleFocusMode,
    undo,
    redo,
    reset,
  }
}

export { isContentEmpty } from '@/lib/utils/json'
