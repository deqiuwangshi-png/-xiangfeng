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
 * @param {function} onError - 错误回调函数
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
 * 更新时间: 2026-02-22
 */

interface ToggleSwitchProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  settingKey?: string
  onServerAction?: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  onError?: (error: string) => void
  disabled?: boolean
}

export function ToggleSwitch({
  checked,
  onChange,
  settingKey,
  onServerAction,
  onError,
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
        try {
          const result = await onServerAction(formData)
          if (!result.success) {
            {/* 失败时回滚状态 */}
            setLocalChecked(!newChecked)
            {/* 调用错误回调 */}
            if (onError) {
              onError(result.error || '更新失败')
            }
          }
        } catch {
           {/* 异常时回滚状态 */}
            setLocalChecked(!newChecked)
           if (onError) {
             onError('更新失败，请稍后重试')
           }
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
