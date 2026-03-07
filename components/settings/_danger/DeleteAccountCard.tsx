'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2, X } from '@/components/icons'
import { deleteAccount } from '@/lib/user/deleteAccount'
import { useRouter } from 'next/navigation'

/**
 * 删除账户卡片组件
 */
export function DeleteAccountCard() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== '删除') return

    setIsLoading(true)
    const result = await deleteAccount()

    if (result.success) {
      router.push('/')
      router.refresh()
    } else {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isLoading) return
    setShowModal(false)
    setConfirmText('')
  }

  return (
    <>
      {/* 触发按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-red-700">删除账户</h4>
          <p className="text-sm text-red-600">永久删除账户和所有数据</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          删除
        </button>
      </div>

      {/* 删除确认弹窗 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl relative">
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* 标题 */}
            <div className="flex items-center gap-2 mb-3 pr-6">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <h3 className="text-base font-bold text-gray-900">确认删除账户？</h3>
            </div>

            {/* 警告信息 */}
            <p className="text-sm text-gray-600 mb-3">
              此操作不可恢复，以下内容将被永久删除：
            </p>
            <ul className="text-sm text-red-700 mb-4 space-y-1 list-disc list-inside">
              <li>个人资料信息</li>
              <li>发布的所有文章</li>
              <li>点赞和收藏记录</li>
            </ul>

            {/* 确认输入 */}
            <p className="text-sm text-gray-600 mb-2">
              输入 <strong className="text-red-600">&ldquo;删除&rdquo;</strong> 确认：
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:border-red-500"
              placeholder="输入“删除”确认"
            />

            {/* 按钮 */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading || confirmText !== '删除'}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg text-sm flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                {isLoading ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
