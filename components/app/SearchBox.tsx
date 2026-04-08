'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { searchPublishedArticles } from '@/lib/articles/actions/query'
import { formatDateShort } from '@/lib/utils/date'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * 搜索结果项类型
 */
interface SearchResult {
  id: string
  title: string
  summary: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
}

/**
 * 极简搜索框组件
 * @description 清爽流畅的搜索体验，支持下拉浮层展示搜索结果
 * @param {Object} props - 组件属性
 * @param {string} [props.placeholder] - 输入框占位文本
 */
interface SearchBoxProps {
  placeholder?: string
}

export function SearchBox({ 
  placeholder = '搜索文章...'
}: SearchBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [value, setValue] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * 执行搜索
   * @param query - 搜索关键词
   */
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await searchPublishedArticles(query)
      setResults(data as SearchResult[])
      setShowDropdown(data.length > 0)
    } catch (error) {
      console.error('搜索失败:', error)
      setResults([])
      setShowDropdown(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 防抖搜索
   */
  const debouncedSearch = useDebounce(performSearch, 300)

  /**
   * 输入变化处理
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }

  /**
   * 回车搜索
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(value)
  }

  // 展开时自动聚焦输入框
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // 点击外部收起搜索框和下拉层
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
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
        setShowDropdown(false)
        setIsExpanded(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  /**
   * 切换搜索框展开/收起
   */
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    setShowDropdown(false)
    if (isExpanded) {
      setValue('')
      setResults([])
    }
  }

  /**
   * 清空输入
   */
  const handleClear = () => {
    setValue('')
    setResults([])
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  /**
   * 点击搜索结果项
   */
  const handleResultClick = () => {
    setShowDropdown(false)
    setIsExpanded(false)
    setValue('')
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
        {/* 搜索图标 - 收起状态时显示搜索图标 */}
        {!isExpanded && (
          <button
            type="button"
            onClick={handleToggle}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-transparent border-0 outline-none focus:outline-none"
            aria-label="打开搜索"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* 关闭按钮 - 展开状态且无内容时显示 */}
        {isExpanded && !value && (
          <button
            type="button"
            onClick={handleToggle}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-transparent border-0 outline-none focus:outline-none order-1"
            aria-label="关闭搜索"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 输入框 - 液体填充设计，完全融入容器 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
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

        {/* 加载状态 */}
        {isExpanded && isLoading && (
          <div className="shrink-0 w-8 h-8 mr-1 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}

        {/* 清空按钮 - 仅在展开且有内容时显示，无边框设计 */}
        {isExpanded && value && !isLoading && (
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

      {/* 搜索结果下拉浮层 */}
      {showDropdown && isExpanded && results.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/article/${result.id}`}
                onClick={handleResultClick}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                  {result.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {result.summary || '暂无摘要'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{result.author.name}</span>
                  <span>{formatDateShort(result.publishedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
          {results.length >= 10 && (
            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-400">最多显示 10 条结果</span>
            </div>
          )}
        </div>
      )}

      {/* 无结果提示 */}
      {showDropdown && isExpanded && !isLoading && value && results.length === 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 py-6 px-4 text-center z-50">
          <p className="text-sm text-gray-500">未找到相关文章</p>
        </div>
      )}
    </div>
  )
}
