import { Bell } from '@/components/icons'

interface EmptyStateProps {
  title?: string
  description?: string
}

/**
 * 空状态组件 - 服务端组件
 * ✅ 纯展示，无客户端交互
 * ✅ 服务端渲染
 */
export function EmptyState({
  title = '暂无通知',
  description = '当有新消息时，会显示在这里',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bell className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-500 mb-2">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
