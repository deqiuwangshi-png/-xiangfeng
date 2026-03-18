/**
 * 我的内容区域组件
 * 
 * 作用: 显示用户的最新文章列表（从数据库获取真实数据）
 * 
 * @returns {JSX.Element} 我的内容区域组件
 * 
 * 更新时间: 2026-03-05
 */

import { BookOpen, Brain, ThumbsUp, MessageSquare as MessageIcon, FileText } from 'lucide-react'
import { getArticles } from '@/lib/articles/actions/crud'
import { formatDistanceToNow } from '@/lib/utils/date'

/**
 * 文章图标映射
 * 
 * @param index - 文章索引
 * @returns 对应的图标组件
 */
function getArticleIcon(index: number): React.ElementType {
  const icons = [BookOpen, Brain, FileText]
  return icons[index % icons.length]
}

/**
 * 文章渐变样式映射
 * 
 * @param index - 文章索引
 * @returns 对应的渐变类名
 */
function getArticleGradient(index: number): string {
  const gradients = [
    'from-xf-accent to-xf-primary',
    'from-xf-info to-xf-soft',
    'from-purple-500 to-pink-500'
  ]
  return gradients[index % gradients.length]
}

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
 * - 文章卡片（系列、发布时间、标题、摘要、标签、互动数据）
 * - 加载状态和空状态处理
 * 
 * @layout
 * - 使用 grid 布局
 * - 响应式设计（移动端1列，桌面端2列）
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => {
          const IconComponent = getArticleIcon(index)
          const gradientClass = getArticleGradient(index)
          
          return (
            <article
              key={article.id}
              className="card-bg rounded-4xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group"
            >
              {/* 文章头部 */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-linear-to-tr ${gradientClass} flex items-center justify-center text-white`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-xf-dark block">我的文章</span>
                  <span className="text-xs text-xf-medium font-medium">
                    发布于 {formatDistanceToNow(article.published_at || article.created_at)}
                  </span>
                </div>
              </div>

              {/* 文章标题 */}
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3 group-hover:text-xf-accent transition-colors leading-tight text-layer-1">
                {article.title}
              </h3>

              {/* 文章摘要 */}
              <p className="text-xf-dark/70 leading-relaxed mb-4 font-normal line-clamp-3">
                {article.summary}
              </p>

              {/* 文章底部 */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-xf-bg/50">
                <div className="flex gap-2">
                  <span className="tag px-3 py-1 bg-xf-light text-xf-info text-xs rounded-full font-medium">
                    #文章
                  </span>
                </div>
                <div className="flex gap-4 text-xf-medium text-sm font-medium">
                  <span className="flex items-center gap-1 hover:text-xf-info transition">
                    <ThumbsUp className="w-4 h-4" />
                    0
                  </span>
                  <span className="flex items-center gap-1 hover:text-xf-info transition">
                    <MessageIcon className="w-4 h-4" />
                    0
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
