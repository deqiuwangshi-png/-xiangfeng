/**
 * @fileoverview 发布模块类型定义统一出口
 * @module types/publish
 * @description 编辑器、草稿发布相关的类型定义
 */

// ============================================
// 编辑器类型
// ============================================

export type {
  SaveStatus,
  EditorContentFormat,
  EditorState,
  EditorBaseState,
  TipTapNode,
  TipTapJSON,
  TipTapEditorOptions,
  SaveDraftOptions,
  EditorActionsOptions,
  ValidationResult,
  UseAutoSaveReturn,
  UseEditorStateReturn,
  UseEditorActionsReturn,
} from './editor'

export {
  FULLSCREEN_STORAGE_KEY,
  EMPTY_DOCUMENT,
} from './editor'
