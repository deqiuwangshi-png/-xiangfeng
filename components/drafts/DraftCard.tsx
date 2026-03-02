'use client'

import { DraftData, DraftStatus } from '@/types/drafts'
import { Trash2 } from 'lucide-react'

/**
 * 草稿卡片组件属性
 */
interface DraftCardProps {
  draft: DraftData
  selected: boolean
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete?: (id: string) => void
}

/**
 * 草稿卡片组件
 * 
 * @function DraftCard
 * @param {DraftCardProps} props - 组件属性
 * @returns {JSX.Element} 草稿卡片组件
 * 
 * @description
 * 显示单个草稿的卡片，包含：
 * - 选择框（用于批量操作）
 * - 草稿标题
 * - 草稿摘要（最多2行）
 * - 状态标签（草稿/已发布/已归档）
 * - 更新日期
 * - 删除按钮
 * 
 * @data-source
 * docs/08原型文件设计图/草稿.html
 * 
 * @styles
 * - 卡片背景: white
 * - 卡片边框: 1px solid #E5E7EB
 * - 卡片圆角: 16px
 * - 卡片阴影默认: none
 * - 卡片阴影悬停: 0 20px 40px -15px rgba(58, 60, 110, 0.15)
 * - 卡片悬停位移: translateY(-6px)
 * - 卡片选中边框: #6A5B8A
 * - 卡片选中阴影: 0 0 0 2px rgba(106, 91, 138, 0.3)
 * - 标题文字: #25263D
 * - 摘要文字: #8C8EA9
 * - 日期文字: #8C8EA9
 * 
 * @interactions
 * - 点击卡片：进入编辑模式
 * - 点击选择框：切换选中状态
 * - 悬停卡片：显示阴影和上移效果
 * - 点击删除按钮：删除草稿
 */
export function DraftCard({
  draft,
  selected,
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
   * 根据草稿状态返回对应的样式
   * - 草稿: 橙色背景和文字
   * - 已发布: 绿色背景和文字
   * - 已归档: 灰色背景和文字
   */
  const getStatusBadgeStyles = (status: DraftStatus) => {
    switch (status) {
      case 'draft':
        return {
          bg: 'bg-xf-warning/10',
          text: 'text-xf-warning',
          label: '草稿',
        }
      case 'published':
        return {
          bg: 'bg-xf-success/10',
          text: 'text-xf-success',
          label: '已发布',
        }
      case 'archived':
        return {
          bg: 'bg-xf-medium/10',
          text: 'text-xf-medium',
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
   * 点击删除按钮删除草稿，阻止事件冒泡
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(draft.id)
    }
  }

  /**
   * 格式化日期
   * 
   * @function formatDate
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   * 
   * @description
   * 将日期字符串格式化为中文格式
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <div
      className={`
        draft-card bg-white border border-xf-border rounded-2xl p-5
        transition-all duration-300 ease-out cursor-pointer
        hover:shadow-elevated hover:-translate-y-1.5
        ${selected ? 'border-xf-primary shadow-[0_0_0_2px_rgba(106,91,138,0.3)]' : ''}
      `}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-4">
        {/* 选择框 */}
        <div
          className="pt-1"
          onClick={handleSelectClick}
        >
          <div
            className={`
              select-checkbox w-5 h-5 rounded-md border-2
              flex items-center justify-center cursor-pointer
              transition-all duration-200
              ${selected ? 'bg-xf-primary border-xf-primary' : 'border-gray-300 bg-transparent'}
            `}
          >
            {selected && (
              <span className="text-white text-xs font-bold">✓</span>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
            {/* LCP关键元素：标题使用系统字体优先，减少字体加载阻塞 */}
            <h3
              className="text-lg font-semibold text-xf-dark line-clamp-1"
              style={{ fontDisplay: 'swap', contentVisibility: 'auto' }}
            >
              {draft.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`
                status-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                ${statusStyles.bg} ${statusStyles.text}
              `}>
                {statusStyles.label}
              </span>
              {/* 删除按钮 */}
              <button
                onClick={handleDeleteClick}
                className="p-2 text-xf-medium hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LCP关键元素：摘要文本，使用will-change优化渲染性能 */}
          <p
            className="text-sm text-xf-medium mb-4 line-clamp-2"
            style={{ willChange: 'auto' }}
          >
            {draft.summary}
          </p>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="text-sm text-xf-medium">
              更新于 {formatDate(draft.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
