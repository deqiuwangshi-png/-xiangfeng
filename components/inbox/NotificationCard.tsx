'use client'

import { MoreVertical } from 'lucide-react'

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

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

export function NotificationCard({
  notification,
  onMarkAsRead,
}: NotificationCardProps) {
  const Icon = notification.icon
  
  return (
    <div 
      className={`flex items-start gap-4 bg-white p-4 rounded-xl border-gray-100 hover:shadow-sm transition ${notification.unread ? 'border-l-4 border-xf-primary' : ''}`}
      onClick={() => notification.unread && onMarkAsRead(notification.id)}
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        {/* LCP关键元素：通知消息文本，优化渲染性能 */}
        <p
          className="text-sm text-gray-800"
          style={{ contain: 'layout style paint' }}
        >
          <span className="font-medium">{notification.user}</span> {notification.title}
          {notification.message && (
            <span className="text-xf-primary"> {notification.message}</span>
          )}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs">
          <span className="text-gray-400">{notification.time}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className={notification.unread ? 'text-xf-primary' : 'text-gray-400'}>
            {notification.unread ? '未读' : '已读'}
          </span>
        </div>
      </div>
      <button className="hover:bg-gray-100 p-1 rounded">
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}
