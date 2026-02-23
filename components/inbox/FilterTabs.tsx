'use client'

type FilterType = 'all' | 'unread' | 'mentions' | 'system'

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
      <span 
        className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'all' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('all')}
      >
        全部
      </span>
      <span 
        className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'unread' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('unread')}
      >
        未读
      </span>
      <span 
        className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'mentions' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('mentions')}
      >
        提及
      </span>
      <span 
        className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'system' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('system')}
      >
        系统
      </span>
    </div>
  )
}
