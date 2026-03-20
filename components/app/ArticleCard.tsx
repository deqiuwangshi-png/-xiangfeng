import Link from 'next/link'
import { Clock, Eye } from '@/components/icons'
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder'
import type { ArticleCardProps } from '@/types'

export type { ArticleCardProps } from '@/types'

/**
 * 格式化时间为相对时间
 * 在服务端执行，减少客户端计算
 *
 * @param dateString - 日期字符串，可能为 null 或 undefined
 * @returns 格式化后的时间字符串
 */
function formatTime(dateString: string | null | undefined): string {
  // 处理 null/undefined/空字符串情况
  if (!dateString) {
    return '未知时间'
  }

  const date = new Date(dateString)

  // 处理无效日期
  if (isNaN(date.getTime())) {
    return '未知时间'
  }

  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 文章卡片组件 - 服务端组件
 * ✅ 服务端渲染，SEO友好
 * ✅ 减少客户端JavaScript
 */
export function ArticleCard({
  id,
  title,
  summary,
  author,
  publishedAt,
  readTime,
  viewsCount = 0,
}: ArticleCardProps) {
  // 在服务端预格式化时间
  const formattedTime = formatTime(publishedAt)

  return (
    <Link href={`/article/${id}`}>
      <article className="h-full flex flex-col bg-white rounded-2xl p-6 shadow-soft cursor-pointer border border-xf-bg/50">
        {/* 作者信息 */}
        <div className="flex items-center gap-3 mb-4">
          <AvatarPlaceholder
            name={author.name}
            avatarUrl={author.avatar}
            size="sm"
            className="ring-2 ring-white"
          />
          <div className="flex-1">
            <div className="font-medium text-xf-dark">{author.name}</div>
            <div className="text-sm text-xf-medium flex items-center gap-2">
              <span>{formattedTime}</span>
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
            <span>{viewsCount}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
