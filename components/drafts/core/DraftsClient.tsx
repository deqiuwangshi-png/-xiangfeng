'use client'

import { useState } from 'react'
import { useDrafts } from '../hooks/useDrafts'
import { DraftsHeader } from '../header/DraftsHeader'
import { DraftsContent } from './DraftsContent'
import { BatchActionsBar } from '../actions/BatchActionsBar'
import { DeleteConfirmModal } from '../actions/DeleteConfirmModal'
import type { FilterOption } from '../filter/FilterChips'
import type { Article } from '@/lib/drafts/draftService'

/**
 * DraftsClient Props 接口
 */
interface DraftsClientProps {
  initialArticles: Article[]
  filterOptions: FilterOption[]
}

/**
 * 删除弹窗状态类型
 */
interface DeleteModalState {
  isOpen: boolean
  mode: 'single' | 'batch' | 'clear'
  targetId?: string
  targetName?: string
}

/**
 * DraftsClient 组件
 *
 * @function DraftsClient
 * @param {DraftsClientProps} props - 组件属性
 * @returns {JSX.Element} 草稿管理客户端组件
 *
 * @description
 * 草稿管理的协调层组件，职责：
 * 1. 调用 useDrafts Hook 获取状态和方法
 * 2. 管理 DeleteConfirmModal 的显示状态和模式
 * 3. 协调各子组件的渲染和数据传递
 *
 * 遵循单一职责原则，不包含具体业务逻辑
 */
export function DraftsClient({ initialArticles, filterOptions }: DraftsClientProps) {
  // 使用 useDrafts Hook 管理所有业务逻辑
  const {
    filteredDrafts,
    paginatedDrafts,
    totalPages,
    selectedIds,
    selection,
    activeFilter,
    currentPage,
    setActiveFilter,
    setSearchQuery,
    setCurrentPage,
    handleSelectDraft,
    handleSelectAll,
    handleEditDraft,
    executeDeleteDrafts,
    handleBatchPublish,
    handleBatchArchive,
    handleCancelSelection,
    handleClearAllDrafts,
  } = useDrafts(initialArticles)

  /**
   * 删除弹窗状态
   */
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    mode: 'single',
  })

  /**
   * 处理打开单篇删除弹窗
   *
   * @param {string} id - 草稿ID
   * @param {string} title - 草稿标题
   */
  const handleOpenSingleDeleteModal = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      mode: 'single',
      targetId: id,
      targetName: title,
    })
  }

  /**
   * 处理打开批量删除弹窗
   */
  const handleOpenBatchDeleteModal = () => {
    if (selectedIds.size === 0) return
    setDeleteModal({
      isOpen: true,
      mode: 'batch',
    })
  }

  /**
   * 处理打开清空草稿弹窗
   */
  const handleOpenClearModal = () => {
    if (filteredDrafts.length === 0) return
    setDeleteModal({
      isOpen: true,
      mode: 'clear',
    })
  }

  /**
   * 处理关闭删除弹窗
   */
  const handleCloseDeleteModal = () => {
    setDeleteModal((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }

  /**
   * 处理确认删除
   */
  const handleConfirmDelete = async () => {
    switch (deleteModal.mode) {
      case 'single':
        if (deleteModal.targetId) {
          await executeDeleteDrafts([deleteModal.targetId])
        }
        break
      case 'batch':
        if (selectedIds.size > 0) {
          await executeDeleteDrafts(Array.from(selectedIds), true)
        }
        break
      case 'clear':
        await handleClearAllDrafts()
        break
    }
  }

  /**
   * 获取删除数量
   */
  const getDeleteCount = () => {
    switch (deleteModal.mode) {
      case 'single':
        return 1
      case 'batch':
        return selectedIds.size
      case 'clear':
        return draftCount
      default:
        return 0
    }
  }

  // 计算草稿数量（用于清空草稿按钮显示）
  const draftCount = filteredDrafts.filter((d) => d.status === 'draft').length

  return (
    <>
      <DraftsHeader
        draftCount={draftCount}
        onClearAllDrafts={handleOpenClearModal}
      />

      <DraftsContent
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchPlaceholder="搜索草稿标题或内容..."
        onSearch={setSearchQuery}
        selectedIds={selectedIds}
        paginatedDrafts={paginatedDrafts}
        selection={selection}
        onSelectDraft={handleSelectDraft}
        onSelectAll={handleSelectAll}
        onEditDraft={handleEditDraft}
        onDeleteDraft={handleOpenSingleDeleteModal}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <BatchActionsBar
        selectedCount={selectedIds.size}
        visible={selectedIds.size > 0}
        onDelete={handleOpenBatchDeleteModal}
        onPublish={handleBatchPublish}
        onArchive={handleBatchArchive}
        onCancel={handleCancelSelection}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        mode={deleteModal.mode}
        count={getDeleteCount()}
        itemName={deleteModal.targetName}
      />
    </>
  )
}
