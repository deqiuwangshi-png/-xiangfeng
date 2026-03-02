import { Suspense } from 'react'
import { DraftsClient } from './DraftsClient'
import { DraftCardSkeleton } from './DraftCardSkeleton'
import { getArticles } from '@/lib/articles/articleActions'
import { filterOptions } from '@/constants/drafts'

/**
 * 草稿列表数据获取组件
 * @description 独立获取草稿数据，支持Suspense
 * @returns 草稿客户端组件
 */
async function DraftsData() {
  const articles = await getArticles()

  return (
    <DraftsClient
      initialArticles={articles}
      filterOptions={filterOptions}
    />
  )
}

/**
 * 草稿页服务端组件
 * @description 使用Suspense优化LCP，优先渲染骨架屏
 * @returns 草稿页JSX
 */
export function DraftsServer() {
  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
      {/* 优先渲染骨架屏，减少LCP感知时间 */}
      <Suspense fallback={<DraftsSkeleton />}>
        <DraftsData />
      </Suspense>
    </div>
  )
}

/**
 * 草稿页骨架屏
 * @description 完整的草稿页骨架屏，优化LCP感知性能
 * @returns 骨架屏JSX
 */
function DraftsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* 筛选栏骨架 */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* 筛选按钮骨架 */}
          <div className="flex items-center gap-2">
            <div className="h-9 bg-white rounded-full w-16 animate-pulse" />
            <div className="h-9 bg-white rounded-full w-16 animate-pulse" />
            <div className="h-9 bg-white rounded-full w-16 animate-pulse" />
            <div className="h-9 bg-white rounded-full w-16 animate-pulse" />
          </div>
          {/* 搜索框骨架 */}
          <div className="h-10 bg-white rounded-xl w-full md:w-64 animate-pulse" />
        </div>

        {/* 全选栏骨架 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border-2 border-gray-200 bg-gray-100 animate-pulse" />
            <div className="h-4 bg-xf-bg/40 rounded w-10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 草稿卡片列表骨架 */}
      <DraftCardSkeleton count={6} />
    </div>
  )
}
