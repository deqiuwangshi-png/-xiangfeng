'use client'

import { InboxHeader } from '@/components/inbox/InboxHeader'
import { FilterTabs } from '@/components/inbox/FilterTabs'
import { NotificationList } from '@/components/inbox/NotificationList'
import { InboxEmptyState } from '@/components/inbox/InboxEmptyState'
import { useInbox } from '@/hooks/useInbox'

export default function InboxPage() {
  const {
    activeFilter,
    groupedNotifications,
    handleFilterClick,
    handleMarkAllAsRead,
    handleMarkAsRead,
    handleLoadMore,
  } = useInbox()

  return (
    <div className="max-w-3xl mx-auto px-8 pt-8 pb-20">
      <InboxHeader
        onMarkAllAsRead={handleMarkAllAsRead}
        onSettings={() => console.log('打开设置')}
      />

      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterClick}
      />

      {groupedNotifications.length > 0 ? (
        <NotificationList
          groupedNotifications={groupedNotifications}
          onMarkAsRead={handleMarkAsRead}
          onLoadMore={handleLoadMore}
        />
      ) : (
        <InboxEmptyState
          title="暂无通知"
          description="当有新消息时，会显示在这里"
        />
      )}
    </div>
  )
}
