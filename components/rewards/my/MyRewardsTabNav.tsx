'use client'

/**
 * Tab导航客户端组件
 * @module components/rewards/my/MyRewardsTabNav
 * @description 历史记录Tab导航，使用URL参数切换
 * @优化说明 使用URL参数替代useState，支持Server Component获取数据
 */

import { useRouter, useSearchParams } from 'next/navigation'

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

interface MyRewardsTabNavProps {
  /** 当前激活的Tab */
  activeTab: TabType
}

/**
 * Tab导航客户端组件
 * @param {MyRewardsTabNavProps} props - 组件属性
 * @returns {JSX.Element} Tab导航
 */
export function MyRewardsTabNav({ activeTab }: MyRewardsTabNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * 处理Tab切换
   * @param {TabType} tab - 目标Tab
   */
  const handleTabChange = (tab: TabType) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', tab)
    router.push(`/rewards/my?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200 pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabChange(tab.key)}
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
  )
}
