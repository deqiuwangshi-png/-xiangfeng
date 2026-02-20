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
 * 提供草稿状态筛选功能，包含：
 * - 状态标签（全部、草稿、已发布、已归档）
 * - 点击切换筛选状态
 * - 视觉反馈（激活状态）
 * 
 * @data-source
 * docs/08原型文件设计图/草稿.html
 * 
 * @styles
 * - 筛选器背景: #F7F9FC
 * - 筛选器边框: #E5E7EB
 * - 筛选器文字默认: #25263D
 * - 筛选器文字悬停: #6A5B8A
 * - 筛选器激活背景: #6A5B8A
 * - 筛选器激活文字: white
 * - 筛选器激活边框: #6A5B8A
 * - 筛选器内边距: 0.5rem 1rem
 * - 筛选器圆角: 9999px
 * 
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
    <div className="flex items-center gap-2 filter-chips">
      <div className="text-sm font-medium text-xf-dark mr-2">
        状态:
      </div>
      {options.map((option) => (
        <button
          key={option.value}
          className={`
            filter-chip
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
