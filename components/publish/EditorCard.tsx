'use client'

/**
 * 编辑器卡片组件
 * 
 * 作用: 提供编辑器的主要卡片容器
 * 
 * @param {string} title - 标题值
 * @param {(title: string) => void} onTitleChange - 标题变化处理函数
 * @param {React.Ref<HTMLInputElement>} titleRef - 标题输入框引用
 * @param {string} content - 内容值
 * @param {(content: string) => void} onContentChange - 内容变化处理函数
 * @param {React.Ref<HTMLTextAreaElement>} contentRef - 内容编辑器引用
 * @param {number} contentLength - 内容字符数
 * 
 * @returns {JSX.Element} 编辑器卡片组件
 * 
 * 使用说明:
 *   用于编辑器的主要卡片容器
 *   包含标题输入、内容编辑器和字符计数
 *   支持顶部装饰条和动画效果
 * 
 * 交互说明:
 *   - 标题和内容输入时触发相应的处理函数
 *   - 显示字符计数
 * 
 * 依赖:
 *   - react (React组件)
 *   - TitleInput (标题输入组件)
 *   - ContentEditor (内容编辑器组件)
 *   - CharacterCounter (字符计数组件)
 * 更新时间: 2026-02-19
 */

import { forwardRef } from 'react'
import { TitleInput } from './TitleInput'
import { ContentEditor } from './ContentEditor'
import { CharacterCounter } from './CharacterCounter'

/**
 * 编辑器卡片属性接口
 * 
 * @interface EditorCardProps
 * @property {string} title - 标题值
 * @property {(title: string) => void} onTitleChange - 标题变化处理函数
 * @property {React.Ref<HTMLInputElement>} titleRef - 标题输入框引用
 * @property {string} content - 内容值
 * @property {(content: string) => void} onContentChange - 内容变化处理函数
 * @property {React.Ref<HTMLTextAreaElement>} contentRef - 内容编辑器引用
 * @property {number} titleLength - 标题字符数
 * @property {number} contentLength - 内容字符数
 */
interface EditorCardProps {
  title: string
  onTitleChange: (title: string) => void
  titleRef: React.Ref<HTMLInputElement>
  content: string
  onContentChange: (content: string) => void
  contentRef: React.Ref<HTMLTextAreaElement>
  titleLength: number
  contentLength: number
}

/**
 * 编辑器卡片组件
 * 
 * @function EditorCard
 * @param {EditorCardProps} props - 组件属性
 * @returns {JSX.Element} 编辑器卡片组件
 * 
 * @description
 * 提供编辑器的主要卡片容器，包括：
 * - 顶部装饰条
 * - 标题输入
 * - 内容编辑器
 * - 字符计数
 * - 动画效果
 * 
 * @props
 * - title: 标题值
 * - onTitleChange: 标题变化处理函数
 * - titleRef: 标题输入框引用
 * - content: 内容值
 * - onContentChange: 内容变化处理函数
 * - contentRef: 内容编辑器引用
 * - titleLength: 标题字符数
 * - contentLength: 内容字符数
 */
export const EditorCard = forwardRef<HTMLDivElement, EditorCardProps>(
  ({ title, onTitleChange, titleRef, content, onContentChange, contentRef, titleLength, contentLength }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white rounded-[20px] border border-xf-light p-10 transition-all relative overflow-hidden slide-up"
        style={{ boxShadow: '0 8px 40px rgba(106, 91, 138, 0.08)' }}
      >
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 bg-xf-primary rounded-t-[20px]" style={{ height: '4px' }} />

        {/* 标题输入 */}
        <TitleInput
          ref={titleRef}
          value={title}
          onChange={onTitleChange}
        />

        {/* 内容编辑器 */}
        <ContentEditor
          ref={contentRef}
          value={content}
          onChange={onContentChange}
        />

        {/* 字符计数 */}
        <CharacterCounter titleLength={titleLength} contentLength={contentLength} />
      </div>
    )
  }
)

EditorCard.displayName = 'EditorCard'
