'use client'

import { Trash2 } from '@/components/icons'

/**
 * DraftsHeader Props 接口
 */
interface DraftsHeaderProps {
  /** 文章数量 */
  draftCount: number
  /** 清空文章按钮点击回调 */
  onClearAllDrafts: () => void
}

/**
 * DraftsHeader 组件
 *
 * @function DraftsHeader
 * @param {DraftsHeaderProps} props - 组件属性
 * @returns {JSX.Element} 文章页面头部组件
 *
 * @description
 * 纯展示组件，职责：
 * 1. 显示页面标题和文章数量
 * 2. 提供清空文章按钮
 *
 * 不管理任何状态，所有交互通过回调函数传递给父组件
 */
export function DraftsHeader({
  draftCount,
  onClearAllDrafts,
}: DraftsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-xf-border">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：标题和数量 */}
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-xf-primary bg-xf-subtle px-3 py-1.5 rounded-lg">
              文章管理
            </div>
            <span className="text-sm text-xf-medium ml-2">
              {draftCount} 篇文章
            </span>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-3">
            {/* 清空文章按钮 */}
            <button
              onClick={onClearAllDrafts}
              disabled={draftCount === 0}
              className="text-sm text-xf-danger hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">清空文章</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
