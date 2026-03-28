'use client'

/**
 * 消息页头部组件 (Client Component)
 * @module components/inbox/_header/InboxHeader
 * @description 包含操作按钮：全部已读、批量删除等功能
 * @优化说明 标题部分提取为InboxTitle Server Component
 */

import { CheckCheck, Trash2, X, CheckSquare, Loader2 } from '@/components/icons'
import { InboxTitle } from './InboxTitle'

/**
 * 消息页头部组件属性接口
 * @interface InboxHeaderProps
 */
interface InboxHeaderProps {
  /** 全部已读回调 */
  onMarkAllAsRead: () => void
  /** 批量删除回调 */
  onBatchDelete?: () => void
  /** 是否处于批量模式 */
  isBatchMode?: boolean
  /** 切换批量模式回调 */
  onToggleBatchMode?: () => void
  /** 选中的消息数量 */
  selectedCount?: number
  /** 取消批量模式回调 */
  onCancelBatch?: () => void
  /** 未读消息数量 */
  unreadCount?: number
  /** 是否正在验证（后台更新中） */
  isValidating?: boolean
}

/**
 * 消息页头部组件
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
  unreadCount = 0,
  isValidating = false,
}: InboxHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Server Component 标题 */}
        <InboxTitle unreadCount={unreadCount} />
        
        {/* 后台更新指示器 */}
        {isValidating && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            更新中
          </span>
        )}
      </div>

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
