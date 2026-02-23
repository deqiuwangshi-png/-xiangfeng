'use client'

import { DraftCard } from './DraftCard'
import { FilterChips } from './FilterChips'
import { SearchBox } from './SearchBox'
import { Pagination } from './Pagination'
import { EmptyState } from './EmptyState'
import type { DraftData, DraftFilter, DraftSelection } from '@/types/drafts'
import type { FilterOption } from './FilterChips'

interface DraftsContentProps {
  filterOptions: FilterOption[]
  activeFilter: DraftFilter
  onFilterChange: (filter: DraftFilter) => void
  searchPlaceholder: string
  onSearch: (query: string) => void
  selectedIds: Set<string>
  paginatedDrafts: DraftData[]
  selection: DraftSelection
  onSelectDraft: (id: string) => void
  onSelectAll: () => void
  onEditDraft: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DraftsContent({
  filterOptions,
  activeFilter,
  onFilterChange,
  searchPlaceholder,
  onSearch,
  selectedIds,
  paginatedDrafts,
  selection,
  onSelectDraft,
  onSelectAll,
  onEditDraft,
  currentPage,
  totalPages,
  onPageChange,
}: DraftsContentProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 fade-in">
      <div className="mb-6 slide-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`
                select-checkbox w-5 h-5 rounded-md border-2
                flex items-center justify-center cursor-pointer
                transition-all duration-200
                ${selection.isAllSelected
                  ? 'bg-xf-primary border-xf-primary'
                  : 'border-gray-300 bg-transparent'
                }
              `}
              onClick={onSelectAll}
            >
              {selection.isAllSelected && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </div>
            <span className="text-sm text-xf-medium">全选</span>
          </div>
          <div className="text-sm text-xf-medium hidden md:block">
            <span>{selectedIds.size}</span> 篇选中
          </div>
        </div>
      </div>

      {paginatedDrafts.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                selected={selectedIds.has(draft.id)}
                onSelect={onSelectDraft}
                onEdit={onEditDraft}
              />
            ))}
          </div>

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
          title="暂无草稿"
          description="创建你的第一篇草稿，开始记录灵感"
        />
      )}
    </div>
  )
}
