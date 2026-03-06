'use client'

import { MoreVertical } from 'lucide-react'
import { DeleteBtn } from './DeleteBtn'

/**
 * 通知操作按钮组件属性接口
 * @interface NotificationActionsProps
 * @property {boolean} canDelete - 是否可以删除
 * @property {boolean} isBatchMode - 是否处于批量模式
 * @property {boolean} isUnread - 是否未读
 * @property {() => void} onDelete - 删除回调
 */
interface NotificationActionsProps {
  canDelete: boolean
  isBatchMode: boolean
  isUnread: boolean
  onDelete?: () => void
}

/**
 * 通知操作按钮组件
 * @description 通知卡片右侧的操作按钮区域，包含删除按钮和更多按钮
 * @param {NotificationActionsProps} props - 组件属性
 * @returns {JSX.Element | null} 操作按钮组件
 */
export function NotificationActions({
  canDelete,
  isBatchMode,
  isUnread,
  onDelete,
}: NotificationActionsProps) {
  const showDelete = canDelete && !isBatchMode
  const showMore = isUnread || isBatchMode

  if (!showDelete && !showMore) {
    return null
  }

  return (
    <>
      {/* 删除按钮 - 仅已读消息显示 */}
      {showDelete && onDelete && <DeleteBtn onDelete={onDelete} />}

      {/* 更多按钮 - 未读消息或批量模式显示 */}
      {showMore && (
        <button className="hover:bg-gray-100 p-1 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </>
  )
}
