'use client'

/**
 * 内容编辑器组件
 * 
 * 作用: 提供文章内容编辑功能
 * 
 * @param {string} value - 内容值
 * @param {(value: string) => void} onChange - 值变化处理函数
 * @param {React.RefObject<HTMLTextAreaElement>} textareaRef - 文本域引用
 * 
 * @returns {JSX.Element} 内容编辑器组件
 * 
 * 使用说明:
 *   用于编辑器的内容编辑区域
 *   支持Markdown格式
 *   最小高度60vh
 * 
 * 交互说明:
 *   - 输入时触发onChange事件
 *   - 焦点时显示背景高亮
 *   - 隐藏滚动条
 * 
 * 依赖:
 *   - react (React组件)
 * 
 * 数据来源: docs/08原型文件设计图/发布.html
 * 
 * 更新时间: 2026-02-19
 */

import { forwardRef, TextareaHTMLAttributes } from 'react'

/**
 * 内容编辑器属性接口
 * 
 * @interface ContentEditorProps
 * @property {string} value - 内容值
 * @property {(value: string) => void} onChange - 值变化处理函数
 */
interface ContentEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
}

/**
 * 内容编辑器组件
 * 
 * @function ContentEditor
 * @param {ContentEditorProps} props - 组件属性
 * @returns {JSX.Element} 内容编辑器组件
 * 
 * @description
 * 提供文章内容编辑功能，包括：
 * - 内容文本域
 * - 左侧渐变装饰线
 * - 焦点背景高亮
 * - 隐藏滚动条
 * 
 * @props
 * - value: 内容值
 * - onChange: 值变化处理函数
 */
export const ContentEditor = forwardRef<HTMLTextAreaElement, ContentEditorProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    }

    return (
      <div className="relative py-0">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-xf-primary via-xf-soft to-xf-accent rounded opacity-30" />
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          className="text-lg leading-[1.9] text-xf-dark border-none outline-none w-full min-h-[60vh] font-sans bg-transparent resize-none py-4 pl-6 font-normal overflow-y-auto no-scrollbar placeholder:opacity-30 placeholder:italic focus:bg-xf-light/30"
          placeholder="开始书写你的故事...（支持Markdown格式）"
          autoComplete="off"
          spellCheck
          
          maxLength={20000}
          {...props}
        />
      </div>
    )
  }
)

ContentEditor.displayName = 'ContentEditor'
