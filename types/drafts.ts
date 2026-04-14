/**
 * @fileoverview 草稿模块类型定义
 * @module types/drafts
 * @description 草稿管理相关的数据类型、Hook 返回值类型
 *
 * @统一类型管理 2026-04-06
 * - 从 hooks/drafts 迁移至此，避免类型定义分散
 * - 所有草稿相关类型集中管理
 */

// ============================================
// 基础类型
// ============================================

/**
 * 草稿状态类型
 * @type DraftStatus
 * @description 文章的草稿状态
 */
export type DraftStatus = 'draft' | 'published' | 'archived'

/**
 * 草稿数据接口
 * @interface DraftData
 * @description 草稿列表展示的数据结构
 */
export interface DraftData {
  /** 草稿ID */
  id: string
  /** 标题 */
  title: string
  /** 摘要 */
  summary: string
  /** 状态 */
  status: DraftStatus
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 草稿筛选器类型
 * @type DraftFilter
 * @description 草稿列表的筛选条件
 */
export type DraftFilter = DraftStatus | 'all'

/**
 * 草稿操作类型
 * @type DraftAction
 * @description 可对草稿执行的操作
 */
export type DraftAction = 'delete' | 'publish' | 'archive' | 'edit'

/**
 * 视图模式类型
 * @type ViewMode
 * @description 草稿列表的展示模式
 */
export type ViewMode = 'grid' | 'list'

/**
 * 草稿选择状态
 * @interface DraftSelection
 * @description 批量选择草稿的状态
 */
export interface DraftSelection {
  /** 已选择的草稿ID集合 */
  selectedIds: Set<string>
  /** 是否全选 */
  isAllSelected: boolean
  /** 是否部分选择 */
  isPartiallySelected: boolean
}

/**
 * 删除模式类型
 * @type DeleteMode
 * @description 删除确认弹窗的三种模式：单篇删除、批量删除、清空所有
 */
export type DeleteMode = 'single' | 'batch' | 'clear'

/**
 * 删除弹窗状态
 * @interface DeleteModalState
 * @description 管理删除确认弹窗的显示状态和操作目标
 */
export interface DeleteModalState {
  /** 弹窗是否打开 */
  isOpen: boolean
  /** 删除模式 */
  mode: DeleteMode
  /** 目标草稿ID */
  targetId?: string
  /** 目标草稿名称 */
  targetName?: string
}

// ============================================
// Toast 提示相关类型
// ============================================

/**
 * Toast 提示配置选项
 * @interface ToastOptions
 * @description 控制 toast 提示的显示行为
 */
export interface ToastOptions {
  /** 是否显示 toast，默认为 true */
  enabled?: boolean
  /** 自定义消息内容 */
  message?: string
}

/**
 * 批量操作结果
 * @interface BatchResult
 * @description 批量操作的执行结果统计
 */
export interface BatchResult {
  /** 成功数量 */
  successCount: number
  /** 失败数量 */
  failedCount: number
}

/**
 * 草稿管理 Toast Hook 返回值
 * @interface UseDraftsToastReturn
 * @description useDraftsToast Hook 提供的所有 toast 提示方法
 */
export interface UseDraftsToastReturn {
  // ========== 删除操作提示 ==========
  /** 删除成功 */
  showDeleteSuccess: (options?: ToastOptions) => void
  /** 删除失败 */
  showDeleteError: (error?: Error | string) => void
  /** 批量删除部分成功 */
  showBatchDeletePartialSuccess: (successCount: number, failedCount: number) => void

  // ========== 发布操作提示 ==========
  /** 发布成功 */
  showPublishSuccess: (options?: ToastOptions) => void
  /** 发布失败 */
  showPublishError: (error?: Error | string) => void

  // ========== 归档操作提示 ==========
  /** 归档成功 */
  showArchiveSuccess: (options?: ToastOptions) => void
  /** 归档失败 */
  showArchiveError: (error?: Error | string) => void

  // ========== 批量操作提示 ==========
  /** 批量操作全部成功 */
  showBatchSuccess: (successMessage: string, count?: number) => void
  /** 批量操作全部失败 */
  showBatchAllFailed: () => void
  /** 批量操作部分成功 */
  showBatchPartialSuccess: (successCount: number, failedCount: number) => void

  // ========== 清空操作提示 ==========
  /** 没有可清空的草稿 */
  showNoDraftsToClear: () => void

  // ========== 通用方法 ==========
  /** 显示成功提示 */
  success: (message: string) => void
  /** 显示错误提示 */
  error: (message: string) => void
  /** 显示警告提示 */
  warning: (message: string) => void
  /** 显示信息提示 */
  info: (message: string) => void
}

// ============================================
// useDrafts Hook 相关类型
// ============================================

/**
 * useDrafts Hook 返回值
 * @interface UseDraftsReturn
 * @description useDrafts Hook 提供的所有状态和方法
 */
export interface UseDraftsReturn {
  // ========== 数据状态 ==========
  /** 所有草稿列表 */
  drafts: DraftData[]
  /** 筛选后的草稿列表 */
  filteredDrafts: DraftData[]
  /** 当前页的草稿列表 */
  paginatedDrafts: DraftData[]
  /** 总页数 */
  totalPages: number

  // ========== 选择状态 ==========
  /** 已选择的草稿ID集合 */
  selectedIds: Set<string>
  /** 选择状态对象 */
  selection: DraftSelection

  // ========== 筛选和分页状态 ==========
  /** 当前筛选条件 */
  activeFilter: DraftFilter
  /** 搜索关键词 */
  searchQuery: string
  /** 当前页码 */
  currentPage: number
  /** 视图模式 */
  viewMode: ViewMode
  /** 是否加载中 */
  isLoading: boolean

  // ========== 状态设置方法 ==========
  /** 设置筛选条件 */
  setActiveFilter: (filter: DraftFilter) => void
  /** 设置搜索关键词 */
  setSearchQuery: (query: string) => void
  /** 设置当前页码 */
  setCurrentPage: (page: number) => void
  /** 设置视图模式 */
  setViewMode: (mode: ViewMode) => void

  // ========== 选择操作方法 ==========
  /** 选择/取消选择单个草稿 */
  handleSelectDraft: (id: string) => void
  /** 全选/取消全选 */
  handleSelectAll: () => void

  // ========== 草稿操作方法 ==========
  /** 编辑草稿 */
  handleEditDraft: (id: string) => void
  /** 执行删除草稿 */
  executeDeleteDrafts: (ids: string[], shouldRefresh?: boolean) => Promise<void>
  /** 批量发布 */
  handleBatchPublish: () => Promise<void>
  /** 批量归档 */
  handleBatchArchive: () => Promise<void>
  /** 取消选择 */
  handleCancelSelection: () => void
  /** 清空所有草稿 */
  handleClearAllDrafts: () => Promise<void>
}
