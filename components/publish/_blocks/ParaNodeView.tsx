'use client'

/**
 * 段落节点视图组件
 * @module ParaNodeView
 * @description TipTap 段落节点的自定义视图，支持拖拽排序
 *
 * 功能：
 * - 自定义段落渲染
 * - 拖拽手柄控制排序
 * - 悬停显示拖拽手柄
 * - 选中状态显示
 */

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { DragHandle } from '../_core/DragHandle'

/**
 * 段落节点视图
 *
 * @param props - NodeView 属性
 * @returns 段落节点 JSX
 */
export function ParaNodeView(props: NodeViewProps) {
  const { selected, editor, getPos } = props
  const [isHovered, setIsHovered] = useState(false)

  /**
   * 处理拖拽开始
   * @param e - 拖拽事件
   */
  const handleDragStart = (e: React.DragEvent) => {
    const pos = getPos()
    if (pos === undefined || pos < 0) {
      return
    }

    // 获取段落的起始位置（使用 resolve 找到段落边界）
    const $pos = editor.state.doc.resolve(pos)
    const paragraphStart = $pos.before($pos.depth)

    // 设置拖拽数据（使用段落起始位置）
    e.dataTransfer.setData('application/x-prosemirror-node', String(paragraphStart))
    e.dataTransfer.effectAllowed = 'move'

    // 使用 setTimeout 延迟添加样式，避免 flushSync 冲突
    setTimeout(() => {
      editor.view.dom.classList.add('dragging')
    }, 0)
  }

  /**
   * 处理拖拽结束
   */
  const handleDragEnd = () => {
    // 使用 setTimeout 延迟移除样式，避免 flushSync 冲突
    setTimeout(() => {
      editor.view.dom.classList.remove('dragging')
    }, 0)
  }

  // 显示手柄条件：选中或悬停
  const showHandle = selected || isHovered

  return (
    <NodeViewWrapper
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 拖拽手柄 */}
      <DragHandle
        visible={showHandle}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* 段落内容 */}
      <div
        className={`relative transition-all duration-200 ${
          selected ? 'bg-blue-50/30 rounded px-1 -mx-1' : ''
        }`}
      >
        <NodeViewContent className="prose-p:my-0" />
      </div>
    </NodeViewWrapper>
  )
}
