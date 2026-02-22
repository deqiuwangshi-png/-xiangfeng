'use client'

import { useState, useTransition } from 'react'

/**
 * 开关组件（Client Component）
 * 
 * 作用: 显示开关控件并处理开关状态切换
 * 
 * @param {boolean} checked - 开关是否选中
 * @param {function} onChange - 开关状态变化回调函数
 * @param {string} settingKey - 设置键（用于Server Actions）
 * @param {function} onServerAction - Server Action函数
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
 *   - 使用useTransition处理异步状态
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-22
 */

interface ToggleSwitchProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  settingKey?: string
  onServerAction?: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  disabled?: boolean
}

export function ToggleSwitch({ 
  checked, 
  onChange, 
  settingKey, 
  onServerAction, 
  disabled = false 
}: ToggleSwitchProps) {
  const [isPending, startTransition] = useTransition()
  const [localChecked, setLocalChecked] = useState(checked)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setLocalChecked(newChecked)

    if (onChange) {
      onChange(newChecked)
    }

    if (onServerAction && settingKey) {
      const formData = new FormData()
      formData.append('key', settingKey)
      formData.append('value', String(newChecked))

      startTransition(async () => {
        const result = await onServerAction(formData)
        if (!result.success) {
          console.error('更新设置失败:', result.error)
          setLocalChecked(!newChecked)
        }
      })
    }
  }

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={localChecked}
        onChange={handleChange}
        disabled={disabled || isPending}
      />
      <span className={`toggle-slider ${isPending ? 'opacity-50' : ''}`} />
    </label>
  )
}
