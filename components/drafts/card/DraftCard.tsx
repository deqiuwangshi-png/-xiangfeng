'use client'

import { DraftData, DraftStatus, ViewMode } from '@/types/drafts'
import { Trash2, Edit3 } from '@/components/icons'

/**
 * 草稿卡片组件属性
 */
interface DraftCardProps {
  draft: DraftData
  selected: boolean
  viewMode: ViewMode
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete?: (id: string, title: string) => void
}

/**
 * 草稿卡片组件
 *
 * @function DraftCard
 * @param {DraftCardProps} props - 组件属性
 * @returns {JSX.Element} 草稿卡片组件
 *
 * @description
 * 支持双模式（卡片/列表）的草稿展示组件
 * - 卡片模式：适合灵感预览，悬浮显示操作按钮
 * - 列表模式：适合快速处理大量文章
 *
 * @interactions
 * - 悬浮时显示"继续编辑"按钮
 * - 默认隐藏删除按钮，保持界面安静
 */
export function DraftCard({
  draft,
  selected,
  viewMode,
  onSelect,
  onEdit,
  onDelete,
}: DraftCardProps) {
  /**
   * 获取状态标签样式
   *
   * @function getStatusBadgeStyles
   * @param {DraftStatus} status - 草稿状态
   * @returns {Object} 状态标签样式对象
   *
   * @description
   * Swiss Style：浅灰色背景 + 深色文字
   * 去除彩色标签，保持界面安静
   */
  const getStatusBadgeStyles = (status: DraftStatus) => {
    switch (status) {
      case 'draft':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: '草稿',
        }
      case 'published':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: '已发布',
        }
      case 'archived':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: '已归档',
        }
    }
  }

  const statusStyles = getStatusBadgeStyles(draft.status)

  /**
   * 处理卡片点击
   *
   * @function handleCardClick
   * @returns {void}
   *
   * @description
   * 点击卡片进入编辑模式
   */
  const handleCardClick = () => {
    onEdit(draft.id)
  }

  /**
   * 处理选择框点击
   *
   * @function handleSelectClick
   * @param {React.MouseEvent} e - 鼠标事件
   * @returns {void}
   *
   * @description
   * 点击选择框切换选中状态，阻止事件冒泡
   */
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(draft.id)
  }

  /**
   * 处理删除点击
   *
   * @function handleDeleteClick
   * @param {React.MouseEvent} e - 鼠标事件
   * @returns {void}
   *
   * @description
   * 点击删除按钮触发删除弹窗，阻止事件冒泡
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(draft.id, draft.title)
    }
  }

  /**
   * 处理编辑点击
   *
   * @function handleEditClick
   * @param {React.MouseEvent} e - 鼠标事件
   * @returns {void}
   *
   * @description
   * 点击编辑按钮进入编辑模式，阻止事件冒泡
   */
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(draft.id)
  }

  /**
   * 格式化日期
   *
   * @function formatDate
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   *
   * @description
   * 将日期字符串格式化为简洁格式
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * 列表模式渲染
   *
   * @function renderListMode
   * @returns {JSX.Element} 列表模式卡片
   *
   * @description
   * 紧凑的列表布局，适合快速处理大量文章
   * Swiss Style：高对比度标题，弱化正文
   */
  const renderListMode = () => (
    <div
      className={`
        draft-card group bg-white border border-gray-200 rounded-xl p-4
        transition-all duration-200 ease-out cursor-pointer
        ${selected ? 'border-gray-400 bg-gray-50' : ''}
      `}
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-4">
        {/* 选择框 */}
        <div onClick={handleSelectClick}>
          <div
            className={`
              select-checkbox w-5 h-5 rounded border-2
              flex items-center justify-center cursor-pointer
              transition-all duration-200
              ${selected ? 'bg-gray-800 border-gray-800' : 'border-gray-300 bg-transparent hover:border-gray-400'}
            `}
          >
            {selected && <span className="text-white text-xs font-bold">✓</span>}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {/* 标题 - Swiss Style：加粗 */}
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {draft.title || '无标题'}
            </h3>

            {/* 状态标签 - Swiss Style：浅灰背景 */}
            <span className={`
              status-badge inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${statusStyles.bg} ${statusStyles.text}
            `}>
              {statusStyles.label}
            </span>

            {/* 悬浮操作按钮组 */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto">
              <button
                onClick={handleEditClick}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="继续编辑"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 摘要 - Swiss Style：减淡 */}
          <p className="text-sm text-gray-400 mt-1 line-clamp-1">
            {draft.summary}
          </p>
        </div>

        {/* 日期 */}
        <div className="text-sm text-gray-400 whitespace-nowrap">
          {formatDate(draft.updatedAt)}
        </div>
      </div>
    </div>
  )

  /**
   * 卡片模式渲染
   *
   * @function renderGridMode
   * @returns {JSX.Element} 卡片模式卡片
   *
   * @description
   * 适合灵感预览的卡片布局
   * 悬浮时显示"继续编辑"按钮
   */
  const renderGridMode = () => (
    <div
      className={`
        draft-card group bg-white border border-gray-200 rounded-2xl p-5
        transition-all duration-300 ease-out cursor-pointer relative
        ${selected ? 'border-gray-400 bg-gray-50' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* 悬浮编辑按钮 - 默认隐藏，悬浮时显示 */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
        <button
          onClick={handleEditClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-md hover:bg-gray-800 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          继续编辑
        </button>
      </div>

      <div className="flex items-start gap-4">
        {/* 选择框 */}
        <div
          className="pt-1"
          onClick={handleSelectClick}
        >
          <div
            className={`
              select-checkbox w-5 h-5 rounded border-2
              flex items-center justify-center cursor-pointer
              transition-all duration-200
              ${selected ? 'bg-gray-800 border-gray-800' : 'border-gray-300 bg-transparent hover:border-gray-400'}
            `}
          >
            {selected && <span className="text-white text-xs font-bold">✓</span>}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2 mb-3">
            {/* 标题和状态行 */}
            <div className="flex items-start justify-between gap-2 pr-24">
              {/* 标题 - Swiss Style：加粗 */}
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {draft.title || '无标题'}
              </h3>
            </div>

            {/* 状态标签 - Swiss Style：浅灰背景 */}
            <span className={`
              status-badge inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-medium
              ${statusStyles.bg} ${statusStyles.text}
            `}>
              {statusStyles.label}
            </span>
          </div>

          {/* 摘要 - Swiss Style：减淡 */}
          <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {draft.summary}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              更新于 {formatDate(draft.updatedAt)}
            </div>

            {/* 悬浮删除按钮 */}
            <button
              onClick={handleDeleteClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return viewMode === 'list' ? renderListMode() : renderGridMode()
}
