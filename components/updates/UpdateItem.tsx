/**
 * 更新条目组件
 * 
 * 作用: 显示单个更新条目
 * 
 * @param {UpdateItem} item - 更新条目数据
 * @returns {JSX.Element} 更新条目组件
 * 
 * 使用说明:
 *   用于版本卡片中的单个更新条目
 *   显示更新类型标签和描述
 * 
 * 样式特点:
 *   - 布局：flex items-start gap-3
 *   - 标签：根据类型显示不同颜色
 *   - 描述：text-sm text-xf-dark
 * 
 * 更新时间: 2026-02-19
 */

import { UpdateItem } from '@/types/updates'
import { UPDATE_TYPE_STYLES } from '@/constants/updates'

/**
 * 更新条目组件
 * 
 * @function UpdateItemComponent
 * @param {Object} props - 组件属性
 * @param {UpdateItem} props.item - 更新条目数据
 * @returns {JSX.Element} 更新条目组件
 * 
 * @description
 * 显示单个更新条目，包含类型标签和描述
 * 
 * @styles
 * - 布局：flex items-start gap-3
 * - 标签：根据类型显示不同颜色
 *   - 新功能：bg-green-50 text-green-700
 *   - 改进：bg-blue-50 text-blue-700
 *   - 修复：bg-red-50 text-red-700
 * - 标签尺寸：px-2 py-1 text-xs font-medium rounded
 * - 标签上边距：mt-0.5
 * - 标签不换行：whitespace-nowrap
 * - 描述：text-sm text-xf-dark
 */
export function UpdateItemComponent({ item }: { item: UpdateItem }) {
  const style = UPDATE_TYPE_STYLES[item.type]

  return (
    <div className="flex items-start gap-3">
      <span className={`inline-block px-2 py-1 ${style.bg} ${style.text} text-xs font-medium rounded whitespace-nowrap mt-0.5`}>
        {style.label}
      </span>
      <span className="text-sm text-xf-dark">{item.description}</span>
    </div>
  )
}
