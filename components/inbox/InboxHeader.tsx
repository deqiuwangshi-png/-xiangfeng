'use client'

import { Bell, CheckCheck, Settings } from 'lucide-react'

interface InboxHeaderProps {
  onMarkAllAsRead: () => void
  onSettings: () => void
}

export function InboxHeader({
  onMarkAllAsRead,
  onSettings,
}: InboxHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-serif text-xf-dark font-medium flex items-center gap-2">
        <Bell className="w-6 h-6 text-xf-primary" />
        消息通知
      </h1>
      <div className="flex gap-2">
        <button 
          className="px-4 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
          onClick={onMarkAllAsRead}
        >
          <CheckCheck className="w-4 h-4" />
          全部已读
        </button>
        <button 
          className="p-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition"
          onClick={onSettings}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
