'use client'

import { Loader } from 'lucide-react'
import { NotificationCard } from './NotificationCard'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'achievement'
  title: string
  message: string
  user: string
  time: string
  unread: boolean
  icon: React.ElementType
}

interface NotificationGroup {
  id: string
  title: string
  icon: React.ElementType
  notifications: Notification[]
}

interface NotificationListProps {
  groupedNotifications: NotificationGroup[]
  onMarkAsRead: (id: string) => void
  onLoadMore: () => void
}

export function NotificationList({
  groupedNotifications,
  onMarkAsRead,
  onLoadMore,
}: NotificationListProps) {
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
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        </div>
      ))}

      {groupedNotifications.length > 0 && (
        <div className="flex justify-center pt-4">
          <button 
            className="text-sm text-gray-400 hover:text-xf-primary transition flex items-center gap-1"
            onClick={onLoadMore}
          >
            <Loader className="w-4 h-4" />
            加载更多
          </button>
        </div>
      )}
    </div>
  )
}
