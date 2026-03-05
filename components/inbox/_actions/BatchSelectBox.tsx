'use client'

/**
 * 批量选择复选框组件属性接口
 * @interface BatchSelectBoxProps
 * @property {boolean} isSelected - 是否被选中
 * @property {(selected: boolean) => void} onSelect - 选择状态变化回调
 */
interface BatchSelectBoxProps {
  isSelected: boolean
  onSelect: (selected: boolean) => void
}

/**
 * 批量选择复选框组件
 * @description 批量模式下通知卡片的选择复选框
 * @param {BatchSelectBoxProps} props - 组件属性
 * @returns {JSX.Element} 复选框组件
 */
export function BatchSelectBox({ isSelected, onSelect }: BatchSelectBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.checked)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="shrink-0 flex items-center">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
        onClick={handleClick}
        className="w-4 h-4 rounded border-gray-300 text-xf-primary focus:ring-xf-primary"
      />
    </div>
  )
}
