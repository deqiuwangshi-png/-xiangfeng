'use client'

import { Trash2, LayoutGrid, List } from '@/components/icons'
import type { ViewMode } from '@/types/drafts'

/**
 * DraftsHeader Props 接口
 */
interface DraftsHeaderProps {
  /** 当前筛选条件下的文章总数 */
  articleCount: number
  /** 草稿数量（用于清空草稿按钮禁用状态） */
  draftCount: number
  /** 清空草稿按钮点击回调 */
  onClearAllDrafts: () => void
  /** 当前视图模式 */
  viewMode: ViewMode
  /** 视图模式切换回调 */
  onViewModeChange: (mode: ViewMode) => void
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
 * 1. 显示页面标题和草稿数量
 * 2. 提供视图模式切换（列表/卡片）
 * 3. 提供清空草稿按钮（仅删除状态为 draft 的文章）
 *
 * 不管理任何状态，所有交互通过回调函数传递给父组件
 */
export function DraftsHeader({
  articleCount,
  draftCount,
  onClearAllDrafts,
  viewMode,
  onViewModeChange,
}: DraftsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：标题和数量 */}
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
              文章管理
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {articleCount} 篇文章
            </span>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-3">
            {/* 视图模式切换 */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="卡片视图"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="列表视图"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* 清空草稿按钮 */}
            <button
              onClick={onClearAllDrafts}
              disabled={draftCount === 0}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">清空草稿</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
