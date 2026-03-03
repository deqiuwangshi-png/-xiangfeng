'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * 搜索框组件属性
 */
interface SearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
}

/**
 * 搜索框组件
 * 
 * @function SearchBox
 * @param {SearchBoxProps} props - 组件属性
 * @returns {JSX.Element} 搜索框组件
 * 
 * @description
 * 提供草稿搜索功能
 * @state
 * - query: 搜索查询字符串
 * - isFocused: 输入框聚焦状态
 * @refs
 * - inputRef: 输入框引用
 * @styles
 * @interactions
 */
export function SearchBox({
  placeholder = '搜索草稿标题或内容...',
  onSearch,
  initialValue = '',
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue)
  const [, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 处理输入变化
   * 
   * @function handleInputChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - 输入事件
   * @returns {void}
   * 
   * @description
   * 更新搜索查询，使用防抖优化性能
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value)
    }, 300)
  }

  /**
   * 处理清空搜索
   * 
   * @function handleClearSearch
   * @returns {void}
   * 
   * @description
   * 清空搜索查询并重置搜索结果
   */
  const handleClearSearch = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  /**
   * 处理键盘事件
   * 
   * @function handleKeyDown
   * @param {React.KeyboardEvent<HTMLInputElement>} e - 键盘事件
   * @returns {void}
   * 
   * @description
   * 按Escape键清空搜索
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch()
    }
  }

  /**
   * 清理定时器
   * 
   * @useEffect
   * @description
   * 组件卸载时清除防抖定时器
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="search-container">
      {/* 搜索图标 */}
      <svg
        className="w-4 h-4 search-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* 搜索输入框 */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="search-input"
      />

      {/* 清空按钮 */}
      {query && (
        <button
          onClick={handleClearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          title="清空搜索"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
