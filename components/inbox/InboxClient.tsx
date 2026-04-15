'use client'

import { useState, useCallback } from 'react'
import { InboxHeader } from './InboxHeader'
import { FilterTabs } from './FilterTabs'
import { NotifList } from './NotifList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { useInboxCache, useInboxRealtime } from '@/hooks/notification/useInboxCache'

interface InboxClientProps {
  userId: string
}

export function InboxClient({ userId }: InboxClientProps) {
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false)

  const {
    groupedNotifications,
    isLoading,
    isValidating,
    hasMore,
    unreadCount,
    activeFilter,
    setActiveFilter,
    loadMore,
    refresh,
    markAllAsRead: markAllAsReadCache,
    markAsRead: markAsReadCache,
    deleteNotification: deleteNotificationCache,
    batchDeleteNotifications: batchDeleteNotificationsCache,
  } = useInboxCache(userId)

  useInboxRealtime(userId, refresh)

  const toggleBatchMode = useCallback(() => {
    setIsBatchMode(prev => !prev)
    setSelectedIds(new Set())
  }, [])

  const cancelBatchMode = useCallback(() => {
    setIsBatchMode(false)
    setSelectedIds(new Set())
  }, [])

  const selectNotification = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsReadCache()
  }, [markAllAsReadCache])

  const handleMarkAsRead = useCallback(async (id: string) => {
    await markAsReadCache(id)
  }, [markAsReadCache])

  const handleDeleteNotification = useCallback(async (id: string) => {
    await deleteNotificationCache(id)
  }, [deleteNotificationCache])

  const handleBatchDeleteClick = useCallback(() => {
    if (selectedIds.size > 0) {
      setShowBatchDeleteDialog(true)
    }
  }, [selectedIds.size])

  const handleConfirmBatchDelete = useCallback(async () => {
    await batchDeleteNotificationsCache(Array.from(selectedIds))
    setShowBatchDeleteDialog(false)
    setSelectedIds(new Set())
    setIsBatchMode(false)
  }, [batchDeleteNotificationsCache, selectedIds])

  return (
    <div className="max-w-3xl mx-auto px-8 pt-8 pb-20">
      <InboxHeader
        onMarkAllAsRead={handleMarkAllAsRead}
        onBatchDelete={handleBatchDeleteClick}
        isBatchMode={isBatchMode}
        onToggleBatchMode={toggleBatchMode}
        selectedCount={selectedIds.size}
        onCancelBatch={cancelBatchMode}
        unreadCount={unreadCount}
        isValidating={isValidating}
      />

      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <NotifList
        groupedNotifications={groupedNotifications}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
        onLoadMore={loadMore}
        hasMore={hasMore}
        onDelete={handleDeleteNotification}
        isBatchMode={isBatchMode}
        onSelect={selectNotification}
        selectedIds={selectedIds}
      />

      <DeleteConfirmDialog
        isOpen={showBatchDeleteDialog}
        onClose={() => setShowBatchDeleteDialog(false)}
        onConfirm={handleConfirmBatchDelete}
        count={selectedIds.size}
      />
    </div>
  )
}
