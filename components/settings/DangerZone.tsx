'use client'

import { ReactNode } from 'react'

/**
 * 危险区域组件（Client Component）
 * @param {string} title - 危险区域标题
 * @param {ReactNode} children - 危险区域内容
 * @returns {JSX.Element} 危险区域组件
 * 架构说明:
 *   - 使用'use client'指令
 *   - 接收危险操作配置
 *   - 使用Server Action执行危险操作
 * 更新时间: 2026-02-20
 */

interface DangerZoneProps {
  title: string
  children: ReactNode
}

export function DangerZone({ title, children }: DangerZoneProps) {
  return (
    <div className="danger-zone rounded-2xl p-8 mt-12">
      <h2 className="text-2xl font-serif text-red-600 font-bold text-layer-1 mb-6">
        {title}
      </h2>
      {children}
    </div>
  )
}
