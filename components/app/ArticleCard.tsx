import Link from 'next/link'
import { Clock, Eye } from '@/components/icons'
import { UserAvatar } from '@/components/ui'
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
    <Link href={`/article/${id}`} className="block group">
      <article className="bg-white rounded-xl p-4 sm:p-5 border border-xf-bg/50 hover:border-xf-primary/30 hover:shadow-sm transition-all duration-200">
        {/* 标题 - 放在最上方，增加信息优先级 */}
        <h3 className="text-lg sm:text-xl font-bold text-xf-dark mb-2 line-clamp-2 group-hover:text-xf-primary transition-colors duration-200">
          {title}
        </h3>

        {/* 摘要 - 增加行数显示更多内容 */}
        <p className="text-xf-medium text-sm sm:text-base line-clamp-3 mb-3 leading-relaxed">
          {summary}
        </p>

        {/* 底部信息栏：作者 + 阅读数据 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={author.name}
              userId={author.id}
              avatarUrl={author.avatar}
              size="xs"
              className="ring-1 ring-white"
            />
            <span className="text-sm text-xf-dark font-medium">{author.name}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-xf-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {viewsCount}
            </span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
