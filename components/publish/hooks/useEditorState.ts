'use client'

import { useState } from 'react'

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

const getTextLength = (html: string): number => {
  if (!html) return 0
  const withoutTags = html.replace(/<[^>]*>/g, '')
  const withoutEntities = withoutTags.replace(/&nbsp;|&#160;/g, ' ')
  return withoutEntities.trim().length
}

/**
 * 编辑器状态管理 Hook
 * 
 * @param initialTitle 
 * @param initialContent 
 * @returns
 */
export const useEditorState = (initialTitle: string = '', initialContent: string = '', initialDraftId: string | null = null) => {
  const [editorState, setEditorState] = useState<EditorState>({
    title: initialTitle,
    content: initialContent,
    titleLength: initialTitle.length,
    contentLength: getTextLength(initialContent),
    isFullscreen: false,
    isToolbarCollapsed: false,
    draftId: initialDraftId,
    isSaving: false,
    isPublishing: false,
  })

  const updateTitle = (title: string) => {
    setEditorState(prev => ({ ...prev, title, titleLength: title.length }))
  }

  const updateContent = (content: string) => {
    setEditorState(prev => ({
      ...prev,
      content,
      contentLength: getTextLength(content),
    }))
  }

  const toggleFullscreen = () => {
    setEditorState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }))
  }

  const toggleToolbar = () => {
    setEditorState(prev => ({ ...prev, isToolbarCollapsed: !prev.isToolbarCollapsed }))
  }

  return {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    setEditorState,
  }
}
