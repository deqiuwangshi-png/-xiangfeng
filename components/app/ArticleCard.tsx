'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye } from '@/components/icons'

interface ArticleCardProps {
  id: string
  title: string
  summary: string
  author: {
    id: string
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
}

/**
 * 文章卡片组件
 * ✅ 点击整个卡片跳转到文章详情页
 */
export function ArticleCard({
  id,
  title,
  summary,
  author,
  publishedAt,
  readTime,
}: ArticleCardProps) {
  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <Link href={`/article/${id}`}>
      <article className="h-full flex flex-col bg-white rounded-2xl p-6 shadow-soft cursor-pointer border border-xf-bg/50">
        {/* 作者信息 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-xf-light ring-2 ring-white">
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized={author.avatar?.includes('dicebear.com')}
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-xf-dark">{author.name}</div>
            <div className="text-sm text-xf-medium flex items-center gap-2">
              <span>{formatTime(publishedAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime}分钟阅读
              </span>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-bold text-xf-dark mb-3 line-clamp-2">
          {title}
        </h3>

        {/* 摘要 */}
        <p className="text-xf-medium line-clamp-2 mb-4 leading-relaxed flex-1">
          {summary}
        </p>

        {/* 底部：查看文章按钮 */}
        <div className="flex items-center justify-between mt-auto">
          <span className="px-4 py-1.5 rounded-lg text-xs font-medium bg-xf-primary text-white flex items-center gap-1">
            查看文章 →
          </span>
          <div className="flex items-center gap-1 text-xf-medium text-sm">
            <Eye className="w-4 h-4" />
            <span>阅读</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
