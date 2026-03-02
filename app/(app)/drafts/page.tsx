import { DraftsClient } from '@/components/drafts/DraftsClient'
import { getArticles } from '@/lib/articles/articleActions'
import { filterOptions } from '@/constants/drafts'

/**
 * 草稿页 Server Component
 * 从数据库获取真实数据
 */
export default async function DraftsPage() {
  // 从数据库获取当前用户的文章列表
  const articles = await getArticles()

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
      <DraftsClient
        initialArticles={articles}
        filterOptions={filterOptions}
      />
    </div>
  )
}
