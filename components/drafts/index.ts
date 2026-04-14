/**
 * Drafts 组件统一导出
 *
 * @module components/drafts
 * @description 草稿管理模块的所有组件统一入口
 *
 * @example
 * // 统一导入
 * import { DraftsClient, DraftCard, DraftsHeader } from '@/components/drafts'
 *
 * // 使用 Hook
 * import { useDrafts } from '@/hooks/drafts/useDrafts'
 */

// Core - 核心容器组件
export { DraftsClient } from './core/DraftsClient'
export { DraftsContent } from './core/DraftsContent'

// Header - 头部组件
export { DraftsHeader } from './header/DraftsHeader'

// Card - 卡片展示组件
export { DraftCard } from './card/DraftCard'
export { DraftCardSkeleton } from './card/DraftCardSkeleton'
export { EmptyState } from './card/EmptyState'

// Filter - 筛选搜索组件
export { FilterChips } from './filter/FilterChips'
export { SearchBox } from './filter/SearchBox'
export { SelectAllCheckbox } from './filter/SelectAllCheckbox'
export type { FilterOption } from './filter/FilterChips'

// Navigation - 导航分页组件
export { Pagination } from './navigation/Pagination'

// Actions - 操作相关组件
export { BatchActionsBar } from './actions/BatchActionsBar'
export { DeleteConfirmModal } from './actions/DeleteConfirmModal'

// Hooks - 从 @/hooks 统一导出
export { useDrafts } from '@/hooks/drafts/useDrafts'
export type { UseDraftsReturn } from '@/types/drafts'
