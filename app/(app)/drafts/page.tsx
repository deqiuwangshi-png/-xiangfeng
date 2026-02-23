'use client'

import { DraftsHeader } from '@/components/drafts/DraftsHeader'
import { DraftsContent } from '@/components/drafts/DraftsContent'
import { BatchActionsBar } from '@/components/drafts/BatchActionsBar'
import { useDrafts } from '@/hooks/useDrafts'
import { mockDrafts, filterOptions } from '@/constants/drafts'

export default function DraftsPage() {
  const {
    selectedIds,
    activeFilter,
    currentPage,
    filteredDrafts,
    paginatedDrafts,
    totalPages,
    selection,
    handleFilterChange,
    handleSearch,
    handleSelectDraft,
    handleSelectAll,
    handleEditDraft,
    handleBatchDelete,
    handleBatchPublish,
    handleBatchArchive,
    handleCancelSelection,
    handleClearAllDrafts,
    handleNewDraft,
    handlePageChange,
  } = useDrafts(mockDrafts)

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
      <DraftsHeader
        draftCount={filteredDrafts.length}
        onClearAllDrafts={handleClearAllDrafts}
        onNewDraft={handleNewDraft}
      />

      <DraftsContent
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchPlaceholder="搜索草稿标题或内容..."
        onSearch={handleSearch}
        selectedIds={selectedIds}
        paginatedDrafts={paginatedDrafts}
        selection={selection}
        onSelectDraft={handleSelectDraft}
        onSelectAll={handleSelectAll}
        onEditDraft={handleEditDraft}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <BatchActionsBar
        selectedCount={selectedIds.size}
        visible={selectedIds.size > 0}
        onDelete={handleBatchDelete}
        onPublish={handleBatchPublish}
        onArchive={handleBatchArchive}
        onCancel={handleCancelSelection}
      />
    </div>
  )
}
