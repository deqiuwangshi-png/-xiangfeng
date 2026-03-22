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
      <div className="flex flex-col gap-12">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              {/* 标签 + 时间 */}
              <div className="flex items-center gap-2 text-xs text-xf-medium">
                <span className="text-xf-accent font-semibold"># 文章</span>
                <span>•</span>
                <span>发布于 {formatDistanceToNow(article.published_at || article.created_at)}</span>
              </div>

              {/* 文章标题 */}
              <h3 className="text-2xl font-bold text-xf-dark group-hover:text-xf-accent transition-colors leading-tight">
                {article.title}
              </h3>

              {/* 文章摘要 */}
              <p className="text-xf-dark/70 leading-relaxed line-clamp-2 max-w-3xl">
                {article.summary}
              </p>

              {/* 互动数据 */}
              <div className="flex items-center gap-6 pt-2">
                <span className="flex items-center gap-1.5 text-xf-medium hover:text-xf-dark text-sm transition">
                  <ThumbsUp className="w-4 h-4" />
                  0
                </span>
                <span className="flex items-center gap-1.5 text-xf-medium hover:text-xf-dark text-sm transition">
                  <MessageIcon className="w-4 h-4" />
                  0
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
