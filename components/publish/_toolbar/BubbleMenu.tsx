'use client'

/**
 * 浮动气泡菜单组件
 *
 * 选中文本时在光标附近显示的格式化工具栏
 * 实现"工具随手动"的交互体验
 *
 * @module BubbleMenu
 */

import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Quote, Code,
  List, ListOrdered, Eraser
} from '@/components/icons'
import { ToolbarButton } from './ToolbarButton'

interface BubbleMenuProps {
  editor: Editor | null
}

/**
 * 浮动气泡菜单组件
 *
 * @param props - 组件属性
 * @returns 气泡菜单JSX
 */
export function BubbleMenu({ editor }: BubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!editor) return

    /**
     * 更新气泡菜单位置
     */
    const updatePosition = () => {
      const { empty } = editor.state.selection

      if (empty) {
        setIsVisible(false)
        return
      }

      // 获取选区的 DOM 范围
      const view = editor.view
      const { ranges } = editor.state.selection
      const fromPos = ranges[0].$from.pos
      const toPos = ranges[0].$to.pos

      // 获取选区的坐标
      const startCoords = view.coordsAtPos(fromPos)
      const endCoords = view.coordsAtPos(toPos)

      // 计算气泡菜单位置（选区上方居中）
      const centerX = (startCoords.left + endCoords.right) / 2
      const topY = startCoords.top

      setPosition({ x: centerX, y: topY })
      setIsVisible(true)
    }

    // 监听选区变化
    editor.on('selectionUpdate', updatePosition)
    editor.on('update', updatePosition)

    // 点击外部隐藏
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // 延迟检查，避免点击按钮时立即隐藏
        setTimeout(() => {
          const { empty } = editor.state.selection
          if (empty) {
            setIsVisible(false)
          }
        }, 100)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('update', updatePosition)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editor])

  if (!editor || !isVisible) return null

  /**
   * 处理文本格式化
   *
   * @param format - 格式化类型
   */
  const handleFormatText = (format: string) => {
    if (!editor) return

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
      case 'quote':
        editor.chain().focus().toggleBlockquote().run()
        break
      case 'code':
        editor.chain().focus().toggleCode().run()
        break
    }
  }

  /**
   * 插入列表
   *
   * @param type - 列表类型
   */
  const handleInsertList = (type: 'ul' | 'ol') => {
    if (!editor) return
    if (type === 'ul') {
      editor.chain().focus().toggleBulletList().run()
    } else {
      editor.chain().focus().toggleOrderedList().run()
    }
  }

  /**
   * 清除格式
   */
  const handleClearFormatting = () => {
    if (!editor) return
    editor.chain().focus().clearNodes().unsetAllMarks().run()
  }

  // 计算菜单位置，确保不超出视口
  const menuWidth = 280 // 预估菜单宽度
  const menuHeight = 44 // 预估菜单高度
  const padding = 8

  let left = position.x - menuWidth / 2
  let top = position.y - menuHeight - padding

  // 边界检查
  if (typeof window !== 'undefined') {
    if (left < padding) left = padding
    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding
    }
    if (top < padding) {
      // 如果上方空间不足，显示在选区下方
      top = position.y + padding + 20
    }
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white/98 shadow-xl rounded-lg border border-xf-light/50 backdrop-blur-sm py-1.5 px-2 flex items-center gap-0.5 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left,
        top,
        boxShadow: '0 4px 20px rgba(106, 91, 138, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* 基础格式化 */}
      <ToolbarButton
        icon={Bold}
        tooltip="加粗"
        onClick={() => handleFormatText('bold')}
        title="加粗 (Ctrl+B)"
        isActive={editor.isActive('bold')}
        size="sm"
      />
      <ToolbarButton
        icon={Italic}
        tooltip="斜体"
        onClick={() => handleFormatText('italic')}
        title="斜体 (Ctrl+I)"
        isActive={editor.isActive('italic')}
        size="sm"
      />
      <ToolbarButton
        icon={Underline}
        tooltip="下划线"
        onClick={() => handleFormatText('underline')}
        title="下划线"
        isActive={editor.isActive('underline')}
        size="sm"
      />

      {/* 分隔线 */}
      <div className="w-px h-5 bg-xf-light/80 mx-1" />

      {/* 块级格式 */}
      <ToolbarButton
        icon={Quote}
        tooltip="引用"
        onClick={() => handleFormatText('quote')}
        title="引用"
        isActive={editor.isActive('blockquote')}
        size="sm"
      />
      <ToolbarButton
        icon={Code}
        tooltip="行内代码"
        onClick={() => handleFormatText('code')}
        title="行内代码"
        isActive={editor.isActive('code')}
        size="sm"
      />

      {/* 分隔线 */}
      <div className="w-px h-5 bg-xf-light/80 mx-1" />

      {/* 列表 */}
      <ToolbarButton
        icon={List}
        tooltip="无序列表"
        onClick={() => handleInsertList('ul')}
        title="无序列表"
        isActive={editor.isActive('bulletList')}
        size="sm"
      />
      <ToolbarButton
        icon={ListOrdered}
        tooltip="有序列表"
        onClick={() => handleInsertList('ol')}
        title="有序列表"
        isActive={editor.isActive('orderedList')}
        size="sm"
      />

      {/* 分隔线 */}
      <div className="w-px h-5 bg-xf-light/80 mx-1" />

      {/* 清除格式 */}
      <ToolbarButton
        icon={Eraser}
        tooltip="清除格式"
        onClick={handleClearFormatting}
        title="清除格式"
        size="sm"
      />
    </div>
  )
}
