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

import { useState, useCallback, useMemo } from 'react'
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
  const handleDragStart = useCallback((e: React.DragEvent) => {
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

    // 直接添加样式，避免 setTimeout 延迟
    if (editor.view && editor.view.dom) {
      editor.view.dom.classList.add('dragging')
    }
  }, [editor, getPos])

  /**
   * 处理拖拽结束
   */
  const handleDragEnd = useCallback(() => {
    // 直接移除样式，避免 setTimeout 延迟
    if (editor.view && editor.view.dom) {
      editor.view.dom.classList.remove('dragging')
    }
  }, [editor])

  // 缓存显示手柄的条件
  const showHandle = useMemo(() => selected || isHovered, [selected, isHovered])

  // 缓存鼠标事件处理函数
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  return (
    <NodeViewWrapper
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 拖拽手柄 */}
      <DragHandle
        visible={showHandle}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* 段落内容 */}
      <div
        className={`relative ${
          selected ? 'bg-blue-50/30 rounded px-1 -mx-1' : ''
        }`}
      >
        <NodeViewContent className="prose-p:my-0" />
      </div>
    </NodeViewWrapper>
  )
}
