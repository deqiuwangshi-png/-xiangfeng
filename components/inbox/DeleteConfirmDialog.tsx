'use client'

import { Trash2, X } from '@/components/icons'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  count?: number
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  count = 1,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null

  const isBatch = count > 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
          确认删除
        </h3>

        <p className="text-sm text-gray-500 text-center mb-6">
          {isBatch
            ? `确定要删除选中的 ${count} 条已读消息吗？删除后无法恢复。`
            : '确定要删除这条已读消息吗？删除后无法恢复。'}
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
            onClick={onConfirm}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
