'use client'

/**
 * 消息页客户端组件
 * @module components/inbox/_client/InboxClient
 * @description 使用 SWR 全局缓存，实现页面级别状态持久化
 */

import { useState, useCallback } from 'react'
import { InboxHeader } from '../_header/InboxHeader'
import { FilterTabs } from '../_filters/FilterTabs'
import { NotifList } from '../_list/NotifList'
import { EmptyState } from '../_list/EmptyState'
import { CardSkeleton } from '../_list/CardSkeleton'
import { DeleteConfirmDialog } from '../_dialog/DelConfirmDlg'
import { useInboxCache, useInboxRealtime } from '@/hooks/notification/useInboxCache'

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
 * @description 使用 SWR 全局缓存，页面切换不重复加载，支持 Realtime 增量更新
 * @param {InboxClientProps} props - 组件属性，包含从服务端传入的用户ID
 * @returns {JSX.Element} 消息页JSX
 */
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

  {/* 订阅 Realtime，收到新通知时触发增量更新 */}
  useInboxRealtime(userId, refresh)

  {/* 切换批量模式 */}
  const toggleBatchMode = useCallback(() => {
    setIsBatchMode(prev => !prev)
    setSelectedIds(new Set())
  }, [])

  {/* 取消批量模式 */}
  const cancelBatchMode = useCallback(() => {
    setIsBatchMode(false)
    setSelectedIds(new Set())
  }, [])

  {/* 选择/取消选择通知 */}
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

  {/* 标记所有为已读 */}
  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsReadCache()
  }, [markAllAsReadCache])

  {/* 标记单个为已读 */}
  const handleMarkAsRead = useCallback(async (id: string) => {
    await markAsReadCache(id)
  }, [markAsReadCache])

  {/* 删除通知 */}
  const handleDeleteNotification = useCallback(async (id: string) => {
    await deleteNotificationCache(id)
  }, [deleteNotificationCache])

  {/* 批量删除 */}
  const handleBatchDeleteClick = useCallback(() => {
    if (selectedIds.size > 0) {
      setShowBatchDeleteDialog(true)
    }
  }, [selectedIds.size])

  {/* 确认批量删除 */}
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

      {isLoading ? (
        <CardSkeleton count={5} />
      ) : groupedNotifications.length > 0 ? (
        <NotifList
          groupedNotifications={groupedNotifications}
          onMarkAsRead={handleMarkAsRead}
          onLoadMore={loadMore}
          hasMore={hasMore}
          onDelete={handleDeleteNotification}
          isBatchMode={isBatchMode}
          onSelect={selectNotification}
          selectedIds={selectedIds}
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
        count={selectedIds.size}
      />
    </div>
  )
}
