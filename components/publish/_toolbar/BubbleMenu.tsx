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
  List, ListOrdered, Eraser, Heading1, Heading2,
  Heading3
} from '@/components/icons'
import { ToolbarButton } from './ToolbarButton'
import { Heading4, Heading5, Type } from 'lucide-react'

/**
 * 预设颜色列表
 */
const PRESET_COLORS = [
  { name: '默认', value: '' },
  { name: '红色', value: '#ef4444' },
  { name: '橙色', value: '#f97316' },
  { name: '黄色', value: '#eab308' },
  { name: '绿色', value: '#22c55e' },
  { name: '青色', value: '#06b6d4' },
  { name: '蓝色', value: '#3b82f6' },
  { name: '紫色', value: '#8b5cf6' },
  { name: '粉色', value: '#ec4899' },
  { name: '灰色', value: '#6b7280' },
]

/**
 * 颜色选择器组件
 */
function ColorPicker({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!editor) return null

  const currentColor = editor.getAttributes('textStyle').color || ''

  const handleColorSelect = (color: string) => {
    if (color) {
      editor.chain().focus().setColor(color).run()
    } else {
      editor.chain().focus().unsetColor().run()
    }
    setIsOpen(false)
  }

  return (
    <div ref={pickerRef} className="relative">
      <ToolbarButton
        icon={Type}
        tooltip="文字颜色"
        onClick={() => setIsOpen(!isOpen)}
        title="文字颜色"
        isActive={!!currentColor}
        size="sm"
        style={currentColor ? { color: currentColor } : undefined}
      />
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-xf-light/50 p-2 flex flex-wrap gap-1 w-[140px] animate-in fade-in zoom-in-95 duration-150">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value || 'default'}
              onClick={() => handleColorSelect(color.value)}
              className={`w-6 h-6 rounded-md border transition-all hover:scale-110 ${
                currentColor === color.value
                  ? 'border-xf-primary ring-2 ring-xf-primary/30'
                  : 'border-gray-200 hover:border-xf-primary/50'
              }`}
              style={{
                backgroundColor: color.value || '#1f2937',
                backgroundImage: color.value
                  ? 'none'
                  : 'linear-gradient(45deg, transparent 45%, #ef4444 45%, #ef4444 55%, transparent 55%)',
              }}
              title={color.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}

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

      // 检查是否选中了图片节点，如果是则不显示 BubbleMenu
      // 使用 isActive 更可靠地检测图片选中状态
      if (editor.isActive('image')) {
        setIsVisible(false)
        return
      }

      // 额外检查：获取当前选区的节点类型
      const { from, to } = editor.state.selection
      const node = editor.state.doc.nodeAt(from)
      if (node?.type.name === 'image') {
        setIsVisible(false)
        return
      }

      // 检查选区是否跨多个节点且包含图片
      if (from !== to) {
        const endNode = editor.state.doc.nodeAt(to - 1)
        if (endNode?.type.name === 'image') {
          setIsVisible(false)
          return
        }
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
   * 切换标题级别
   *
   * @param level - 标题级别 1-5
   */
  const handleToggleHeading = (level: 1 | 2 | 3 | 4 | 5) => {
    if (!editor) return
    // 如果当前已经是该级别标题，则转换为普通段落
    if (editor.isActive('heading', { level })) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level }).run()
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

      {/* 标题级别 */}
      <ToolbarButton
        icon={Heading1}
        tooltip="标题1"
        onClick={() => handleToggleHeading(1)}
        title="H1"
        isActive={editor.isActive('heading', { level: 1 })}
        size="sm"
      />
      <ToolbarButton
        icon={Heading2}
        tooltip="标题2"
        onClick={() => handleToggleHeading(2)}
        title="H2"
        isActive={editor.isActive('heading', { level: 2 })}
        size="sm"
      />
         <ToolbarButton
        icon={Heading3}
        tooltip="标题3"
        onClick={() => handleToggleHeading(3)}
        title="H3"
        isActive={editor.isActive('heading', { level: 3 })}
        size="sm"
      />
      <ToolbarButton
        icon={Heading4}
        tooltip="标题4"
        onClick={() => handleToggleHeading(4)}
        title="H4"
        isActive={editor.isActive('heading', { level: 4 })}
        size="sm"
      />
      <ToolbarButton
        icon={Heading5}
        tooltip="标题5"
        onClick={() => handleToggleHeading(5)}
        title="H5"
        isActive={editor.isActive('heading', { level: 5 })}
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

      {/* 文字颜色 */}
      <ColorPicker editor={editor} />

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
