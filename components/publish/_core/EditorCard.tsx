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

import { forwardRef } from 'react'
import { Editor } from '@tiptap/react'
import { TitleInput } from '../_inputs/TitleInput'
import { CharacterCounter } from './CharacterCounter'
import { EditorContent } from '@tiptap/react'

interface EditorCardProps {
  title: string
  onTitleChange: (title: string) => void
  titleRef: React.Ref<HTMLInputElement>
  titleLength: number
  contentLength: number
  editor: Editor | null
  isMounted: boolean
  /** 点击占位区域时的回调，用于引导用户开始输入 */
  onPlaceholderClick?: () => void
  /** 是否启用专注模式（无边框、全宽） */
  isFocusMode?: boolean
}

export const EditorCard = forwardRef<HTMLDivElement, EditorCardProps>(
  ({ title, onTitleChange, titleRef, titleLength, contentLength, editor, isMounted, onPlaceholderClick, isFocusMode = false }, ref) => {
    return (
      <div
        ref={ref}
        className={`transition-all relative overflow-hidden slide-up ${
          isFocusMode
            ? 'bg-transparent p-0'
            : 'bg-white rounded-[20px] border border-xf-light p-4 sm:p-6 md:p-10'
        }`}
        style={isFocusMode ? undefined : { boxShadow: '0 8px 40px rgba(106, 91, 138, 0.08)' }}
      >
        {/* 顶部装饰条 - 专注模式下隐藏 */}
        {!isFocusMode && (
          <div className="absolute top-0 left-0 right-0 bg-xf-primary rounded-t-[20px]" style={{ height: '4px' }} />
        )}

        {/* 标题输入 - 保持原有组件 */}
        <TitleInput
          ref={titleRef}
          value={title}
          onChange={onTitleChange}
        />

        {/* 内容编辑器 - TipTap */}
        <div className={`relative py-0 ${isFocusMode ? 'px-0' : ''}`}>
          {/* 左侧装饰线 - 专注模式下隐藏 */}
          {!isFocusMode && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-xf-primary via-xf-soft to-xf-accent rounded opacity-30" />
          )}

          {!isMounted ? (
            // SSR 占位，避免水合错误
            <div
              className={`min-h-[300px] sm:min-h-[400px] py-4 text-base sm:text-lg leading-[1.9] text-xf-dark cursor-text ${
                isFocusMode ? 'pl-0 bg-transparent' : 'pl-4 sm:pl-6 bg-white rounded-lg'
              }`}
              onClick={onPlaceholderClick}
            >
              <span className="opacity-30 italic">点击这里开始书写你的故事...（支持Markdown格式）</span>
            </div>
          ) : (
            <EditorContent
              editor={editor}
              className={`text-base sm:text-lg leading-[1.9] text-xf-dark py-4 min-h-[300px] sm:min-h-[400px] prose prose-base sm:prose-lg max-w-none outline-none ${
                isFocusMode ? 'pl-0 bg-transparent' : 'pl-4 sm:pl-6 bg-white rounded-lg'
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
)

EditorCard.displayName = 'EditorCard'
