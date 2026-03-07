'use client'

import { Bell, CheckCheck, Trash2, X, CheckSquare } from '@/components/icons'

/**
 * 消息页头部组件属性接口
 * @interface InboxHeaderProps
 * @property {() => void} onMarkAllAsRead - 全部已读回调
 * @property {() => void} onBatchDelete - 批量删除回调
 * @property {boolean} isBatchMode - 是否处于批量模式
 * @property {() => void} onToggleBatchMode - 切换批量模式回调
 * @property {number} selectedCount - 选中的消息数量
 * @property {() => void} onCancelBatch - 取消批量模式回调
 */
interface InboxHeaderProps {
  onMarkAllAsRead: () => void
  onBatchDelete?: () => void
  isBatchMode?: boolean
  onToggleBatchMode?: () => void
  selectedCount?: number
  onCancelBatch?: () => void
}

/**
 * 消息页头部组件
 * @description 包含标题、全部已读、批量删除等功能按钮
 * @param {InboxHeaderProps} props - 组件属性
 * @returns {JSX.Element} 头部组件JSX
 */
export function InboxHeader({
  onMarkAllAsRead,
  onBatchDelete,
  isBatchMode = false,
  onToggleBatchMode,
  selectedCount = 0,
  onCancelBatch,
}: InboxHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-serif text-xf-dark font-medium flex items-center gap-2">
        <Bell className="w-6 h-6 text-xf-primary" />
        消息通知
      </h1>

      <div className="flex items-center gap-2">
        {/* 批量模式下的操作按钮 */}
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
            {/* 批量模式入口 */}
            <button
              className="px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
              onClick={onToggleBatchMode}
            >
              <CheckSquare className="w-4 h-4" />
              批量
            </button>

            {/* 全部已读按钮 */}
            <button
              className="px-4 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
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
