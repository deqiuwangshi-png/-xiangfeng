'use client'


// 类型导入
import type { DraftData, DraftFilter, DraftSelection, ViewMode } from '@/types/drafts'
import type { FilterOption } from '../filter/FilterChips'

// 卡片相关
import { DraftCard } from '../card/DraftCard'
import { EmptyState } from '../card/EmptyState'

// 筛选相关
import { FilterChips } from '../filter/FilterChips'
import { SearchBox } from '../filter/SearchBox'
import { SelectAllCheckbox } from '../filter/SelectAllCheckbox'

// 导航相关
import { Pagination } from '../navigation/Pagination'

/**
 * DraftsContent Props 接口
 */
interface DraftsContentProps {
  /** 筛选选项 */
  filterOptions: FilterOption[]
  /** 当前激活的筛选器 */
  activeFilter: DraftFilter
  /** 筛选变化回调 */
  onFilterChange: (filter: DraftFilter) => void
  /** 搜索框占位文本 */
  searchPlaceholder: string
  /** 搜索回调 */
  onSearch: (query: string) => void
  /** 选中的文章ID集合 */
  selectedIds: Set<string>
  /** 当前页文章列表 */
  paginatedDrafts: DraftData[]
  /** 选择状态 */
  selection: DraftSelection
  /** 视图模式 */
  viewMode: ViewMode
  /** 选择文章回调 */
  onSelectDraft: (id: string) => void
  /** 全选/取消全选回调 */
  onSelectAll: () => void
  /** 编辑文章回调 */
  onEditDraft: (id: string) => void
  /** 删除文章回调 */
  onDeleteDraft?: (id: string, title: string) => void
  /** 当前页码 */
  currentPage: number
  /** 总页数 */
  totalPages: number
  /** 页码变化回调 */
  onPageChange: (page: number) => void
}

/**
 * DraftsContent 组件
 *
 * @function DraftsContent
 * @param {DraftsContentProps} props - 组件属性
 * @returns {JSX.Element} 文章内容区域组件
 *
 * @description
 * 布局容器组件，职责：
 * 1. 组合 FilterChips、SearchBox、SelectAllCheckbox 等控制组件
 * 2. 渲染 DraftCard 列表或 EmptyState
 * 3. 渲染 Pagination（当需要时）
 *
 * 不包含业务逻辑，仅负责布局和组件组装
 */
export function DraftsContent({
  filterOptions,
  activeFilter,
  onFilterChange,
  searchPlaceholder,
  onSearch,
  selectedIds,
  paginatedDrafts,
  selection,
  viewMode,
  onSelectDraft,
  onSelectAll,
  onEditDraft,
  onDeleteDraft,
  currentPage,
  totalPages,
  onPageChange,
}: DraftsContentProps) {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 fade-in">
      {/* 控制栏：筛选 + 搜索 */}
      <div className="mb-4 sm:mb-6 slide-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <FilterChips
            options={filterOptions}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />

          <SearchBox
            placeholder={searchPlaceholder}
            onSearch={onSearch}
          />
        </div>

        {/* 全选复选框 */}
        <SelectAllCheckbox
          selection={selection}
          selectedCount={selectedIds.size}
          onToggle={onSelectAll}
        />
      </div>

      {/* 文章列表或空状态 */}
      {paginatedDrafts.length > 0 ? (
        <>
          <div className={`${viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {paginatedDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                selected={selectedIds.has(draft.id)}
                viewMode={viewMode}
                onSelect={onSelectDraft}
                onEdit={onEditDraft}
                onDelete={onDeleteDraft}
              />
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="暂无文章"
          description="创建你的第一篇文章，开始记录灵感"
        />
      )}
    </div>
  )
}
