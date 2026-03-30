import { Suspense } from 'react'
import PublishPageClient from '@/components/publish/PublishPageClient'
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
 * @统一认证 2026-03-30
 * - 认证检查已移至 (main)/layout.tsx
 * - 此页面不再需要单独检查登录状态
 *
 * @returns 发布页JSX
 */
export default async function PublishPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <PublishPageClient />
    </Suspense>
  )
}
