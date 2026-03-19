'use client'

import { DraftFilter } from '@/types/drafts'

/**
 * 筛选器选项接口
 */
export interface FilterOption {
  value: DraftFilter
  label: string
}

/**
 * 筛选器组件属性
 */
interface FilterChipsProps {
  options: FilterOption[]
  activeFilter: DraftFilter
  onFilterChange: (filter: DraftFilter) => void
}

/**
 * 筛选器组件
 * 
 * @function FilterChips
 * @param {FilterChipsProps} props - 组件属性
 * @returns {JSX.Element} 筛选器组件
 * 
 * @description
 * 提供草稿状态筛选功能
 * @styles
 * @interactions
 * - 点击筛选器：切换激活状态
 * - 悬停筛选器：显示边框和文字颜色变化
 */
export function FilterChips({
  options,
  activeFilter,
  onFilterChange,
}: FilterChipsProps) {
  /**
   * 处理筛选器点击
   * 
   * @function handleFilterClick
   * @param {DraftFilter} filter - 筛选值
   * @returns {void}
   * 
   * @description
   * 点击筛选器切换激活状态
   */
  const handleFilterClick = (filter: DraftFilter) => {
    onFilterChange(filter)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 filter-chips">
      <div className="text-sm font-medium text-xf-dark mr-2">
        状态:
      </div>
      {options.map((option) => (
        <button
          key={option.value}
          className={`
            filter-chip text-xs sm:text-sm py-1.5 px-2.5 sm:py-2 sm:px-3
            ${activeFilter === option.value ? 'active' : ''}
          `}
          onClick={() => handleFilterClick(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
