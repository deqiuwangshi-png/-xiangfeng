'use client'

/**
 * 标题输入组件
 * @param {string} value - 标题值
 * @param {(value: string) => void} onChange - 值变化处理函数
 * @param {React.RefObject<HTMLTextAreaElement>} textareaRef - 文本域引用
 * @returns {JSX.Element} 标题输入组件
 * 依赖:
 *   - react (React组件)
 * 更新时间: 2026-02-19
 */

import { forwardRef, TextareaHTMLAttributes, useState, useRef, useEffect } from 'react'

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
 * 提供文章标题输入功能，包括：
 * - 多行标题输入（textarea）
 * - 自动高度调整
 * - 动态字数提示（超过80字时显示）
 * - 聚焦时底部边框
 *
 * @props
 * - value: 标题值
 * - onChange: 值变化处理函数
 */
export const TitleInput = forwardRef<HTMLTextAreaElement, TitleInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
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

    // 合并 ref
    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = element
      }
    }

    return (
      <div className="relative mb-8 sm:mb-12">
        {/* 标题输入区域 */}
        <div className="relative">
          <textarea
            ref={setRefs}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-xf-dark border-none outline-none w-full font-serif bg-transparent py-3 pr-16 tracking-[-0.02em] placeholder:opacity-25 placeholder:font-normal resize-none overflow-hidden"
            placeholder="文章标题"
            autoComplete="off"
            spellCheck={false}
            maxLength={100}
            rows={1}
            {...props}
          />

          {/* 字数提示 - 固定在右下角 */}
          {showHint && (
            <div className={`absolute right-0 bottom-3 text-xs transition-colors ${
              remainingChars <= 10
                ? 'text-xf-error'
                : 'text-xf-medium'
            }`}>
              {remainingChars}
            </div>
          )}
        </div>

        {/* 底部边框 - 聚焦时显示 */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-300 ${
            isFocused
              ? 'bg-xf-primary/30'
              : 'bg-transparent'
          }`}
        />
      </div>
    )
  }
)

TitleInput.displayName = 'TitleInput'
