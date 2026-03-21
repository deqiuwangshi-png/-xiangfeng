'use client'

/**
 * 标题输入组件
 * @param {string} value - 标题值
 * @param {(value: string) => void} onChange - 值变化处理函数
 * @returns {JSX.Element} 标题输入组件
 * 依赖:
 *   - react (React组件)
 * 更新时间: 2026-02-19
 */

import { TextareaHTMLAttributes, useRef, useEffect } from 'react'

/**
 * 标题输入属性接口
 * @interface TitleInputProps
 * @property {string} value - 标题值
 * @property {(value: string) => void} onChange - 值变化处理函数
 */
interface TitleInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
}

/**
 * 标题输入组件
 *
 * @function TitleInput
 * @param {TitleInputProps} props - 组件属性
 * @returns {JSX.Element} 标题输入组件
 *
 * @description
 * 提供文章标题输入功能，采用瑞士设计风格：
 * - 多行标题输入（textarea）
 * - 自动高度调整，自然撑开无固定高度
 * - 动态字数提示（超过80字时显示）
 * - 零边框设计：无outline、无border、无ring
 * - 无焦点反馈：仅通过光标指示焦点状态
 *
 * @props
 * - value: 标题值
 * - onChange: 值变化处理函数
 */
export function TitleInput({ value, onChange, ...props }: TitleInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /**
   * 处理输入变化
   *
   * @param e - 输入事件
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  /**
   * 自动调整 textarea 高度
   * 确保标题框随内容自然撑开，无固定高度约束
   */
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // 重置高度以获取正确的 scrollHeight
    textarea.style.height = 'auto'
    // 设置新高度（加上一点缓冲避免滚动条）
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  // 根据字数决定是否显示提示
  const showHint = value.length > 80
  const remainingChars = 100 - value.length

  return (
    <div className="relative mb-6 sm:mb-8 pl-3">
      {/* 标题输入区域 - 纯无边界设计，瑞士风格 */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug text-gray-900 w-full font-serif py-2 pr-16 tracking-[-0.01em] resize-none overflow-hidden bg-transparent
            border-none outline-none ring-0 shadow-none
            focus:border-none focus:outline-none focus:ring-0 focus:shadow-none
            focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none
            active:border-none active:outline-none active:ring-0 active:shadow-none
            placeholder:font-normal placeholder:text-gray-400 placeholder:opacity-40
            transition-all duration-200"
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
          placeholder="文章标题"
          autoComplete="off"
          spellCheck={false}
          maxLength={100}
          rows={1}
          {...props}
        />

        {/* 字数提示 - 固定在右下角 */}
        {showHint && (
          <div className={`absolute right-0 bottom-2 text-xs transition-colors ${
            remainingChars <= 10
              ? 'text-red-500'
              : 'text-gray-400'
          }`}>
            {remainingChars}
          </div>
        )}
      </div>

      {/* 装饰性下划线 - 极简视觉锚点，非功能性边框 */}
      <div className="mt-3 w-16 h-px bg-gray-200 rounded-full transition-all duration-300" />
    </div>
  )
}
