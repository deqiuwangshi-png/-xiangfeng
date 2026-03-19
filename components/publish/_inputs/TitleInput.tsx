'use client'

/**
 * 标题输入组件
 * @param {string} value - 标题值
 * @param {(value: string) => void} onChange - 值变化处理函数
 * @param {React.RefObject<HTMLInputElement>} inputRef - 输入框引用
 * @returns {JSX.Element} 标题输入组件
 * 依赖:
 *   - react (React组件)
 * 更新时间: 2026-02-19
 */

import { forwardRef, InputHTMLAttributes } from 'react'

/**
 * 标题输入属性接口
 * @interface TitleInputProps
 * @property {string} value - 标题值
 * @property {(value: string) => void} onChange - 值变化处理函数
 */
interface TitleInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
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
 * - 标题输入框
 * - 字符计数提示
 * - 底部装饰线动画
 * 
 * @props
 * - value: 标题值
 * - onChange: 值变化处理函数
 */
export const TitleInput = forwardRef<HTMLInputElement, TitleInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    return (
      <div className="relative mb-6 sm:mb-10 pb-4 sm:pb-6">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          className="text-2xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight text-xf-dark border-none outline-none w-full font-serif bg-transparent py-2 tracking-[-0.02em] placeholder:opacity-25 placeholder:font-medium"
          placeholder="为你的文章起一个引人入胜的标题"
          autoComplete="off"
          spellCheck={false}
          maxLength={100}
          {...props}
        />
        {/* 装饰线 - 固定长度 */}
        <div className="absolute bottom-0 left-0 w-[60px] h-[2px] bg-linear-to-r from-xf-primary to-xf-accent" />
        <div className="absolute right-0 bottom-2 sm:bottom-4 text-xf-medium text-xs sm:text-sm pointer-events-none">
          最多100字
        </div>
      </div>
    )
  }
)

TitleInput.displayName = 'TitleInput'
