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
import { EditorContent } from '@tiptap/react'

interface EditorCardProps {
  title: string
  onTitleChange: (title: string) => void
  titleLength: number
  contentLength: number
  editor: Editor | null
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
      <div className={`relative py-0 ${isFocusMode ? 'px-0' : ''} ${isFocusMode ? 'max-w-4xl mx-auto' : ''}`}>
        {/* 左侧装饰线 - 专注模式下隐藏，与文字严格对齐 */}
        {!isFocusMode && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 rounded opacity-40" />
        )}

        <div
          className={`min-h-[300px] sm:min-h-[400px] py-4 text-lg leading-relaxed text-gray-900 cursor-text ${
            isFocusMode ? 'pl-0 bg-transparent' : 'pl-3 bg-white rounded-lg'
          }`}
        >
          <EditorContent
            editor={editor}
            className={`article-content article-content-editor max-w-none outline-none`}
          />
        </div>
      </div>

      {/* 字符计数 - 专注模式下隐藏 */}
      {!isFocusMode && (
        <CharacterCounter titleLength={titleLength} contentLength={contentLength} />
      )}
    </div>
  )
}

interface CharacterCounterProps {
  titleLength: number
  contentLength: number
}

function CharacterCounter({ titleLength, contentLength }: CharacterCounterProps) {
  const totalLength = titleLength + contentLength

  const getCounterClass = () => {
    if (totalLength > 20000) return 'text-red-500 font-medium'
    if (totalLength > 15000) return 'text-red-500 font-medium'
    if (totalLength > 10000) return 'text-xf-warning'
    if (totalLength > 5000) return 'text-xf-warning'
    if (totalLength < 500) return 'text-xf-warning'
    return ''
  }

  const getHint = () => {
    if (totalLength === 0) return '建议字数：500-5000字'
    if (totalLength > 20000) return '已超过最大字数限制'
    if (totalLength > 15000) return '接近字数上限'
    if (totalLength > 10000) return '字数较多，建议精简'
    if (totalLength > 5000) return '字数适中'
    if (totalLength < 500) return '内容较短，建议充实'
    return '字数合适'
  }

  return (
    <div className={`text-xf-medium text-sm py-4 px-6 flex items-center justify-between border-t border-xf-light mt-6 ${getCounterClass()}`}>
      <span id="char-count">{totalLength}</span>
      <span>字</span>
      <span className="text-xs opacity-70" id="content-hint">{getHint()}</span>
    </div>
  )
}
