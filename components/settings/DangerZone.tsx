'use client'

import { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface DangerZoneProps {
  children: ReactNode
  title?: string
}

/**
 * 危险操作区域布局组件
 * 
 * 用于包裹删除账户、停用账户等危险操作
 */
export function DangerZone({ children, title = '危险区域' }: DangerZoneProps) {
  return (
    <div className="card-bg rounded-2xl p-6 border border-red-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-700 mb-4">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}
