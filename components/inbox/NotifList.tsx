'use client'

import { NotifCard } from './NotifCard'
import { Loader } from '@/components/icons'
import { type NotificationGroup } from '@/types/notification'

interface NotifListProps {
  groupedNotifications: NotificationGroup[]
  isLoading: boolean
  onMarkAsRead: (id: string) => void
  onLoadMore: () => void
  hasMore?: boolean
  onDelete?: (id: string) => void
  isBatchMode?: boolean
  onSelect?: (id: string, selected: boolean) => void
  selectedIds?: Set<string>
}

function CardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 animate-pulse"
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex items-center gap-3 mt-2">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="w-1 h-1 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-100 rounded w-10" />
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  title = '暂无通知',
  description = '当有新消息时，会显示在这里',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <p className="text-gray-500 mb-2">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

function LoadMoreBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center pt-4">
      <button
        className="text-sm text-gray-400 hover:text-xf-primary transition flex items-center gap-1"
        onClick={onClick}
      >
        <Loader className="w-4 h-4" />
        加载更多
      </button>
    </div>
  )
}

export function NotifList({
  groupedNotifications,
  isLoading,
  onMarkAsRead,
  onLoadMore,
  hasMore = true,
  onDelete,
  isBatchMode = false,
  onSelect,
  selectedIds = new Set(),
}: NotifListProps) {
  if (isLoading) {
    return <CardSkeleton count={5} />
  }

  if (groupedNotifications.length === 0) {
    return (
      <EmptyState
        title="暂无通知"
        description="当有新消息时，会显示在这里"
      />
    )
  }

  return (
    <div className="space-y-6">
      {groupedNotifications.map(group => (
        <div key={group.id}>
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <group.icon className="w-4 h-4" />
            {group.title}
          </h2>
          <div className="space-y-2">
            {group.notifications.map(notification => (
              <NotifCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                isBatchMode={isBatchMode}
                onSelect={onSelect}
                isSelected={selectedIds.has(notification.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {hasMore && <LoadMoreBtn onClick={onLoadMore} />}
    </div>
  )
}
