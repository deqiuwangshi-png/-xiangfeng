'use client'

/**
 * 删除确认弹窗组件
 *
 * 作用: 统一的删除确认弹窗，支持单篇删除、批量删除、清空文章三种模式
 *
 * @returns {JSX.Element} 删除确认弹窗组件
 *
 * 使用说明:
 *   - 使用 Client Component 处理交互
 *   - 使用 lucide-react 图标组件
 *   - 通过 props 控制显示/隐藏和模式
 *   - 三种模式: 'single' | 'batch' | 'clear'
 *
 * 更新时间: 2026-03-04
 */

import { AlertTriangle, X, Trash2 } from '@/components/icons'
import type { DeleteMode } from '@/types/drafts'

/**
 * 删除确认弹窗组件属性接口
 *
 * @interface DeleteConfirmModalProps
 * @property {boolean} isOpen - 是否显示弹窗
 * @property {() => void} onClose - 关闭弹窗回调
 * @property {() => void} onConfirm - 确认删除回调
 * @property {DeleteMode} mode - 删除模式
 * @property {number} count - 删除数量（用于 batch 和 clear 模式）
 * @property {string} itemName - 项目名称（用于 single 模式）
 */
interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  mode: DeleteMode
  count?: number
  itemName?: string
}

/**
 * 获取弹窗配置
 *
 * @function getModalConfig
 * @param {DeleteMode} mode - 删除模式
 * @param {number} count - 删除数量
 * @param {string} itemName - 项目名称
 * @returns {Object} 弹窗配置对象
 *
 * @description
 * 根据删除模式返回对应的标题、描述、按钮文字等配置
 */
const getModalConfig = (mode: DeleteMode, count = 0, itemName = '') => {
  switch (mode) {
    case 'single':
      return {
        title: '确认删除',
        description: (
          <>
            确定要删除文章
            <span className="font-semibold text-red-500 mx-1">{itemName || '这篇文章'}</span>
            吗？
          </>
        ),
        warningText: '删除后，该文章将被永久删除，无法恢复',
        confirmText: '确认删除',
      }
    case 'batch':
      return {
        title: '确认批量删除',
        description: (
          <>
            确定要删除选中的
            <span className="font-semibold text-red-500 mx-1">{count}</span>
            篇文章吗？
          </>
        ),
        warningText: '删除后，选中的文章将被永久删除，无法恢复',
        confirmText: '确认删除',
      }
    case 'clear':
      return {
        title: '确认清空草稿',
        description: (
          <>
            此操作将永久删除
            <span className="font-semibold text-red-500 mx-1">{count}</span>
            篇草稿
          </>
        ),
        warningText: '清空后，所有草稿将被永久删除，已发布的文章不受影响',
        confirmText: '确认清空',
      }
  }
}

/**
 * 删除确认弹窗组件
 *
 * @function DeleteConfirmModal
 * @param {DeleteConfirmModalProps} props - 组件属性
 * @returns {JSX.Element | null} 删除确认弹窗组件
 *
 * @description
 * 提供统一的删除确认弹窗，包括：
 * - 居中的警告图标
 * - 动态标题和描述（根据模式变化）
 * - 删除数量高亮显示
 * - 柔和的警告提示
 * - 圆角按钮设计
 * - 点击背景关闭
 */
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  mode,
  count = 0,
  itemName = '',
}: DeleteConfirmModalProps) {
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
   * 处理确认删除
   *
   * @returns {void}
   */
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  const config = getModalConfig(mode, count, itemName)

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl transform transition-all relative">
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
            {config.title}
          </h3>

          {/* 描述文字 */}
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {config.description}
          </p>

          {/* 警告提示 - 更柔和的设计 */}
          <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
            <p className="text-sm text-amber-700 text-center">
              {config.warningText}
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
              {config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
