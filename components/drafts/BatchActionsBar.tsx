'use client'

/**
 * 批量操作栏组件属性
 */
interface BatchActionsBarProps {
  selectedCount: number
  visible: boolean
  onDelete: () => void
  onPublish: () => void
  onArchive: () => void
  onCancel: () => void
}

/**
 * 批量操作栏组件
 * 
 * @function BatchActionsBar
 * @param {BatchActionsBarProps} props - 组件属性
 * @returns {JSX.Element} 批量操作栏组件
 * 
 * @description

 * @styles

 * @interactions
 * - 显示/隐藏：根据选中状态自动显示或隐藏
 * - 点击删除：批量删除选中的草稿
 * - 点击发布：批量发布选中的草稿
 * - 点击归档：批量归档选中的草稿
 * - 点击取消：取消所有选择
 */
export function BatchActionsBar({
  selectedCount,
  visible,
  onDelete,
  onPublish,
  onArchive,
  onCancel,
}: BatchActionsBarProps) {
  if (!visible) {
    return null
  }

  return (
    <div
      className={`
        batch-actions-bar fixed bottom-8 left-1/2 -translate-x-1/2
        bg-white border border-xf-primary/10 rounded-2xl
        px-6 py-4 shadow-deep backdrop-blur-md
        flex items-center gap-4 z-50
        ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'}
        transition-all duration-300
      `}
    >
      {/* 已选择数量 */}
      <div className="text-sm font-medium text-xf-dark">
        <span id="batch-selected-count">{selectedCount}</span> 篇草稿已选中
      </div>

      {/* 删除按钮 */}
      <button
        onClick={onDelete}
        className="action-btn p-2 text-xf-danger hover:bg-red-50"
        title="删除选中的草稿"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* 发布按钮 */}
      <button
        onClick={onPublish}
        className="action-btn p-2 text-xf-success hover:bg-green-50"
        title="发布选中的草稿"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>

      {/* 归档按钮 */}
      <button
        onClick={onArchive}
        className="action-btn p-2 text-xf-medium hover:bg-xf-subtle"
        title="归档选中的草稿"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </button>

      {/* 取消选择按钮 */}
      <button
        onClick={onCancel}
        className="text-sm text-xf-medium hover:text-xf-dark px-3 py-1.5"
        title="取消选择"
      >
        取消选择
      </button>
    </div>
  )
}
