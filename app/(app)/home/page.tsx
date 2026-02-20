'use client'

import { PhilosophyCard } from '@/components/app/PhilosophyCard'
import { ActivityCard } from '@/components/app/ActivityCard'
import { RefreshCw, Heart, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const activities = [
    {
      type: 'user' as const,
      avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Sophia&backgroundColor=E1E4EA',
      userName: 'Sophia Chen',
      userAction: '关注了你的文章',
      timeAgo: '1小时前',
      loading: 'eager' as const,
      badge: {
        text: '新动态',
        variant: 'primary' as const,
      },
      title: 'Sophia 收藏了你的文章《深度思考的方法论》',
      description: '"这篇文章的思考框架非常有启发性，特别是关于第一性原理的应用部分。期待看到更多关于认知科学的内容！"',
      articleId: '1',
      stats: [
        { label: '人点赞', value: 12, icon: Heart },
        { label: '条评论', value: 5, icon: MessageSquare },
      ],
      actionButton: {
        text: '查看文章',
        variant: 'primary' as const,
        onClick: (articleId?: string) => {
          if (articleId) {
            router.push(`/article/${articleId}`)
          }
        },
      },
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 pt-8 pb-20 fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1 mb-8">
          欢迎回来，梦话
        </h1>

        <PhilosophyCard
          quote="人生已过半，昨日依附青山。光阴如梭，岁月如歌，唯愿此心常在，与世长存。"
          author="山中答问"
          source="禅意随想"
        />
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-xf-accent font-bold text-layer-1">
            最新动态
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '刷新中...' : '刷新'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>
      </div>
    </div>
  )
}
