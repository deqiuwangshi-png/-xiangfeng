import { PhilosophyCard } from '@/components/app/PhilosophyCard'
import { ArticleCard } from '@/components/app/ArticleCard'
import { RefreshCw } from 'lucide-react'
import { getPublishedArticles } from '@/lib/articles/articleActions'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

/**
 * 首页 - 显示已发布的文章列表
 */
export default async function HomePage() {
  // 获取已发布的文章（所有人可见）
  const articles = await getPublishedArticles()

  // 获取当前用户
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || '朋友'

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 pt-8 pb-20 fade-in-up">
      {/* 欢迎区域 */}
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1 mb-8">
          欢迎回来，{userName}
        </h1>

        <PhilosophyCard
          quote="人生已过半，昨日依附青山。光阴如梭，岁月如歌，唯愿此心常在，与世长存。"
          author="山中答问"
          source="禅意随想"
        />
      </div>

      {/* 文章列表区域 */}
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

        {/* ✅ 使用 ArticleCard 显示文章列表 - 两列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                summary={article.summary}
                author={article.author}
                publishedAt={article.publishedAt}
                readTime={Math.ceil(article.content.length / 500)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-xf-medium bg-white rounded-2xl">
              <p>还没有文章，快来发布第一篇吧！</p>
              <Link
                href="/publish"
                className="inline-block mt-4 px-6 py-2 bg-xf-primary text-white rounded-xl hover:bg-xf-accent transition-colors"
              >
                去发布
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
