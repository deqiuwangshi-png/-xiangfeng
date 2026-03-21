'use client'

/**
 * 编辑器卡片组件
 *
 * 已集成 TipTap 富文本编辑器
 * - 保持原有 UI 样式
 * - 功能通过 TipTap 实现
 * - 避免 SSR 水合错误
 * - 采用单向数据流，TipTap 作为唯一数据源
 */

import { Editor } from '@tiptap/react'
import { TitleInput } from '../_inputs/TitleInput'
import { CharacterCounter } from './CharacterCounter'
import { EditorContent } from '@tiptap/react'

interface EditorCardProps {
  title: string
  onTitleChange: (title: string) => void
  titleLength: number
  contentLength: number
  editor: Editor | null
  isMounted: boolean
  /** 是否启用专注模式（无边框、全宽） */
  isFocusMode?: boolean
}

/**
 * 编辑器卡片组件
 *
 * @function EditorCard
 * @param {EditorCardProps} props - 组件属性
 * @returns {JSX.Element} 编辑器卡片组件
 *
 * @description
 * 提供完整的文章编辑界面，包括：
 * - 标题输入区域
 * - 富文本内容编辑区
 * - 字符计数显示
 * - 专注模式支持
 */
export function EditorCard({
  title,
  onTitleChange,
  titleLength,
  contentLength,
  editor,
  isMounted,
  isFocusMode = false,
}: EditorCardProps) {
  return (
    <div
      className={`transition-all relative overflow-hidden slide-up w-full ${
        isFocusMode
          ? 'bg-transparent p-0'
          : 'bg-white rounded-[20px] border border-gray-200 p-4 sm:p-6 md:p-10'
      }`}
      style={isFocusMode ? undefined : { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
    >
      {/* 顶部装饰条 - 专注模式下隐藏 */}
      {!isFocusMode && (
        <div className="absolute top-0 left-0 right-0 bg-gray-400 rounded-t-[20px]" style={{ height: '4px' }} />
      )}

      {/* 标题输入 - 保持原有组件 */}
      <div className={isFocusMode ? 'max-w-4xl mx-auto' : ''}>
        <TitleInput
          value={title}
          onChange={onTitleChange}
        />
      </div>

      {/* 内容编辑器 - TipTap */}
      <div className={`relative py-0 overflow-hidden ${isFocusMode ? 'px-0' : ''} ${isFocusMode ? 'max-w-4xl mx-auto' : ''}`}>
        {/* 左侧装饰线 - 专注模式下隐藏，与文字严格对齐 */}
        {!isFocusMode && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 rounded opacity-40" />
        )}

        {!isMounted ? (
          // SSR 占位，避免水合错误 - 与装饰线严格对齐
          <div
            className={`min-h-[300px] sm:min-h-[400px] py-4 text-lg leading-relaxed text-gray-900 cursor-text overflow-hidden ${
              isFocusMode ? 'pl-0 bg-transparent' : 'pl-3 bg-white rounded-lg'
            }`}
          >
            <span className="opacity-30 italic">输入 / 唤起命令菜单，或开始书写...</span>
          </div>
        ) : (
          <EditorContent
            editor={editor}
            className={`text-lg leading-relaxed text-gray-900 py-4 min-h-[300px] sm:min-h-[400px] prose prose-lg max-w-none outline-none overflow-hidden ${
              isFocusMode ? 'pl-0 bg-transparent' : 'pl-3 bg-white rounded-lg'
            }`}
          />
        )}
      </div>

      {/* 字符计数 - 专注模式下隐藏 */}
      {!isFocusMode && (
        <CharacterCounter titleLength={titleLength} contentLength={contentLength} />
      )}
    </div>
  )
}
