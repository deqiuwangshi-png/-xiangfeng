import { Suspense } from 'react'
import PublishPageClient from '@/components/publish/PublishPageClient'
import { AuthRequiredContent } from '@/components/auth/guards/AuthRequiredContent'
import { EditorSkeleton } from '@/components/publish/_skeleton/EditorSkeleton'
import { getCurrentUserWithProfile } from '@/lib/auth/user'

/**
 * 发布页
 *
 * 性能优化亮点：
 * 1. 使用 Suspense 提供优雅的加载状态
 * 2. 客户端组件封装动态导入逻辑
 * 3. 骨架屏优化感知性能
 * 4. 支持编辑模式：通过URL参数edit获取草稿ID
 * 5. 未登录状态显示登录引导
 *
 * @returns 发布页JSX
 */
export default async function PublishPage() {
  const profile = await getCurrentUserWithProfile()

  {/* 未登录状态：显示登录引导 */}
  if (!profile) {
    return (
      <AuthRequiredContent
        title="发布文章"
        description="登录后即可发布你的文章"
      />
    )
  }

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <PublishPageClient />
    </Suspense>
  )
}
