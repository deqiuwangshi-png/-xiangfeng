import { Suspense } from 'react'
import PublishPageClient from './PublishPageClient'
import { EditorSkeleton } from '@/components/publish/_skeleton/EditorSkeleton'

/**
 * 发布页
 *
 * 性能优化亮点：
 * 1. 使用 Suspense 提供优雅的加载状态
 * 2. 客户端组件封装动态导入逻辑
 * 3. 骨架屏优化感知性能
 * 4. 支持编辑模式：通过URL参数edit获取草稿ID
 *
 * @param searchParams - URL查询参数
 * @returns 发布页JSX
 */
export default function PublishPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <PublishPageClient searchParams={searchParams} />
    </Suspense>
  )
}
