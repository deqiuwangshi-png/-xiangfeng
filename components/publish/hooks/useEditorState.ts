'use client'

import { useState } from 'react'

export interface EditorState {
  title: string
  content: string
  titleLength: number
  contentLength: number
  isFullscreen: boolean
  isToolbarCollapsed: boolean
}

export const useEditorState = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    title: '',
    content: '',
    titleLength: 0,
    contentLength: 0,
    isFullscreen: false,
    isToolbarCollapsed: false,
  })

  const updateTitle = (title: string) => {
    setEditorState(prev => ({ ...prev, title, titleLength: title.length }))
  }

  const updateContent = (content: string) => {
    setEditorState(prev => ({ ...prev, content, contentLength: content.length }))
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
