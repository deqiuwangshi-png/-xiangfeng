'use client'

/**
 * 拖拽手柄组件
 * @module DragHandle
 * @description TipTap 编辑器节点拖拽手柄，支持拖拽排序
 *
 * 功能：
 * - 显示拖拽指示器（⋮⋮）
 * - 支持鼠标拖拽排序
 * - 悬停时显示，平时隐藏
 * - 瑞士设计风格
 */

import { GripVertical } from 'lucide-react'

/**
 * 拖拽手柄属性接口
 * @interface DragHandleProps
 */
interface DragHandleProps {
  /** 是否可见 */
  visible: boolean
  /** 拖拽开始回调 */
  onDragStart: (e: React.DragEvent) => void
  /** 拖拽结束回调 */
  onDragEnd?: (e: React.DragEvent) => void
}

/**
 * 拖拽手柄组件
 *
 * @function DragHandle
 * @param {DragHandleProps} props - 组件属性
 * @returns {JSX.Element} 拖拽手柄
 *
 * @description
 * 提供节点拖拽功能的手柄按钮：
 * - 悬停时显示在节点左侧
 * - 点击并拖动可调整节点顺序
 * - 采用瑞士设计风格，简洁无装饰
 */
export function DragHandle({ visible, onDragStart, onDragEnd }: DragHandleProps) {
  return (
    <div
      className={`absolute -left-8 top-1/2 -translate-y-1/2 flex items-center justify-center
                 w-6 h-8 rounded cursor-grab active:cursor-grabbing
                 transition-all duration-200 z-10
                 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-drag-handle
      title="拖拽移动"
    >
      <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
    </div>
  )
}
