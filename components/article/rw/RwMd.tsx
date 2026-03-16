'use client'

/**
 * 打赏弹窗组件
 * @module components/article/rw/RwMd
 * @description 文章打赏功能弹窗
 */

import { useState } from 'react'
import { X, Sparkles, Coins, Megaphone } from '@/components/icons'
import type { RwMdProps } from '@/types'
import { TabBtn } from './TabBtn'
import { PtRw } from './PtRw'
import { AdRw } from './AdRw'
import { useArticleToast } from '@/hooks/useArticleToast'

/**
 * 打赏方式类型
 */
type RwType = 'points' | 'ad'

/**
 * 打赏弹窗组件
 * @param {RwMdProps} props - 组件属性
 * @returns {JSX.Element} 打赏弹窗
 */
export function RwMd({ articleId, authorId, onClose, onSuccess }: RwMdProps) {
  const [activeTab, setActiveTab] = useState<RwType>('points')
  const { showInfo } = useArticleToast()

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
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-xf-dark">鼓励作者</h3>
          <p className="text-sm text-xf-medium mt-1">您的支持是作者创作的动力</p>
        </div>

        {/* 打赏方式选项卡 */}
        <div className="flex gap-2 mb-6 p-1 bg-xf-bg rounded-xl">
          <TabBtn
            active={activeTab === 'points'}
            onClick={() => setActiveTab('points')}
            icon={<Coins className="w-4 h-4" />}
            label="积分"
          />
          <TabBtn
            active={activeTab === 'ad'}
            onClick={() => {
              // 广告打赏暂未开放
              showInfo('广告打赏功能即将开放， ')
            }}
            icon={<Megaphone className="w-4 h-4" />}
            label="广告"
            disabled={true}
          />
        </div>

        {/* 打赏内容区域 */}
        <div className="min-h-[200px]">
          {activeTab === 'points' && (
            <PtRw
              articleId={articleId}
              authorId={authorId}
              onSuccess={handleSuccess}
            />
          )}
          {activeTab === 'ad' && <AdRw />}
        </div>
      </div>
    </div>
  )
}
