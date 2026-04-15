'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Trash2 } from 'lucide-react'
import { type NotificationWithIcon } from '@/types/notification'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

interface NotifCardProps {
  notification: NotificationWithIcon
  onMarkAsRead: (id: string) => void
  onDelete?: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  isBatchMode?: boolean
}

function BatchSelectBox({
  isSelected,
  onSelect,
}: {
  isSelected: boolean
  onSelect: (selected: boolean) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.checked)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="shrink-0 flex items-center w-10 h-10 sm:w-auto sm:h-auto -ml-2 sm:ml-0 justify-center">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
        onClick={handleClick}
        className="w-5 h-5 sm:w-4 sm:h-4 rounded border-gray-300 text-xf-primary focus:ring-xf-primary"
      />
    </div>
  )
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [showDialog, setShowDialog] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDialog(true)
  }

  const handleConfirm = () => {
    onDelete()
    setShowDialog(false)
  }

  return (
    <>
      <button
        className="hover:bg-red-100 p-1.5 rounded text-gray-400 hover:text-red-500 transition"
        onClick={handleClick}
        title="删除"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <DeleteConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirm}
        count={1}
      />
    </>
  )
}

function NotificationActions({
  canDelete,
  isBatchMode,
  isUnread,
  onDelete,
}: {
  canDelete: boolean
  isBatchMode: boolean
  isUnread: boolean
  onDelete?: () => void
}) {
  const showDelete = canDelete && !isBatchMode
  const showMore = isUnread || isBatchMode

  if (!showDelete && !showMore) {
    return null
  }

  return (
    <div className="flex items-center gap-1">
      {showDelete && onDelete && <DeleteButton onDelete={onDelete} />}
      {showMore && (
        <button className="hover:bg-gray-100 p-1 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  )
}

export const NotifCard = memo(function NotifCard({
  notification,
  onMarkAsRead,
  onDelete,
  isSelected = false,
  onSelect,
  isBatchMode = false,
}: NotifCardProps) {
  const router = useRouter()
  const Icon = notification.icon
  const canDelete = Boolean(!notification.unread && onDelete)

  const handleClick = () => {
    if (isBatchMode && onSelect) {
      onSelect(notification.id, !isSelected)
      return
    }

    if (notification.unread) {
      onMarkAsRead(notification.id)
    }

    if (notification.articleId) {
      router.push(`/article/${notification.articleId}`)
    }
  }

  const handleSelect = (selected: boolean) => {
    onSelect?.(notification.id, selected)
  }

  const handleDelete = () => {
    onDelete?.(notification.id)
  }

  const canNavigate = Boolean(notification.articleId || notification.commentId)

  return (
    <div
      className={`flex items-start gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border-gray-100 hover:shadow-sm transition ${
        notification.unread ? 'border-l-4 border-xf-primary' : ''
      } ${isSelected ? 'ring-2 ring-xf-primary bg-blue-50' : ''} ${
        canNavigate && !isBatchMode ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={handleClick}
      role={canNavigate && !isBatchMode ? 'button' : undefined}
      tabIndex={canNavigate && !isBatchMode ? 0 : undefined}
    >
      {isBatchMode && (
        <BatchSelectBox isSelected={isSelected} onSelect={handleSelect} />
      )}

      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
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

      <NotificationActions
        canDelete={canDelete}
        isBatchMode={isBatchMode}
        isUnread={notification.unread}
        onDelete={handleDelete}
      />
    </div>
  )
})
