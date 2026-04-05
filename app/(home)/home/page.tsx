import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  ArticleCard,
  ArticleCardSkeleton,
  SearchBox,
} from '@/components/app'
import { RefreshCw } from '@/components/icons'
import { getPublishedArticles } from '@/lib/articles/actions/query'
import { getCurrentUser } from '@/lib/auth/user'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '首页 - 发现深度文章 | 相逢',
  description: '浏览相逢社区最新发布的深度文章，探索深度思考、独立观点、知识分享。',
}

/**
 * 页面重新验证时间
 * @description 每30秒重新验证一次，确保文章列表及时更新
 * @性能优化 平衡实时性和性能
 */
export const revalidate = 30

/**
 * 动态渲染配置
 * @description 强制动态渲染，确保数据实时性
 */
export const dynamic = 'force-dynamic'

/**
 * 文章列表组件 - 独立获取数据，支持Suspense
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAuthenticated - 是否已认证
 * @returns 文章列表JSX
 */
async function ArticleList({ isAuthenticated }: { isAuthenticated: boolean }) {
  const articles = await getPublishedArticles()

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 text-xf-medium bg-white rounded-2xl">
        <p>还没有文章，快来发布第一篇吧！</p>
        {isAuthenticated && (
          <div className="inline-block mt-4 px-6 py-2 bg-xf-primary/50 text-white rounded-xl cursor-not-allowed">
            去发布
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {articles.map((article) => (
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
      ))}
    </>
  )
}

/**
 * 首页 - 显示已发布的文章列表
 * @description 文章列表使用Suspense延迟加载
 * 使用缓存的getCurrentUser()避免重复获取用户数据
 * 支持匿名用户访问，只浏览文章
 */
export default async function HomePage() {
  // 获取当前用户（LCP关键路径）- 使用缓存函数
  const user = await getCurrentUser()
  const isAuthenticated = !!user
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || '朋友'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-20 fade-in-up">
      {/* 欢迎区域 */}
      <div className="mb-6 sm:mb-10">
        {isAuthenticated ? (
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-serif text-xf-accent font-bold text-layer-1">
              欢迎回来，{userName}
            </h1>
            <SearchBox placeholder="搜索文章..." />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl font-serif text-xf-accent font-bold text-layer-1">
                发现深度文章
              </h1>
              <p className="text-xf-medium text-sm sm:text-base hidden sm:block">
                登录后可以点赞、评论和发布自己的文章
              </p>
            </div>
            <SearchBox placeholder="搜索文章..." />
          </div>
        )}
      </div>

      {/* 文章列表区域 - 使用Suspense优化LCP */}
      <div className="mb-8 sm:mb-12">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-serif text-xf-accent font-bold text-layer-1">
            最新文章
          </h2>
          <Link
            href="/home"
            className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">刷新</span>
          </Link>
        </div>

        {/* 使用 Suspense 延迟加载文章列表，优化LCP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Suspense fallback={<ArticleCardSkeleton count={4} />}>
            <ArticleList isAuthenticated={isAuthenticated} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
