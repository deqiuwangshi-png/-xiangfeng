import { FileText } from '@/components/icons'
import { ReactNode } from 'react'

/**
 * 空状态组件 (Server Component)
 * @module components/drafts/card/EmptyState
 * @description 草稿列表空状态展示，服务端渲染
 * @优化说明 改为Server Component，action部分通过children传入
 */

interface EmptyStateProps {
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 操作区域（Client Component传入） */
  children?: ReactNode
}

/**
 * 空状态组件
 * @param {EmptyStateProps} props - 组件属性
 * @returns {JSX.Element} 空状态组件
 */
export function EmptyState({
  title = '暂无文章',
  description = '创建你的第一篇文章，开始记录灵感',
  children,
}: EmptyStateProps) {
  return (
    <div className="empty-state flex flex-col items-center justify-center py-16 text-center">
      <div className="empty-state-icon w-20 h-20 rounded-full bg-xf-primary/10 flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-xf-primary" />
      </div>
      <h3 className="text-lg font-medium text-xf-dark mb-2">{title}</h3>
      <p className="text-xf-medium mb-4">{description}</p>
      {children}
    </div>
  )
}
