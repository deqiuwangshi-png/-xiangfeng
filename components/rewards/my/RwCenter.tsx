'use client'

/**
 * 历史记录主组件
 * @module components/rewards/my/RwCenter
 * @description 管理积分记录和兑换记录的Tab切换
 */

import { useState } from 'react'
import { Archive, ArrowLeft } from '@/components/icons'
import { PtRecord } from './PtRecord'
import { RwRecord } from './RwRecord'

/**
 * Tab类型
 * @type TabType
 */
type TabType = 'points' | 'rewards'

/**
 * Tab配置
 * @constant tabs
 */
const tabs: { key: TabType; label: string }[] = [
  { key: 'points', label: '灵感币记录' },
  { key: 'rewards', label: '兑换记录' },
]

/**
 * 历史记录主组件
 * @returns {JSX.Element} 历史记录组件
 */
export function RwCenter() {
  const [activeTab, setActiveTab] = useState<TabType>('points')

  return (
    <div className="max-w-6xl mx-auto fade-in-up px-6 md:px-10 pt-8 pb-12">
      {/* 页头 + 返回链接 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1 flex items-center gap-2">
            <Archive className="w-7 h-7 text-xf-primary" />
            历史记录
          </h1>
          <p className="text-xf-primary mt-1 text-sm">查看您的灵感币变动与兑换历史</p>
        </div>
        <a
          href="/rewards"
          className="text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> 返回福利中心
        </a>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
              activeTab === tab.key
                ? 'bg-xf-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="card-bg rounded-2xl p-6">
        {activeTab === 'points' ? <PtRecord /> : <RwRecord />}
      </div>

      {/* 底部留白 */}
      <div className="mt-8 text-center text-sm text-xf-primary">每一次记录都是成长的足迹</div>
    </div>
  )
}
