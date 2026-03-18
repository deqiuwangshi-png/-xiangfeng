'use client'

import { NotifCard } from './NotifCard'
import { LoadMoreBtn } from './LoadMoreBtn'
import { type NotificationGroup } from '@/types/notification'

/**
 * 通知列表组件属性接口
 * @interface NotifListProps
 * @property {NotificationGroup[]} groupedNotifications - 分组后的通知数据
 * @property {(id: string) => void} onMarkAsRead - 标记已读回调函数
 * @property {() => void} onLoadMore - 加载更多回调函数
 * @property {boolean} hasMore - 是否还有更多数据
 * @property {(id: string) => void} onDelete - 删除回调函数
 * @property {boolean} isBatchMode - 是否处于批量模式
 * @property {(id: string, selected: boolean) => void} onSelect - 选择回调函数
 * @property {Set<string>} selectedIds - 选中的通知ID集合
 */
interface NotifListProps {
  groupedNotifications: NotificationGroup[]
  onMarkAsRead: (id: string) => void
  onLoadMore: () => void
  hasMore?: boolean
  onDelete?: (id: string) => void
  isBatchMode?: boolean
  onSelect?: (id: string, selected: boolean) => void
  selectedIds?: Set<string>
}

/**
 * 通知列表组件
 * @description 按时间分组展示通知列表
 * @param {NotifListProps} props - 组件属性
 * @returns {JSX.Element} 通知列表JSX
 */
export function NotifList({
  groupedNotifications,
  onMarkAsRead,
  onLoadMore,
  hasMore = true,
  onDelete,
  isBatchMode = false,
  onSelect,
  selectedIds = new Set(),
}: NotifListProps) {
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

      {groupedNotifications.length > 0 && hasMore && <LoadMoreBtn onClick={onLoadMore} />}
    </div>
  )
}
