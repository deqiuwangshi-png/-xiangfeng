'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

/**
 * 极简搜索框组件
 * @description 清爽流畅的搜索体验，去边框化设计
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

  // ESC键关闭搜索框
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

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
          flex items-center
          bg-white
          rounded-full
          shadow-sm
          hover:shadow-md
          transition-shadow duration-200
          overflow-hidden
          ${isExpanded ? 'w-64 sm:w-80' : 'w-10'}
        `}
      >
        {/* 搜索图标 - 始终显示在左侧，无边框设计 */}
        <button
          type="button"
          onClick={handleToggle}
          className={`
            shrink-0 w-10 h-10 flex items-center justify-center 
            text-gray-400 hover:text-gray-600 
            transition-colors duration-200
            bg-transparent border-0 outline-none focus:outline-none
            ${isExpanded ? 'order-1' : ''}
          `}
          aria-label={isExpanded ? '关闭搜索' : '打开搜索'}
        >
          {isExpanded ? (
            <X className="w-4 h-4" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>

        {/* 输入框 - 液体填充设计，完全融入容器 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`
            flex-1 
            bg-transparent 
            text-sm text-gray-700
            placeholder:text-gray-400
            border-0 
            outline-none 
            focus:outline-none 
            focus:ring-0
            focus-visible:outline-none
            focus-visible:ring-0
            py-2.5
            m-0
            ${isExpanded ? 'block w-full px-3' : 'hidden w-0'}
          `}
        />

        {/* 清空按钮 - 仅在展开且有内容时显示，无边框设计 */}
        {isExpanded && value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-8 h-8 mr-1 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-0 outline-none focus:outline-none"
            aria-label="清空搜索"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>
    </div>
  )
}
