'use client'

/**
 * 编辑器工具栏组件
 * 
 * 作用: 提供编辑器的格式化工具栏
 * 
 * @param {() => void} onFormatText - 格式化文本处理函数
 * @param {() => void} onInsertLink - 插入链接处理函数
 * @param {() => void} onInsertImage - 插入图片处理函数
 * @param {() => void} onInsertList - 插入列表处理函数
 * @param {() => void} onClearFormatting - 清除格式处理函数
 * @param {() => void} onUndo - 撤销处理函数
 * @param {() => void} onRedo - 重做处理函数
 * @param {() => void} onFocusTitle - 聚焦标题处理函数
 * @param {() => void} onToggleFullscreen - 切换全屏处理函数
 * @param {() => void} onToggleToolbar - 切换工具栏处理函数
 * @param {boolean} isCollapsed - 工具栏是否折叠
 * 
 * @returns {JSX.Element} 编辑器工具栏组件
 * 
 * 使用说明:
 *   用于编辑器的浮动工具栏
 *   包含格式化工具、插入工具、编辑工具和视图工具
 *   支持折叠/展开功能
 * 
 * 交互说明:
 *   - 点击工具按钮触发相应的处理函数
 *   - 点击收起按钮折叠工具栏
 *   - 悬停时显示工具提示
 * 
 * 依赖:
 *   - lucide-react (图标组件)
 *   - react (React组件)
 *   - ToolbarButton (工具栏按钮组件)
 * 
 * 数据来源: docs/08原型文件设计图/发布.html
 * 
 * 更新时间: 2026-02-19
 */

import { Bold, Italic, Underline, Heading, Quote, Code, Link, Image, List, ListOrdered, Minus, Eraser, Undo, Redo, ArrowUpToLine, Maximize, ChevronDown } from 'lucide-react'
import { ToolbarButton } from './ToolbarButton'

/**
 * 编辑器工具栏属性接口
 * 
 * @interface EditorToolbarProps
 * @property {() => void} onFormatText - 格式化文本处理函数
 * @property {() => void} onInsertLink - 插入链接处理函数
 * @property {() => void} onInsertImage - 插入图片处理函数
 * @property {(type: string) => void} onInsertList - 插入列表处理函数
 * @property {() => void} onClearFormatting - 清除格式处理函数
 * @property {() => void} onUndo - 撤销处理函数
 * @property {() => void} onRedo - 重做处理函数
 * @property {() => void} onFocusTitle - 聚焦标题处理函数
 * @property {() => void} onToggleFullscreen - 切换全屏处理函数
 * @property {() => void} onToggleToolbar - 切换工具栏处理函数
 * @property {boolean} isCollapsed - 工具栏是否折叠
 */
interface EditorToolbarProps {
  onFormatText: (format: string) => void
  onInsertLink: () => void
  onInsertImage: () => void
  onInsertList: (type: string) => void
  onClearFormatting: () => void
  onUndo: () => void
  onRedo: () => void
  onFocusTitle: () => void
  onToggleFullscreen: () => void
  onToggleToolbar: () => void
  isCollapsed: boolean
}

/**
 * 编辑器工具栏组件
 * 
 * @function EditorToolbar
 * @param {EditorToolbarProps} props - 组件属性
 * @returns {JSX.Element} 编辑器工具栏组件
 * 
 * @description
 * 提供编辑器的格式化工具栏，包括：
 * - 格式化工具组（加粗、斜体、下划线）
 * - 标题工具组（标题、引用、代码）
 * - 插入工具组（链接、图片、列表）
 * - 编辑工具组（分割线、清除格式、撤销、重做）
 * - 视图工具组（跳转标题、全屏、收起工具栏）
 * 
 * @state
 * - isCollapsed: 工具栏是否折叠
 */
export function EditorToolbar({
  onFormatText,
  onInsertLink,
  onInsertImage,
  onInsertList,
  onClearFormatting,
  onUndo,
  onRedo,
  onFocusTitle,
  onToggleFullscreen,
  onToggleToolbar,
  isCollapsed,
}: EditorToolbarProps) {
  return (
    <div
      className={`fixed bottom-8 left-[calc(50%+160px)] -translate-x-1/2 bg-white/95 rounded-xl py-4 px-6 shadow-lg flex items-center gap-2 z-50 border border-xf-primary/8 backdrop-blur-md transition-all min-w-[min(90%,800px)] justify-center ${
        isCollapsed ? 'py-2 px-4 opacity-70 scale-95 hover:opacity-100 hover:scale-100' : ''
      }`}
    >
      {/* 格式化工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={Bold}
          tooltip="加粗"
          onClick={() => onFormatText('bold')}
          title="加粗 (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          tooltip="斜体"
          onClick={() => onFormatText('italic')}
          title="斜体 (Ctrl+I)"
        />
        <ToolbarButton
          icon={Underline}
          tooltip="下划线"
          onClick={() => onFormatText('underline')}
          title="下划线"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 标题工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={Heading}
          tooltip="标题"
          onClick={() => onFormatText('heading')}
          title="标题"
        />
        <ToolbarButton
          icon={Quote}
          tooltip="引用"
          onClick={() => onFormatText('quote')}
          title="引用"
        />
        <ToolbarButton
          icon={Code}
          tooltip="代码"
          onClick={() => onFormatText('code')}
          title="代码块"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 插入工具组 */}
      <div className={`flex gap-1 items-center ${isCollapsed ? 'hidden' : ''}`}>
        <ToolbarButton
          icon={Link}
          tooltip="链接"
          onClick={onInsertLink}
          title="链接 (Ctrl+K)"
        />
        <ToolbarButton
          icon={Image}
          tooltip="图片"
          onClick={onInsertImage}
          title="插入图片"
        />
        <ToolbarButton
          icon={List}
          tooltip="列表"
          onClick={() => onInsertList('ul')}
          title="无序列表"
        />
        <ToolbarButton
          icon={ListOrdered}
          tooltip="有序列表"
          onClick={() => onInsertList('ol')}
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
          onClick={() => onFormatText('hr')}
          title="分割线"
        />
        <ToolbarButton
          icon={Eraser}
          tooltip="清除格式"
          onClick={onClearFormatting}
          title="清除格式"
        />
        <ToolbarButton
          icon={Undo}
          tooltip="撤销"
          onClick={onUndo}
          title="撤销 (Ctrl+Z)"
        />
        <ToolbarButton
          icon={Redo}
          tooltip="重做"
          onClick={onRedo}
          title="重做 (Ctrl+Y)"
        />
      </div>

      {/* 分隔线 */}
      <div className={`w-px h-8 bg-linear-to-b from-transparent via-xf-light to-transparent mx-2 ${isCollapsed ? 'hidden' : ''}`} />

      {/* 视图工具组 */}
      <div className="flex gap-1 items-center">
        <ToolbarButton
          icon={ArrowUpToLine}
          tooltip="跳转到标题"
          onClick={onFocusTitle}
          title="跳转到标题"
        />
        <ToolbarButton
          icon={Maximize}
          tooltip={isCollapsed ? '展开' : '全屏'}
          onClick={onToggleFullscreen}
          title="全屏编辑 (F11)"
        />
        <ToolbarButton
          icon={ChevronDown}
          tooltip={isCollapsed ? '展开' : '收起'}
          onClick={onToggleToolbar}
          title="收起工具栏"
        />
      </div>
    </div>
  )
}
