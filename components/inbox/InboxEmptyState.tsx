'use client'

import { Bell } from 'lucide-react'

interface InboxEmptyStateProps {
  title?: string
  description?: string
}

export function InboxEmptyState({
  title = '暂无通知',
  description = '当有新消息时，会显示在这里',
}: InboxEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bell className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-500 mb-2">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
