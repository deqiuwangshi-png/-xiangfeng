'use client'

import { useState } from 'react'
import { InboxHeader } from '../_header/InboxHeader'
import { FilterTabs } from '../_filters/FilterTabs'
import { NotifList } from '../_list/NotifList'
import { EmptyState } from '../_list/EmptyState'
import { CardSkeleton } from '../_list/CardSkeleton'
import { DeleteConfirmDialog } from '../_dialog/DelConfirmDlg'
import { useInbox } from '@/hooks/useInbox'

/**
 * 消息页客户端组件属性接口
 * @interface InboxClientProps
 * @property {string} userId - 当前用户ID（从服务端传入）
 */
interface InboxClientProps {
  userId: string
}

/**
 * 消息页客户端组件
 * @description 仅负责渲染，状态逻辑由 useInbox 管理，支持单条和批量删除
 * @param {InboxClientProps} props - 组件属性，包含从服务端传入的用户ID
 * @returns {JSX.Element} 消息页JSX
 */
export function InboxClient({ userId }: InboxClientProps) {
  const {
    activeFilter,
    setActiveFilter,
    groupedNotifications,
    isLoading,
    hasMore,
    isBatchMode,
    selectedCount,
    markAllAsRead,
    markAsRead,
    loadMore,
    toggleBatchMode,
    cancelBatchMode,
    selectNotification,
    deleteNotification,
    batchDeleteNotifications,
  } = useInbox(userId)

  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false)

  const handleBatchDeleteClick = () => {
    if (selectedCount > 0) {
      setShowBatchDeleteDialog(true)
    }
  }

  const handleConfirmBatchDelete = () => {
    batchDeleteNotifications()
    setShowBatchDeleteDialog(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-8 pt-8 pb-20">
      <InboxHeader
        onMarkAllAsRead={markAllAsRead}
        onBatchDelete={handleBatchDeleteClick}
        isBatchMode={isBatchMode}
        onToggleBatchMode={toggleBatchMode}
        selectedCount={selectedCount}
        onCancelBatch={cancelBatchMode}
      />

      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <CardSkeleton count={5} />
      ) : groupedNotifications.length > 0 ? (
        <NotifList
          groupedNotifications={groupedNotifications}
          onMarkAsRead={markAsRead}
          onLoadMore={loadMore}
          hasMore={hasMore}
          onDelete={deleteNotification}
          isBatchMode={isBatchMode}
          onSelect={selectNotification}
        />
      ) : (
        <EmptyState
          title="暂无通知"
          description="当有新消息时，会显示在这里"
        />
      )}

      {/* 批量删除确认弹窗 */}
      <DeleteConfirmDialog
        isOpen={showBatchDeleteDialog}
        onClose={() => setShowBatchDeleteDialog(false)}
        onConfirm={handleConfirmBatchDelete}
        count={selectedCount}
      />
    </div>
  )
}
