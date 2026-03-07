'use client'

import { useState } from 'react'
import { Trash2 } from '@/components/icons'
import { DeleteConfirmDialog } from '../_dialog/DelConfirmDlg'

/**
 * 删除按钮组件属性接口
 * @interface DeleteBtnProps
 * @property {() => void} onDelete - 确认删除回调
 * @property {string} title - 按钮标题提示
 */
interface DeleteBtnProps {
  onDelete: () => void
  title?: string
}

/**
 * 删除按钮组件
 * @description 带确认弹窗的删除按钮，独立管理弹窗状态
 * @param {DeleteBtnProps} props - 组件属性
 * @returns {JSX.Element} 删除按钮JSX
 */
export function DeleteBtn({ onDelete, title = '删除' }: DeleteBtnProps) {
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
        title={title}
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
