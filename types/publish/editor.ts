/**
 * @fileoverview 编辑器类型定义
 * @module types/publish/editor
 * @description 文章编辑器相关的类型定义，统一管理层编辑器状态、配置和操作类型
 *
 * @统一类型管理 2026-04-06
 * - 从 hooks/publish 迁移至此，避免类型定义分散
 * - 所有编辑器相关类型集中管理
 */

import { TipTapJSON } from '@/lib/utils/json'

// ============================================
// 基础类型
// ============================================

/**
 * 保存状态类型
 * @type SaveStatus
 * @description 自动保存的当前状态
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/**
 * 编辑器内容格式类型
 * @type EditorContentFormat
 * @description 编辑器支持的内容格式
 */
export type EditorContentFormat = 'json' | 'html' | 'markdown'

// ============================================
// 编辑器状态接口
// ============================================

/**
 * 编辑器核心状态接口
 * @interface EditorState
 * @description 编辑器的状态数据，用于 useEditorState Hook
 */
export interface EditorState {
  /** 文章标题 */
  title: string
  /** 文章内容（JSON 字符串） */
  content: string
  /** 标题长度（字符数） */
  titleLength: number
  /** 内容长度（字符数） */
  contentLength: number
  /** 是否全屏模式 */
  isFullscreen: boolean
  /** 工具栏是否折叠 */
  isToolbarCollapsed: boolean
  /** 草稿ID */
  draftId: string | null
  /** 是否正在保存 */
  isSaving: boolean
  /** 是否正在发布 */
  isPublishing: boolean
  /**
   * 文章是否已发布
   * @逻辑说明 true = 已发布文章，不再保存草稿；false = 草稿/未发布，可以保存草稿
   */
  isPublished: boolean
  /** 最后保存时间 */
  lastSavedAt: Date | null
  /** 是否有未保存的变更 */
  hasUnsavedChanges: boolean
}

/**
 * 编辑器基础状态接口（简化版）
 * @interface EditorBaseState
 * @description 用于 useEditorActions 和 useAutoSave 的基础状态
 */
export interface EditorBaseState {
  /** 文章标题 */
  title: string
  /** 文章内容（JSON 字符串） */
  content: string
  /** 草稿ID */
  draftId: string | null
  /** 是否已发布 */
  isPublished: boolean
}

// ============================================
// TipTap 编辑器类型
// ============================================

/**
 * TipTap JSON 节点类型
 * @interface TipTapNode
 * @description TipTap 编辑器的节点结构
 * @注意 从 lib/utils/json 重新导出，保持单一数据源
 */
export type { TipTapNode, TipTapJSON } from '@/lib/utils/json'



/**
 * TipTap 编辑器配置选项
 * @interface TipTapEditorOptions
 * @description useTipTapEditor Hook 的配置选项
 */
export interface TipTapEditorOptions {
  /** 初始内容 (JSON 字符串) */
  content: string
  /** 内容变化回调 (返回 JSON 字符串) */
  onChange: (content: string) => void
  /** 占位符文本 */
  placeholder?: string
}

// ============================================
// 编辑器操作类型
// ============================================

/**
 * 保存草稿选项
 * @interface SaveDraftOptions
 * @description saveDraft 方法的选项
 */
export interface SaveDraftOptions {
  /** 是否静默保存（不显示提示） */
  silent?: boolean
  /** 是否跳过验证 */
  skipValidation?: boolean
}

/**
 * 编辑器操作选项
 * @interface EditorActionsOptions
 * @description useEditorActions Hook 的配置选项
 */
export interface EditorActionsOptions {
  /** 保存成功回调 */
  onSaveSuccess?: () => void
  /** 发布成功回调 */
  onPublishSuccess?: (articleId: string) => void
}

/**
 * 验证结果接口
 * @interface ValidationResult
 * @description 内容验证结果
 */
export interface ValidationResult {
  /** 是否通过验证 */
  valid: boolean
  /** 错误信息 */
  error?: string
}

// ============================================
// 自动保存相关类型
// ============================================

/**
 * 自动保存 Hook 返回值
 * @interface UseAutoSaveReturn
 * @description useAutoSave Hook 的返回值
 */
export interface UseAutoSaveReturn {
  /** 当前保存状态 */
  saveStatus: SaveStatus
  /** 上次保存时间 */
  lastSavedAt: Date | null
  /** 错误信息 */
  errorMessage: string | null
  /** 手动触发保存 */
  triggerSave: () => Promise<void>
  /** 重置保存状态 */
  resetStatus: () => void
  /** 标记用户已交互 */
  markUserInteracted: () => void
}

// ============================================
// 编辑器状态 Hook 返回值
// ============================================

/**
 * 编辑器状态 Hook 返回值
 * @interface UseEditorStateReturn
 * @description useEditorState Hook 的返回值
 */
export interface UseEditorStateReturn {
  /** 编辑器状态 */
  editorState: EditorState
  /** 更新标题 */
  updateTitle: (title: string) => void
  /** 更新内容 */
  updateContent: (content: string) => void
  /** 切换全屏模式 */
  toggleFullscreen: () => void
  /** 切换工具栏 */
  toggleToolbar: () => void
  /** 标记已保存 */
  markSaved: () => void
  /** 设置保存中状态 */
  setSaving: (isSaving: boolean) => void
  /** 设置发布中状态 */
  setPublishing: (isPublishing: boolean) => void
  /** 验证内容是否可保存 */
  validateForSave: () => ValidationResult
  /** 验证内容是否可发布 */
  validateForPublish: () => ValidationResult
  /** 设置编辑器状态（完整控制） */
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
}

/**
 * 编辑器操作 Hook 返回值
 * @interface UseEditorActionsReturn
 * @description useEditorActions Hook 的返回值
 */
export interface UseEditorActionsReturn {
  /** 保存草稿 */
  saveDraft: (options?: SaveDraftOptions) => Promise<void>
  /** 发布文章 */
  publishContent: () => Promise<void>
  /** 是否正在保存 */
  isSaving: boolean
  /** 是否正在发布 */
  isPublishing: boolean
  /** 验证内容 */
  validateContent: () => ValidationResult
}

// ============================================
// 常量定义
// ============================================

/**
 * localStorage Key for fullscreen mode
 * @constant FULLSCREEN_STORAGE_KEY
 */
export const FULLSCREEN_STORAGE_KEY = 'editor/fullscreen'

/**
 * 默认空文档
 * @constant EMPTY_DOCUMENT
 */
export const EMPTY_DOCUMENT: TipTapJSON = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}
