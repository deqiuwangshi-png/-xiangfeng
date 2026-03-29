/**
 * 筛选按钮组件
 * 
 * 作用: 显示更新日志的筛选按钮
 * 
 * @param {FilterType} type - 筛选类型
 * @param {string} label - 按钮文本
 * @param {boolean} isActive - 是否激活
 * @param {(type: FilterType) => void} onClick - 点击回调
 * @returns {JSX.Element} 筛选按钮组件
 * 
 * 使用说明:
 *   用于更新日志页面的筛选功能
 *   支持全部更新、新功能、改进优化、问题修复四种类型
 * 
 * 更新时间: 2026-02-19
 */

import { FilterType } from '@/types/user/updates'

/**
 * 筛选按钮组件
 * 
 * @function FilterButton
 * @param {Object} props - 组件属性
 * @param {FilterType} props.type - 筛选类型
 * @param {string} props.label - 按钮文本
 * @param {boolean} props.isActive - 是否激活
 * @param {(type: FilterType) => void} props.onClick - 点击回调
 * @returns {JSX.Element} 筛选按钮组件
 * 
 * @description
 * 显示更新日志的筛选按钮，支持四种筛选类型
 * 
 * @styles
 * - 激活状态：bg-xf-accent text-white
 * - 未激活状态：bg-white border border-xf-light text-xf-dark
 * - 圆角：rounded-lg
 * - 尺寸：px-4 py-2
 * - 字号：text-sm
 * - 字重：font-medium
 */
export function FilterButton({
  type,
  label,
  isActive,
  onClick
}: {
  type: FilterType
  label: string
  isActive: boolean
  onClick: (type: FilterType) => void
}) {
  return (
    <button
      onClick={() => onClick(type)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-xf-accent text-white'
          : 'bg-white border border-xf-light text-xf-dark hover:bg-xf-light'
      }`}
    >
      {label}
    </button>
  )
}
