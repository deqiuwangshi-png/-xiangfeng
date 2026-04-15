'use client'

import { type FilterType } from '@/types/notification'

const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'mention', label: '提及' },
  { key: 'system', label: '系统' },
]

interface FilterTabsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex gap-1 mb-8 border-b border-gray-200 pb-1">
      {filterTabs.map((tab) => (
        <span
          key={tab.key}
          data-filter={tab.key}
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
