'use client'

/**
 * 编辑器操作 Hook - 简化版
 * 只保留防重复点击，其他逻辑交给 Supabase
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createArticle, updateArticle, updateArticleStatus } from '@/lib/articles/actions/crud'

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

  /**
   * 保存草稿
   */
  const saveDraft = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      if (editorState.draftId) {
        await updateArticle(editorState.draftId, {
          title: editorState.title,
          content: editorState.content,
        })
      } else {
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'draft',
        })
        setEditorState(prev => ({ ...prev, draftId: article.id }))
      }
      router.push('/drafts')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * 发布文章
   */
  const publishContent = async () => {
    if (isPublishing) return
    setIsPublishing(true)

    try {
      let articleId: string

      if (editorState.draftId) {
        await updateArticle(editorState.draftId, {
          title: editorState.title,
          content: editorState.content,
        })
        await updateArticleStatus(editorState.draftId, 'published')
        articleId = editorState.draftId
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
    } finally {
      setIsPublishing(false)
    }
  }

  return {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
  }
}
