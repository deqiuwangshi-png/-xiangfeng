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
 * - 无边界交互：通过底色微变和占位符变化提供反馈
 *
 * @props
 * - value: 标题值
 * - onChange: 值变化处理函数
 */
export const TitleInput = forwardRef<HTMLTextAreaElement, TitleInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
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
        (ref as React.RefObject<HTMLTextAreaElement | null>).current = element
      }
    }

    // 计算背景色状态
    const hasInteraction = isFocused || isHovered
    const showBackground = hasInteraction && !value

    return (
      <div className="relative mb-6 sm:mb-8 pl-3">
        {/* 标题输入区域 - 无边界设计 */}
        <div
          className={`relative rounded-lg transition-colors duration-200 ${
            showBackground ? 'bg-[#FAFAFB]' : 'bg-transparent'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <textarea
            ref={setRefs}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`text-xl sm:text-2xl md:text-3xl font-semibold leading-snug text-xf-dark w-full font-serif py-2 pr-16 tracking-[-0.01em] resize-none overflow-hidden
              border-0 outline-none ring-0 focus:ring-0 focus:border-0 focus:outline-none
              placeholder:font-normal
              ${isFocused ? 'placeholder:opacity-50' : 'placeholder:opacity-25'}
              ${hasInteraction ? 'placeholder:text-xf-medium' : 'placeholder:text-xf-dark'}
            `}
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
                ? 'text-xf-error'
                : 'text-xf-medium'
            }`}>
              {remainingChars}
            </div>
          )}
        </div>

        {/* 装饰性下划线 - 靠近标题文字，与侧边线对齐 */}
        <div className="mt-2 w-12 h-0.5 bg-linear-to-r from-xf-primary to-xf-accent rounded-full" />
      </div>
    )
  }
)

TitleInput.displayName = 'TitleInput'
