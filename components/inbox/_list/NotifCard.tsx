'use client'

import { memo } from 'react'
import { type NotificationWithIcon } from '@/types/notification'
import { BatchSelectBox } from '../_actions/BatchSelectBox'
import { NotificationActions } from '../_actions/NotifActions'

/**
 * 通知卡片组件属性接口
 * @interface NotifCardProps
 * @property {NotificationWithIcon} notification - 通知数据（包含图标）
 * @property {(id: string) => void} onMarkAsRead - 标记已读回调函数
 * @property {(id: string) => void} onDelete - 删除回调函数
 * @property {boolean} isSelected - 是否被选中（批量模式）
 * @property {(id: string, selected: boolean) => void} onSelect - 选择回调函数
 * @property {boolean} isBatchMode - 是否处于批量模式
 */
interface NotifCardProps {
  notification: NotificationWithIcon
  onMarkAsRead: (id: string) => void
  onDelete?: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  isBatchMode?: boolean
}

/**
 * 通知卡片组件
 * @description 显示单条通知信息，使用memo优化避免不必要的重渲染
 * @param {NotifCardProps} props - 组件属性
 * @returns {JSX.Element} 通知卡片JSX
 */
export const NotifCard = memo(function NotifCard({
  notification,
  onMarkAsRead,
  onDelete,
  isSelected = false,
  onSelect,
  isBatchMode = false,
}: NotifCardProps) {
  const Icon = notification.icon
  const canDelete = Boolean(!notification.unread && onDelete)

  const handleClick = () => {
    if (isBatchMode && onSelect) {
      onSelect(notification.id, !isSelected)
    } else if (notification.unread) {
      onMarkAsRead(notification.id)
    }
  }

  const handleSelect = (selected: boolean) => {
    onSelect?.(notification.id, selected)
  }

  const handleDelete = () => {
    onDelete?.(notification.id)
  }

  return (
    <div
      className={`flex items-start gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border-gray-100 hover:shadow-sm transition ${
        notification.unread ? 'border-l-4 border-xf-primary' : ''
      } ${isSelected ? 'ring-2 ring-xf-primary bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      {/* 批量选择框 */}
      {isBatchMode && (
        <BatchSelectBox isSelected={isSelected} onSelect={handleSelect} />
      )}

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

      {/* 操作按钮区域 */}
      <NotificationActions
        canDelete={canDelete}
        isBatchMode={isBatchMode}
        isUnread={notification.unread}
        onDelete={handleDelete}
      />
    </div>
  )
})
