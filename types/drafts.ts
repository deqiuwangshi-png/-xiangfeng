/**
 * 草稿状态类型
 */
export type DraftStatus = 'draft' | 'published' | 'archived'

/**
 * 草稿数据接口
 */
export interface DraftData {
  id: string
  title: string
  summary: string
  status: DraftStatus
  createdAt: string
  updatedAt: string
}

/**
 * 草稿筛选器类型
 */
export type DraftFilter = DraftStatus | 'all'

/**
 * 草稿操作类型
 */
export type DraftAction = 'delete' | 'publish' | 'archive' | 'edit'

/**
 * 视图模式类型
 */
export type ViewMode = 'grid' | 'list'

/**
 * 草稿选择状态
 */
export interface DraftSelection {
  selectedIds: Set<string>
  isAllSelected: boolean
  isPartiallySelected: boolean
}

/**
 * 删除模式类型
 * @description 删除确认弹窗的三种模式：单篇删除、批量删除、清空所有
 */
export type DeleteMode = 'single' | 'batch' | 'clear'

/**
 * 删除弹窗状态
 * @description 管理删除确认弹窗的显示状态和操作目标
 */
export interface DeleteModalState {
  isOpen: boolean
  mode: DeleteMode
  targetId?: string
  targetName?: string
}
