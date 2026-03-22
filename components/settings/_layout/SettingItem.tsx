'use client'

import { ReactNode } from 'react'

/**
 * 设置项组件（Client Component）
 * 
 * 作用: 显示单个设置项并支持不同类型的设置项
 * 
 * @param {string} label - 设置项标签
 * @param {string} description - 设置项描述
 * @param {ReactNode} control - 设置项控件
 * @param {string} controlPosition - 控件位置（left或right）
 * @returns {JSX.Element} 设置项组件
 * 
 * 使用说明:
 *   显示单个设置项
 *   支持不同类型的设置项（按钮、开关、选择器）
 *   处理设置项交互
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 接收设置项配置
 *   - 支持多种交互类型
 * 更新时间: 2026-02-20
 */

interface SettingItemProps {
  label: string
  description?: string
  control: ReactNode
  controlPosition?: 'left' | 'right'
  controlType?: 'button' | 'toggle' | 'select'
}

export function SettingItem({ label, description, control, controlPosition = 'right', controlType = 'toggle' }: SettingItemProps) {
  const labelMargin = controlType === 'button' ? 'mb-2' : 'mb-1'
  const alignItems = controlType === 'button' ? 'md:items-start' : 'md:items-center'

  return (
    <div className="setting-item">
      <div className={`flex flex-col ${alignItems} md:flex-row justify-between gap-4 ${controlPosition === 'left' ? 'flex-row-reverse' : ''}`}>
        <div className="md:w-2/3">
          <h3 className={`text-lg font-bold text-xf-dark ${labelMargin} text-layer-1`}>
            {label}
          </h3>
          {description && (
            <p className="text-sm text-xf-medium">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {control}
        </div>
      </div>
    </div>
  )
}
