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
