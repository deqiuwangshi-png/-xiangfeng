/**
 * 我的内容区域组件 - 列表形式
 * @module components/profile/ProfileContent
 * @description 显示用户的文章列表，采用列表布局符合阅读美感
 *
 * @性能优化 P1: 添加骨架屏组件，支持 Suspense 流式传输
 */

import { ThumbsUp, MessageSquare, FileText, Clock } from 'lucide-react'
import { getArticles } from '@/lib/articles/actions/crud'
import { formatDistanceToNow } from '@/lib/utils/date'

interface Article {
  id: string
  title: string
  summary: string
  published_at?: string
  created_at: string
  likes_count?: number
  comments_count?: number
}

/**
 * 文章列表骨架屏组件
 * @性能优化 提供与真实列表相同的布局结构，优化LCP感知性能
 */
export function ProfileContentSkeleton() {
  return (
    <div className="divide-y divide-xf-bg/40">
      {/* 生成5个骨架项 */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="py-5 space-y-3">
          {/* 标题骨架 */}
          <div className="h-5 w-3/4 bg-xf-bg rounded animate-pulse" />
          {/* 摘要骨架 - 两行 */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-xf-bg rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-xf-bg rounded animate-pulse" />
          </div>
          {/* 元信息骨架 */}
          <div className="flex items-center gap-4">
            <div className="h-3 w-16 bg-xf-bg rounded animate-pulse" />
            <div className="h-3 w-12 bg-xf-bg rounded animate-pulse" />
            <div className="h-3 w-12 bg-xf-bg rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 文章列表项组件
 * @description
 * 采用列表形式，符合人类阅读习惯：
 * - 标题突出，快速扫描
 * - 摘要简洁，2行截断
 * - 元信息紧凑排列
 * - 悬停反馈微妙
 */
function ArticleListItem({ article }: { article: Article }) {
  const publishedAt = article.published_at || article.created_at

  return (
    <article className="group py-5 border-b border-xf-bg/40 last:border-b-0 cursor-pointer">
      {/* 标题 - 最突出 */}
      <h3 className="text-base sm:text-lg font-medium text-xf-dark group-hover:text-xf-accent transition-colors leading-snug mb-2">
        {article.title}
      </h3>

      {/* 摘要 - 简洁，2行 */}
      <p className="text-sm text-xf-medium/80 leading-relaxed line-clamp-2 mb-3">
        {article.summary}
      </p>

      {/* 元信息行 - 紧凑 */}
      <div className="flex items-center gap-4 text-xs text-xf-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDistanceToNow(publishedAt)}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3.5 h-3.5" />
          {article.likes_count || 0}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {article.comments_count || 0}
        </span>
      </div>
    </article>
  )
}

/**
 * 我的内容区域组件
 * @description
 * 改进点：
 * - 采用列表布局，符合阅读习惯
 * - 去除卡片化设计，减少视觉噪音
 * - 标题-摘要-元信息层次清晰
 * - 悬停时标题变色，反馈微妙
 */
export async function ProfileContent() {
  let articles: Article[] = []
  let error: string | null = null

  try {
    articles = await getArticles('published')
  } catch (err) {
    error = err instanceof Error ? err.message : '获取文章失败'
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-xf-medium">{error}</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="w-10 h-10 text-xf-light mx-auto mb-3" />
        <p className="text-xf-medium text-sm">还没有发布文章</p>
        <p className="text-xs text-xf-medium/60 mt-1">开始创作你的第一篇文章吧</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-xf-bg/40">
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </div>
  )
}
