'use client'

/**
 * 发布页客户端组件 - JSON 版本
 *
 * 将动态导入逻辑封装在客户端组件中
 * 解决 Server Component 中不能使用 ssr: false 的问题
 * 支持编辑模式：读取URL参数edit获取草稿数据
 * 适配 JSON 格式内容存储
 *
 * @module PublishPageClient
 */

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { EditorSkeleton } from '@/components/publish/_skeleton/EditorSkeleton'
import { getArticleById } from '@/lib/articles/actions/query'
import { toast } from 'sonner'
import { safeParseJSON, createEmptyDocument } from '@/lib/utils/json'

/**
 * 动态导入编辑器组件
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
 */
export default function PublishPageClient() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [initialData, setInitialData] = useState<{
    initialTitle: string
    initialContent: string
    draftId: string | null
    isPublished: boolean
  } | null>(null)

  const [isLoading, setIsLoading] = useState(!!editId)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 加载草稿数据
  useEffect(() => {
    // 创建新的 AbortController
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    async function loadDraft() {
      // 新建模式：直接使用空文档
      if (!editId) {
        if (!signal.aborted) {
          setInitialData({
            initialTitle: '',
            initialContent: JSON.stringify(createEmptyDocument()),
            draftId: null,
            isPublished: false,
          })
          setIsLoading(false)
        }
        return
      }

      // 编辑模式：从 Supabase 获取数据
      try {
        if (!signal.aborted) {
          setIsLoading(true)
          setError(null)
        }

        const article = await getArticleById(editId)

        if (signal.aborted) return

        if (article) {
          // 优先使用 content_json，兼容旧数据的 content 字段
          let content = article.content_json
            ? JSON.stringify(article.content_json)
            : article.content

          // 验证并确保是有效的 JSON
          const parsed = safeParseJSON(content)
          content = JSON.stringify(parsed)

          setInitialData({
            initialTitle: article.title,
            initialContent: content,
            draftId: article.id,
            isPublished: article.status === 'published',
          })
        } else {
          setError('草稿不存在或无权访问')
          toast.error('草稿不存在或无权访问')
        }
      } catch (err) {
        if (signal.aborted) return
        console.error('加载草稿失败:', err)
        setError('加载草稿失败，请刷新页面重试')
        toast.error('加载草稿失败')
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadDraft()

    // 清理函数：取消未完成的请求
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [editId])

  // 加载中状态
  if (isLoading) {
    return <EditorSkeleton />
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-xf-bg">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-semibold text-xf-dark mb-2">加载失败</h2>
          <p className="text-xf-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-xf-primary text-white rounded-lg hover:bg-xf-primary/90 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    )
  }

  // 数据未准备好
  if (!initialData) {
    return <EditorSkeleton />
  }

  return (
    <DynamicEditor
      initialTitle={initialData.initialTitle}
      initialContent={initialData.initialContent}
      draftId={initialData.draftId}
      isPublished={initialData.isPublished}
    />
  )
}
