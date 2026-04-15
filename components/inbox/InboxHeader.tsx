'use client'

import { CheckCheck, Trash2, X, CheckSquare, Loader2, Bell } from '@/components/icons'

interface InboxHeaderProps {
  onMarkAllAsRead: () => void
  onBatchDelete?: () => void
  isBatchMode?: boolean
  onToggleBatchMode?: () => void
  selectedCount?: number
  onCancelBatch?: () => void
  unreadCount?: number
  isValidating?: boolean
}

export function InboxHeader({
  onMarkAllAsRead,
  onBatchDelete,
  isBatchMode = false,
  onToggleBatchMode,
  selectedCount = 0,
  onCancelBatch,
  unreadCount = 0,
  isValidating = false,
}: InboxHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl font-serif text-xf-dark font-medium flex items-center gap-2">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-xf-primary" />
            消息通知
          </h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-xf-primary text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {isValidating && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            更新中
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isBatchMode ? (
          <>
            <span className="text-sm text-gray-500">
              已选择 {selectedCount} 条
            </span>
            <button
              className="px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
              onClick={onCancelBatch}
            >
              <X className="w-4 h-4" />
              取消
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-lg transition flex items-center gap-1 ${
                selectedCount > 0
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={onBatchDelete}
              disabled={selectedCount === 0}
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </>
        ) : (
          <>
            <button
              className="px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
              onClick={onToggleBatchMode}
            >
              <CheckSquare className="w-4 h-4" />
              批量
            </button>
            <button
              className="px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
              onClick={onMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4" />
              全部已读
            </button>
          </>
        )}
      </div>
    </div>
  )
}
