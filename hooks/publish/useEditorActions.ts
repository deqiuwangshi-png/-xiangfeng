'use client'

/**
 * 编辑器操作 Hook - 简化版
 * 只保留防重复点击，其他逻辑交给 Supabase
 */

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createArticle, updateArticle, updateArticleStatus } from '@/lib/articles/actions/mutate'
import { toast } from 'sonner'

/**
 * 编辑器操作 Hook
 */
export function useEditorActions<T extends { title: string; content: string; draftId: string | null; isPublished: boolean }>(
  editorState: T,
  setEditorState: React.Dispatch<React.SetStateAction<T>>
) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const saveLockRef = useRef(false)
  const publishLockRef = useRef(false)
  const draftIdRef = useRef<string | null>(editorState.draftId)

  useEffect(() => {
    draftIdRef.current = editorState.draftId
  }, [editorState.draftId])

  /**
   * 保存草稿
   */
  const saveDraft = async (options?: { silent?: boolean }) => {
    if (saveLockRef.current || isSaving) return
    saveLockRef.current = true
    setIsSaving(true)

    try {
      if (draftIdRef.current) {
        await updateArticle(draftIdRef.current, {
          title: editorState.title,
          content: editorState.content,
        })
      } else {
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'draft',
        })
        draftIdRef.current = article.id
        setEditorState(prev => ({ ...prev, draftId: article.id }))
      }
      if (!options?.silent) {
        router.push('/drafts')
      }
    } catch (error) {
      console.error('保存草稿失败:', error)
      if (!options?.silent) {
        const message = error instanceof Error ? error.message : '保存失败，请重试'
        toast.error(message)
      }
      throw error
    } finally {
      setIsSaving(false)
      saveLockRef.current = false
    }
  }

  /**
   * 发布文章
   */
  const publishContent = async () => {
    if (publishLockRef.current || isPublishing) return
    publishLockRef.current = true
    setIsPublishing(true)

    try {
      let articleId: string

      if (draftIdRef.current) {
        await updateArticle(draftIdRef.current, {
          title: editorState.title,
          content: editorState.content,
        })
        await updateArticleStatus(draftIdRef.current, 'published')
        articleId = draftIdRef.current
      } else {
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'published',
        })
        articleId = article.id
      }

      setEditorState(prev => ({ ...prev, isPublished: true }))
      router.push(`/article/${articleId}`)
    } catch (error) {
      console.error('发布文章失败:', error)
      const message = error instanceof Error ? error.message : '发布失败，请重试'
      toast.error(message)
      throw error
    } finally {
      setIsPublishing(false)
      publishLockRef.current = false
    }
  }

  return {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
  }
}
