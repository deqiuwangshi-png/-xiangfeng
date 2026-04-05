'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArticleCard } from '@/components/app/ArticleCard'
import { RefreshCw } from '@/components/icons'
import type { ArticleCardData } from '@/types/article/article'

/**
 * ArticleList组件属性
 * @interface ArticleListProps
 * @property {ArticleCardData[]} articles - 文章列表数据
 * @property {boolean} isAuthenticated - 是否已认证
 */
interface ArticleListProps {
  articles: ArticleCardData[]
  isAuthenticated: boolean
}

/**
 * ArticleList - 文章列表客户端组件
 *
 * @function ArticleList
 * @param {ArticleListProps} props - 组件属性
 * @returns {JSX.Element} 文章列表组件
 *
 * @description
 * 处理文章搜索过滤逻辑，严格限定在已公开文章范围内
 * 搜索范围：文章标题和摘要
 *
 * @state
 * - searchQuery: 搜索查询字符串
 *
 * @memo
 * - filteredArticles: 根据搜索条件过滤后的文章列表
 */
export function ArticleList({ articles, isAuthenticated }: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * 过滤后的文章列表
   * 搜索范围：标题和摘要
   */
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles

    const query = searchQuery.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query)
    )
  }, [articles, searchQuery])

  /**
   * 处理搜索输入变化
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  /**
   * 清空搜索
   */
  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <>
      {/* 搜索栏 */}
      <div className="relative w-full sm:w-64">
        {/* 搜索图标 */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="搜索文章..."
          className="w-full py-2 pl-10 pr-8 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-xf-primary focus:ring-1 focus:ring-xf-primary transition-colors"
        />

        {/* 清空按钮 */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

      {/* 文章列表区域 */}
      <div className="mt-6 sm:mt-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-serif text-xf-accent font-bold text-layer-1">
            {searchQuery ? `搜索结果 (${filteredArticles.length})` : '最新文章'}
          </h2>
          <Link
            href="/home"
            className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">刷新</span>
          </Link>
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-xf-medium bg-white rounded-2xl">
              {searchQuery ? (
                <p>没有找到匹配的文章</p>
              ) : (
                <>
                  <p>还没有文章，快来发布第一篇吧！</p>
                  {isAuthenticated && (
                    <Link
                      href="/publish"
                      className="inline-block mt-4 px-6 py-2 bg-xf-primary text-white rounded-xl hover:bg-xf-accent transition-colors"
                    >
                      去发布
                    </Link>
                  )}
                </>
              )}
            </div>
          ) : (
            filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                summary={article.summary}
                author={article.author}
                publishedAt={article.publishedAt}
                readTime={Math.ceil((article.summary?.length || 0) / 300) || 1}
                viewsCount={article.viewsCount}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
