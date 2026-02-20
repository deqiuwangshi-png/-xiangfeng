'use client'

/**
 * 开关组件（Client Component）
 * 
 * 作用: 显示开关控件并处理开关状态切换
 * 
 * @param {boolean} checked - 开关是否选中
 * @param {function} onChange - 开关状态变化回调函数
 * @param {boolean} disabled - 开关是否禁用
 * @returns {JSX.Element} 开关组件
 * 
 * 使用说明:
 *   显示开关控件
 *   处理开关状态切换
 *   调用Server Action更新设置
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 接收当前状态和设置键
 *   - 使用Server Action更新数据
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-20
 */

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-slider" />
    </label>
  )
}
