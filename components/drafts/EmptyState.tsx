'use client'

interface EmptyStateProps {
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
}

export function EmptyState({
  title = '暂无草稿',
  description = '创建你的第一篇草稿，开始记录灵感',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state flex flex-col items-center justify-center py-16 text-center">
      <div className="empty-state-icon w-20 h-20 rounded-full bg-xf-primary/10 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-xf-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-xf-dark mb-2">{title}</h3>
      <p className="text-xf-medium mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-xf-primary text-white px-6 py-2 rounded-lg hover:bg-xf-accent transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}
