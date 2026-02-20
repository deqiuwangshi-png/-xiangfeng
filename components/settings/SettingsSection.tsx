'use client'

import { ReactNode } from 'react'

/**
 * 设置区块组件（Client Component）
 * 
 * 作用: 显示设置区块并管理区块显示/隐藏
 * 
 * @param {string} id - 区块ID
 * @param {string} title - 区块标题
 * @param {ReactNode} children - 区块内容
 * @param {boolean} isVisible - 区块是否可见
 * @returns {JSX.Element} 设置区块组件
 * 
 * 使用说明:
 *   显示设置区块
 *   管理区块显示/隐藏
 *   处理区块标题
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 接收区块ID和标题
 *   - 管理显示状态
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-20
 */

interface SettingsSectionProps {
  id: string
  title: string
  children: ReactNode
  isVisible?: boolean
}

export function SettingsSection({ id, title, children, isVisible = true }: SettingsSectionProps) {
  if (!isVisible) {
    return null
  }

  return (
    <div id={id} className="space-y-8">
      <div className="card-bg rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-xf-accent font-bold text-layer-1 mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
