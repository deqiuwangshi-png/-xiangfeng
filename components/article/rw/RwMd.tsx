'use client'

/**
 * 打赏弹窗组件
 * @module components/article/rw/RwMd
 * @description 文章积分打赏功能弹窗
 */

import { X, Coins } from '@/components/icons'
import type { RwMdProps } from '@/types'
import { PtRw } from './PtRw'

/**
 * 打赏弹窗组件
 * @param {RwMdProps} props - 组件属性
 * @returns {JSX.Element} 打赏弹窗
 */
export function RwMd({ articleId, authorId, onClose, onSuccess }: RwMdProps) {
  /**
   * 处理打赏成功
   */
  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 text-xf-medium hover:text-xf-dark transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-xf-primary flex items-center justify-center">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-xf-dark">鼓励作者</h3>
          <p className="text-sm text-xf-medium mt-1">使用积分鼓励作者创作</p>
        </div>

        {/* 积分打赏内容区域 */}
        <div className="min-h-[200px]">
          <PtRw
            articleId={articleId}
            authorId={authorId}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  )
}
