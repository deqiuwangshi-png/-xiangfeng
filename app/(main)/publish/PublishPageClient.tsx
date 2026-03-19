'use client'

/**
 * 发布页客户端组件
 *
 * 将动态导入逻辑封装在客户端组件中
 * 解决 Server Component 中不能使用 ssr: false 的问题
 * 支持编辑模式：读取URL参数edit获取草稿数据
 *
 * @module PublishPageClient
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { EditorSkeleton } from '@/components/publish/_skeleton/EditorSkeleton'
import { getArticleById } from '@/lib/articles/actions/crud'
import { toast } from 'sonner'

/**
 * 动态导入编辑器组件
 *
 * 优化策略：
 * - ssr: false 避免服务端渲染 TipTap（它依赖浏览器 API）
 * - loading 显示骨架屏，优化感知性能
 * - 将 100KB+ 的编辑器代码分割到单独的 chunk
 */
const DynamicEditor = dynamic(
  () => import('@/components/publish/_core/DynamicEditor'),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
)

/**
 * 发布页客户端组件
 *
 * @returns 发布页JSX
 */
export default function PublishPageClient() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [initialData, setInitialData] = useState<{
    initialTitle: string
    initialContent: string
    draftId: string | null
  }>({
    initialTitle: '',
    initialContent: '',
    draftId: null,
  })

  const [isLoading, setIsLoading] = useState(!!editId)

  // 如果有edit参数，获取草稿数据
  useEffect(() => {
    async function loadDraft() {
      if (!editId) return

      try {
        setIsLoading(true)
        const article = await getArticleById(editId)

        if (article) {
          setInitialData({
            initialTitle: article.title,
            initialContent: article.content,
            draftId: article.id,
          })
        } else {
          toast.error('草稿不存在或无权访问')
        }
      } catch {
        toast.error('加载草稿失败')
      } finally {
        setIsLoading(false)
      }
    }

    loadDraft()
  }, [editId])

  if (isLoading) {
    return <EditorSkeleton />
  }

  return (
    <DynamicEditor
      initialTitle={initialData.initialTitle}
      initialContent={initialData.initialContent}
      draftId={initialData.draftId}
    />
  )
}
