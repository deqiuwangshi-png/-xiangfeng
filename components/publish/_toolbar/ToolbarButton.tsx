'use client'

/**
 * 工具栏按钮组件
 * 
 * 作用: 提供编辑器工具栏的单个按钮功能
 * 
 * @param {React.ElementType} icon - 图标组件
 * @param {string} tooltip - 工具提示文本
 * @param {() => void} onClick - 点击事件处理函数
 * @param {boolean} isActive - 是否激活状态
 * 
 * @returns {JSX.Element} 工具栏按钮组件
 * 
 * 使用说明:
 *   用于编辑器工具栏中的单个按钮
 *   支持图标、工具提示和激活状态
 *   悬停时显示工具提示
 * 更新时间: 2026-02-19
 */

import { LucideIcon } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

/**
 * 工具栏按钮属性接口
 * 
 * @interface ToolbarButtonProps
 * @property {React.ElementType} icon - 图标组件
 * @property {string} tooltip - 工具提示文本
 * @property {() => void} onClick - 点击事件处理函数
 * @property {boolean} isActive - 是否激活状态
 * @property {string} title - HTML title属性（用于辅助功能）
 * @property {'sm' | 'md'} size - 按钮尺寸
 */
interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  tooltip: string
  onClick: () => void
  isActive?: boolean
  size?: 'sm' | 'md'
}

/**
 * 工具栏按钮组件
 * 
 * @function ToolbarButton
 * @param {ToolbarButtonProps} props - 组件属性
 * @returns {JSX.Element} 工具栏按钮组件
 * 
 * @description
 * 提供编辑器工具栏的单个按钮功能，包括：
 * - 图标显示
 * - 工具提示（Tooltip）
 * - 激活状态样式
 * - 悬停效果
 */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon: Icon, tooltip, onClick, isActive = false, title, size = 'md', ...props }, ref) => {
    const sizeClasses = size === 'sm'
      ? 'p-1.5 rounded-md'
      : 'p-1.5 sm:py-2.5 sm:px-2.5 rounded-lg sm:rounded-xl'

    const iconSizeClasses = size === 'sm'
      ? 'w-3.5 h-3.5'
      : 'w-3.5 h-3.5 sm:w-4 sm:h-4'

    return (
      <button
        ref={ref}
        onClick={onClick}
        title={title || tooltip}
        className={`relative ${sizeClasses} text-xf-primary bg-xf-primary/5 border border-transparent cursor-pointer transition-all flex items-center justify-center hover:bg-xf-primary/12 hover:border-xf-primary/20 hover:-translate-y-px hover:shadow-md ${
          isActive ? 'bg-xf-primary/15 text-xf-accent border-xf-primary/30' : ''
        }`}
        {...props}
      >
        <Icon className={iconSizeClasses} />
        <span className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1.25 bg-xf-dark text-white py-1 px-3 rounded-lg text-xs whitespace-nowrap opacity-0 invisible transition-all pointer-events-none z-50 font-medium mb-2 shadow-lg">
          {tooltip}
        </span>
      </button>
    )
  }
)

ToolbarButton.displayName = 'ToolbarButton'
