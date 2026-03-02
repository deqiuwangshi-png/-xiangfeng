import { DraftsServer } from '@/components/drafts/DraftsServer'

/**
 * 草稿页
 * @description 使用Suspense优化LCP，优先渲染骨架屏
 */
export default function DraftsPage() {
  return <DraftsServer />
}
