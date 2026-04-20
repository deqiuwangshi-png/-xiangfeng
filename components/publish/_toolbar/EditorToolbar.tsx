'use client'

/**
 * 编辑器工具栏组件
 *
 * 与 TipTap 编辑器集成
 * - 保持原有 UI 样式
 * - 通过 editor 实例操作编辑器
 * - 使用简单布局流，相对于内容区域居中定位
 */

import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import {
  Bold, Italic, Underline, Quote, Code,
  List, ListOrdered, Minus, Eraser, Undo, Redo, Heading, ArrowUpToLine, ChevronDown
} from '@/components/icons'
import { ToolbarButton } from './ToolbarButton'
import { runEditorCommand } from './editorCommands'

interface EditorToolbarProps {
  editor: Editor | null
  onFocusTitle: () => void
  onToggleToolbar: () => void
  isCollapsed: boolean
}

export function EditorToolbar({
  editor,
  onFocusTitle,
  onToggleToolbar,
  isCollapsed,
}: EditorToolbarProps) {

  // 撤销
  const handleUndo = () => {
    if (!editor) return
    editor.chain().focus().undo().run()
  }

  // 重做
  const handleRedo = () => {
    if (!editor) return
    editor.chain().focus().redo().run()
  }

  return (
    <div
      className={`bg-white/95 shadow-lg flex items-center gap-1 sm:gap-2 border border-xf-primary/8 backdrop-blur-md transition-all justify-center ${
        isCollapsed
          ? 'rounded-full p-2 min-w-0 opacity-80 hover:opacity-100'
          : 'rounded-xl py-2 px-2 sm:py-4 sm:px-6 w-full max-w-[calc(100vw-24px)] sm:max-w-[800px]'
      }`}
    >
      {/* 格式化工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={Bold}
          tooltip="加粗"
          onClick={() => runEditorCommand(editor, 'bold')}
          title="加粗 (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          tooltip="斜体"
          onClick={() => runEditorCommand(editor, 'italic')}
          title="斜体 (Ctrl+I)"
        />
        <ToolbarButton
          icon={Underline}
          tooltip="下划线"
          onClick={() => runEditorCommand(editor, 'underline')}
          title="下划线"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 标题工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <HeadingSelect editor={editor} />
        <ToolbarButton
          icon={Quote}
          tooltip="引用"
          onClick={() => runEditorCommand(editor, 'quote')}
          title="引用"
        />
        <ToolbarButton
          icon={Code}
          tooltip="行内代码"
          onClick={() => runEditorCommand(editor, 'code')}
          title="行内代码"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 插入工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={List}
          tooltip="列表"
          onClick={() => runEditorCommand(editor, 'bulletList')}
          title="无序列表"
        />
        <ToolbarButton
          icon={ListOrdered}
          tooltip="有序列表"
          onClick={() => runEditorCommand(editor, 'orderedList')}
          title="有序列表"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 编辑工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={Minus}
          tooltip="分割线"
          onClick={() => runEditorCommand(editor, 'hr')}
          title="分割线"
        />
        <ToolbarButton
          icon={Eraser}
          tooltip="清除格式"
          onClick={() => runEditorCommand(editor, 'clearFormatting')}
          title="清除格式"
        />
        <ToolbarButton
          icon={Undo}
          tooltip="撤销"
          onClick={handleUndo}
          title="撤销 (Ctrl+Z)"
        />
        <ToolbarButton
          icon={Redo}
          tooltip="重做"
          onClick={handleRedo}
          title="重做 (Ctrl+Y)"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 视图工具组 */}
      <div className="flex gap-1 items-center">
        {!isCollapsed && (
          <ToolbarButton
            icon={ArrowUpToLine}
            tooltip="跳转到标题"
            onClick={onFocusTitle}
            title="跳转到标题"
          />
        )}
        <ToolbarButton
          icon={ChevronDown}
          tooltip={isCollapsed ? '展开工具栏' : '收起工具栏'}
          onClick={onToggleToolbar}
          title={isCollapsed ? '展开工具栏' : '收起工具栏'}
        />
      </div>
    </div>
  )
}

const headingLevels = [
  { level: 1, label: 'H1', text: '一级标题' },
  { level: 2, label: 'H2', text: '二级标题' },
  { level: 3, label: 'H3', text: '三级标题' },
  { level: 4, label: 'H4', text: '四级标题' },
  { level: 5, label: 'H5', text: '五级标题' },
] as const

function HeadingSelect({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getActiveLevel = () => {
    if (!editor) return null
    for (let i = 1; i <= 5; i++) {
      if (editor.isActive('heading', { level: i })) return i
    }
    return null
  }

  const activeLevel = getActiveLevel()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (level: 1 | 2 | 3 | 4 | 5) => {
    if (!editor) return
    runEditorCommand(editor, `heading${level}` as const)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="标题"
        className={`relative py-2.5 px-2.5 rounded-xl text-xf-primary bg-xf-primary/5 border border-transparent cursor-pointer transition-all flex items-center justify-center gap-1 hover:bg-xf-primary/12 hover:border-xf-primary/20 hover:-translate-y-px hover:shadow-md ${
          activeLevel ? 'bg-xf-primary/15 text-xf-accent border-xf-primary/30' : ''
        }`}
      >
        <Heading className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-xf-light py-1 min-w-[80px] z-50">
          {headingLevels.map(({ level, label, text }) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-xf-primary/5 transition-colors flex items-center gap-2 ${
                activeLevel === level ? 'bg-xf-primary/10 text-xf-accent font-medium' : 'text-xf-dark'
              }`}
            >
              <span className="w-6 text-center font-bold">{label}</span>
              <span className="text-xs opacity-60">{text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
