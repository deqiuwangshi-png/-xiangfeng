'use client'

import { type FilterType } from '@/types/notification'

/**
 * 筛选标签配置
 * @description 定义筛选标签的显示文本和对应值
 */
const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'mention', label: '提及' },
  { key: 'system', label: '系统' },
]

/**
 * 筛选标签组件属性接口
 * @interface FilterTabsProps
 * @property {FilterType} activeFilter - 当前激活的筛选类型
 * @property {(filter: FilterType) => void} onFilterChange - 筛选变化回调函数
 */
interface FilterTabsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

/**
 * 筛选标签组件
 * @description 消息页面筛选标签栏
 * @param {FilterTabsProps} props - 组件属性
 * @returns {JSX.Element} 筛选标签JSX
 */
export function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex gap-1 mb-8 border-b border-gray-200 pb-1">
      {filterTabs.map((tab) => (
        <span
          key={tab.key}
          className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
            activeFilter === tab.key
              ? 'bg-xf-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange(tab.key)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  )
}
