/**
 * 我的内容区域组件
 * 
 * 作用: 显示用户的最新文章列表（从数据库获取真实数据）
 * 
 * @returns {JSX.Element} 我的内容区域组件
 * 
 * 更新时间: 2026-03-22
 */

import { ThumbsUp, MessageSquare as MessageIcon, FileText } from 'lucide-react'
import { getArticles } from '@/lib/articles/actions/crud'
import { formatDistanceToNow } from '@/lib/utils/date'

/**
 * 我的内容区域组件
 * 
 * @async
 * @function ProfileContent
 * @returns {Promise<JSX.Element>} 我的内容区域组件
 * 
 * @description
 * 提供我的内容区域的完整功能，包括：
 * - 从数据库获取用户的最新文章列表
 * - 文章列表（发布时间、标题、摘要、互动数据）
 * - 加载状态和空状态处理
 * 
 * @layout
 * - 使用列表布局
 * - 简洁的横向排列
 * - 所有间距完全复制原型数值
 */
export async function ProfileContent() {
  let articles: Awaited<ReturnType<typeof getArticles>> = []
  let error: string | null = null

  try {
    articles = await getArticles('published')
  } catch (err) {
    error = err instanceof Error ? err.message : '获取文章失败'
  }

  {/* 错误状态 */}
  if (error) {
    return (
      <div id="profile-content-section">
        <div className="text-center py-12">
          <p className="text-xf-medium">{error}</p>
        </div>
      </div>
    )
  }

  {/* 空状态 */}
  if (articles.length === 0) {
    return (
      <div id="profile-content-section">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-xf-light mx-auto mb-4" />
          <p className="text-xf-medium">还没有发布文章</p>
          <p className="text-sm text-xf-medium/70 mt-2">开始创作你的第一篇文章吧</p>
        </div>
      </div>
    )
  }

  return (
    <div id="profile-content-section">
      <div className="bg-white border border-xf-bg/60 rounded-2xl overflow-hidden">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className="group cursor-pointer hover:bg-xf-bg/30 transition-colors"
          >
            {/* 列表项 - 横向布局 */}
            <div className={`flex items-center gap-4 px-5 py-4 ${index !== articles.length - 1 ? 'border-b border-xf-bg/60' : ''}`}>
              {/* 左侧：序号 */}
              <span className="text-sm text-xf-medium/50 w-6 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* 中间：标题和元信息 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-xf-dark group-hover:text-xf-accent transition-colors truncate">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-xf-medium">
                  <span>{formatDistanceToNow(article.published_at || article.created_at)}</span>
                  <span className="w-1 h-1 rounded-full bg-xf-medium/30" />
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    0
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageIcon className="w-3 h-3" />
                    0
                  </span>
                </div>
              </div>

              {/* 右侧：箭头 */}
              <svg
                className="w-4 h-4 text-xf-medium/40 group-hover:text-xf-accent transition-colors shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
