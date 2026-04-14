/**
 * @fileoverview 编辑器类型定义
 * @module types/publish/editor
 */

import { TipTapJSON } from '@/lib/utils/json'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type EditorContentFormat = 'json' | 'html' | 'markdown'

export interface EditorState {
  title: string
  content: string
  draftId: string | null
  isPublished: boolean
  hasUnsavedChanges: boolean
  lastSavedAt: Date | null
  titleLength: number
  contentLength: number
  isFullscreen: boolean
  isPreview: boolean
  isFocusMode: boolean
  isToolbarSticky: boolean
  canUndo: boolean
  canRedo: boolean
}

export interface EditorBaseState {
  title: string
  content: string
  isPublished: boolean
}

export interface UseAutoSaveReturn {
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  errorMessage: string | null
  markUserInteracted: () => void
}

export interface UseEditorStateReturn extends EditorState {
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setDraftId: (draftId: string | null) => void
  setPublished: (isPublished: boolean) => void
  setUnsavedChanges: (hasUnsavedChanges: boolean) => void
  setLastSavedAt: (lastSavedAt: Date | null) => void
  setFullscreen: (value: boolean) => void
  setPreview: (value: boolean) => void
  setFocusMode: (value: boolean) => void
  toggleFullscreen: () => void
  togglePreview: () => void
  toggleFocusMode: () => void
  undo: () => void
  redo: () => void
  reset: () => void
}

export interface EditorConfig {
  placeholder: string
  maxTitleLength: number
  minTitleLength: number
  maxContentLength: number
  minContentLength: number
  autoSaveInterval: number
  enableShortcuts: boolean
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  placeholder: '开始创作...',
  maxTitleLength: 100,
  minTitleLength: 1,
  maxContentLength: 50000,
  minContentLength: 10,
  autoSaveInterval: 30000,
  enableShortcuts: true,
}
