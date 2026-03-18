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
import {
  Bold, Italic, Underline, Quote, Code,
  List, ListOrdered, Minus, Eraser, Undo, Redo,
  ArrowUpToLine, ChevronDown
} from '@/components/icons'
import { ToolbarButton } from './ToolbarButton'
import { HeadingSelect } from './HeadingSelect'

interface EditorToolbarProps {
  editor: Editor | null
  onFocusTitle: () => void
  onToggleFullscreen: () => void
  onToggleToolbar: () => void
  isCollapsed: boolean
}

export function EditorToolbar({
  editor,
  onFocusTitle,
  onToggleToolbar,
  isCollapsed,
}: EditorToolbarProps) {

  // 格式化文本
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
      case 'hr':
        editor.chain().focus().setHorizontalRule().run()
        break
    }
  }



  // 插入列表
  const handleInsertList = (type: 'ul' | 'ol') => {
    if (!editor) return
    if (type === 'ul') {
      editor.chain().focus().toggleBulletList().run()
    } else {
      editor.chain().focus().toggleOrderedList().run()
    }
  }

  // 清除格式
  const handleClearFormatting = () => {
    if (!editor) return
    editor.chain().focus().clearNodes().unsetAllMarks().run()
  }

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
      className={`bg-white/95 shadow-lg flex items-center gap-2 border border-xf-primary/8 backdrop-blur-md transition-all justify-center ${
        isCollapsed
          ? 'rounded-full p-2 min-w-0 opacity-80 hover:opacity-100'
          : 'rounded-xl py-4 px-6 w-full max-w-[800px]'
      }`}
    >
      {/* 格式化工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={Bold}
          tooltip="加粗"
          onClick={() => handleFormatText('bold')}
          title="加粗 (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          tooltip="斜体"
          onClick={() => handleFormatText('italic')}
          title="斜体 (Ctrl+I)"
        />
        <ToolbarButton
          icon={Underline}
          tooltip="下划线"
          onClick={() => handleFormatText('underline')}
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
          onClick={() => handleFormatText('quote')}
          title="引用"
        />
        <ToolbarButton
          icon={Code}
          tooltip="行内代码"
          onClick={() => handleFormatText('code')}
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
          onClick={() => handleInsertList('ul')}
          title="无序列表"
        />
        <ToolbarButton
          icon={ListOrdered}
          tooltip="有序列表"
          onClick={() => handleInsertList('ol')}
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
          onClick={() => handleFormatText('hr')}
          title="分割线"
        />
        <ToolbarButton
          icon={Eraser}
          tooltip="清除格式"
          onClick={handleClearFormatting}
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
