import { Suspense } from 'react'
import PublishPageClient from '@/components/publish/PublishPageClient'
import { EditorSkeleton } from '@/components/publish/_skeleton/EditorSkeleton'
import { getCurrentUserWithProfile } from '@/lib/auth/user'
import { UnauthenticatedPrompt } from '@/components/auth/guards/UnauthenticatedPrompt'
import { FileEdit } from 'lucide-react'

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
 * - 页面自行处理未登录状态，显示友好的登录引导
 * - 使用 UnauthenticatedPrompt 组件展示洞察图标和登录按钮
 *
 * @returns 发布页JSX
 */
export default async function PublishPage() {
  const profile = await getCurrentUserWithProfile()

  // 未登录用户：显示登录引导
  if (!profile) {
    return (
      <UnauthenticatedPrompt
        title="你的思想值得被看见"
        description="在这里书写你的故事，分享你的见解"
        icon={<FileEdit className="w-8 h-8 sm:w-10 sm:h-10 text-xf-primary" />}
        promptText="登录后开始创作你的文章"
      />
    )
  }

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <PublishPageClient />
    </Suspense>
  )
}
