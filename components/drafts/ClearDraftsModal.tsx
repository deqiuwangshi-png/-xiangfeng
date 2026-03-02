'use client'

/**
 * 清空草稿确认弹窗组件
 *
 * 作用: 显示清空草稿的确认弹窗，提供美观的二次确认
 *
 * 设计原则:
 * - 使用红色主题表示危险操作
 * - 柔和的视觉设计，圆角和阴影
 * - 支持取消和确认操作
 * - 点击背景可关闭
 * - 弹窗在页面正中间显示
 *
 * @returns {JSX.Element} 清空草稿确认弹窗组件
 *
 * 使用说明:
 *   - 使用 Client Component 处理交互
 *   - 使用 lucide-react 图标组件
 *   - 通过 props 控制显示/隐藏
 *
 * 更新时间: 2026-03-02
 */

import { AlertTriangle, X, Trash2 } from 'lucide-react'

/**
 * 清空草稿确认弹窗组件属性接口
 *
 * @interface ClearDraftsModalProps
 * @property {boolean} isOpen - 是否显示弹窗
 * @property {() => void} onClose - 关闭弹窗回调
 * @property {() => void} onConfirm - 确认清空回调
 * @property {number} draftCount - 草稿数量
 */
interface ClearDraftsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  draftCount: number
}

/**
 * 清空草稿确认弹窗组件
 *
 * @function ClearDraftsModal
 * @param {ClearDraftsModalProps} props - 组件属性
 * @returns {JSX.Element | null} 清空草稿确认弹窗组件
 *
 * @description
 * 提供清空草稿的二次确认功能，包括：
 * - 居中的警告图标
 * - 草稿数量高亮显示
 * - 柔和的警告提示
 * - 圆角按钮设计
 * - 点击背景关闭
 */
export function ClearDraftsModal({
  isOpen,
  onClose,
  onConfirm,
  draftCount,
}: ClearDraftsModalProps) {
  /**
   * 处理背景点击关闭
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - 鼠标事件
   * @returns {void}
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  /**
   * 处理确认清空
   *
   * @returns {void}
   */
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl transform transition-all">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* 居中的警告图标 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* 标题 */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            确认清空草稿
          </h3>

          {/* 描述文字 */}
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            此操作将永久删除
            <span className="font-semibold text-red-500 mx-1">{draftCount}</span>
            篇草稿，无法恢复
          </p>

          {/* 警告提示 - 更柔和的设计 */}
          <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
            <p className="text-sm text-amber-700 text-center">
              清空后，所有草稿内容将被永久删除
            </p>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
            >
              <Trash2 className="w-4 h-4" />
              确认清空
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
