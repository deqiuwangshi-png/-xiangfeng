'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

/**
 * 极简搜索框组件
 * @description 点击搜索图标向左平滑展开输入框，类似Mac系统搜索体验
 * @param {Object} props - 组件属性
 * @param {string} [props.placeholder] - 输入框占位文本
 * @param {(value: string) => void} [props.onSearch] - 搜索回调函数
 */
interface SearchBoxProps {
  placeholder?: string
  onSearch?: (value: string) => void
}

export function SearchBox({ 
  placeholder = '搜索文章...', 
  onSearch 
}: SearchBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 展开时自动聚焦输入框
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // 点击外部收起搜索框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded && !value) {
          setIsExpanded(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded, value])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setValue('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && onSearch) {
      onSearch(value.trim())
    }
  }

  const handleClear = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-end"
    >
      <form 
        onSubmit={handleSubmit}
        className={`
          flex items-center overflow-hidden
          border border-xf-medium/30 rounded-xl
          bg-white/80 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isExpanded ? 'w-48 sm:w-64' : 'w-10'}
        `}
      >
        {/* 搜索图标按钮 */}
        <button
          type="button"
          onClick={handleToggle}
          className="shrink-0 w-10 h-10 flex items-center justify-center text-xf-medium hover:text-xf-accent transition-colors"
          aria-label={isExpanded ? '关闭搜索' : '打开搜索'}
        >
          {isExpanded ? (
            <X className="w-4 h-4" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`
            flex-1 bg-transparent text-sm text-xf-dark
            placeholder:text-xf-light
            outline-none
            transition-opacity duration-200
            ${isExpanded ? 'opacity-100 w-full pr-2' : 'opacity-0 w-0'}
          `}
        />

        {/* 清空按钮 */}
        {isExpanded && value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-6 h-6 mr-2 flex items-center justify-center text-xf-light hover:text-xf-medium transition-colors"
            aria-label="清空搜索"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </form>
    </div>
  )
}
