import { Suspense } from 'react'
import {
  PublishPageClient,
  EditorSkeleton,
} from '@/components/publish'

/**
 * 强制动态渲染
 * @description 发布页需要读取 cookies 进行认证检查，无法静态生成
 */
export const dynamic = 'force-dynamic'

/**
 * 发布页
 *
 * 性能优化亮点：
 * 1. 使用 Suspense 提供优雅的加载状态
 * 2. 客户端组件封装动态导入逻辑
 * 3. 骨架屏优化感知性能
 * 4. 支持编辑模式：通过URL参数edit获取草稿ID
 * @returns 发布页JSX
 */
export default async function PublishPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <PublishPageClient />
    </Suspense>
  )
}
