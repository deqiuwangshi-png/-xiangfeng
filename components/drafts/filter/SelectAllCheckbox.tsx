'use client'

import { Check } from 'lucide-react'
import type { DraftSelection } from '@/types/drafts'

/**
 * SelectAllCheckbox Props 接口
 */
interface SelectAllCheckboxProps {
  /** 选择状态 */
  selection: DraftSelection
  /** 选中数量 */
  selectedCount: number
  /** 切换全选回调 */
  onToggle: () => void
}

/**
 * SelectAllCheckbox 组件
 *
 * @function SelectAllCheckbox
 * @param {SelectAllCheckboxProps} props - 组件属性
 * @returns {JSX.Element} 全选复选框组件
 *
 * @description
 * 纯展示组件，显示全选复选框和选中数量
 * 支持三种状态：未选中、部分选中、全部选中
 */
export function SelectAllCheckbox({
  selection,
  selectedCount,
  onToggle,
}: SelectAllCheckboxProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* 复选框 */}
        <button
          onClick={onToggle}
          className={`
            w-5 h-5 rounded-md border-2
            flex items-center justify-center
            transition-all duration-200
            ${selection.isAllSelected
              ? 'bg-xf-primary border-xf-primary'
              : selection.isPartiallySelected
                ? 'bg-xf-primary/50 border-xf-primary'
                : 'border-gray-300 bg-transparent hover:border-xf-primary/50'
            }
          `}
          aria-label={selection.isAllSelected ? '取消全选' : '全选'}
        >
          {selection.isAllSelected && (
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          )}
          {selection.isPartiallySelected && (
            <div className="w-2 h-0.5 bg-white rounded-full" />
          )}
        </button>
        <span className="text-sm text-xf-medium">全选</span>
      </div>

      {/* 选中数量 */}
      <div className="text-sm text-xf-medium hidden md:block">
        <span className="font-medium text-xf-dark">{selectedCount}</span> 篇选中
      </div>
    </div>
  )
}
