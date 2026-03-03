import { Suspense } from 'react'
import { ArticleCard } from '@/components/app/ArticleCard'
import { ArticleCardSkeleton } from '@/components/app/ArticleCardSkeleton'
import { RefreshCw } from 'lucide-react'
import { getPublishedArticles } from '@/lib/articles/articleActions'
import { getCurrentUser } from '@/lib/supabase/user'
import Link from 'next/link'

/**
 * 文章列表组件 - 独立获取数据，支持Suspense
 * @returns 文章列表JSX
 */
async function ArticleList() {
  const articles = await getPublishedArticles()

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 text-xf-medium bg-white rounded-2xl">
        <p>还没有文章，快来发布第一篇吧！</p>
        <Link
          href="/publish"
          className="inline-block mt-4 px-6 py-2 bg-xf-primary text-white rounded-xl hover:bg-xf-accent transition-colors"
        >
          去发布
        </Link>
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
          readTime={Math.ceil(article.content.length / 500)}
        />
      ))}
    </>
  )
}

/**
 * 首页 - 显示已发布的文章列表
 * @description 文章列表使用Suspense延迟加载
 * 使用缓存的getCurrentUser()避免重复获取用户数据
 */
export default async function HomePage() {
  // 获取当前用户（LCP关键路径）- 使用缓存函数
  const user = await getCurrentUser()
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || '朋友'

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 pt-8 pb-20 fade-in-up">
      {/* 欢迎区域 */}
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
          欢迎回来，{userName}
        </h1>
      </div>

      {/* 文章列表区域 - 使用Suspense优化LCP */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-xf-accent font-bold text-layer-1">
            最新文章
          </h2>
          <Link
            href="/home"
            className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            刷新
          </Link>
        </div>

        {/* ✅ 使用 Suspense 延迟加载文章列表，优化LCP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<ArticleCardSkeleton count={4} />}>
            <ArticleList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
