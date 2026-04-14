'use client'

/**
 * @fileoverview 编辑器操作 Hook
 * @module hooks/publish/useEditorActions
 */

import { useState, useCallback } from 'react'
import { createArticle, publishArticle, updateArticle } from '@/lib/articles/actions/mutate'
import { validateDraftInput, validatePublishInput, type ValidationResult } from '@/lib/articles/validators'
import { toast } from 'sonner'

interface EditorActionsOptions {
  onSaveSuccess?: () => void
  onPublishSuccess?: (articleId: string) => void
}

interface UseEditorActionsReturn {
  saveDraft: (options?: { silent?: boolean; skipValidation?: boolean }) => Promise<void>
  publishContent: () => Promise<void>
  isSaving: boolean
  isPublishing: boolean
  validateContent: () => ValidationResult
}

interface EditorStateWithMeta {
  title: string
  content: string
  draftId?: string | null
  isPublished?: boolean
}

export function useEditorActions<T extends EditorStateWithMeta>(
  editorState: T,
  setEditorState: React.Dispatch<React.SetStateAction<T>>,
  options?: EditorActionsOptions
): UseEditorActionsReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const saveDraft = useCallback(async (saveOptions?: { silent?: boolean; skipValidation?: boolean }) => {
    if (isSaving || isPublishing) return

    if (!saveOptions?.skipValidation) {
      const validation = validateDraftInput({ title: editorState.title, content: editorState.content })
      if (!validation.valid) {
        if (!saveOptions?.silent) {
          toast.error(validation.error)
        }
        throw new Error(validation.error)
      }
    }

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

      options?.onSaveSuccess?.()

      if (!saveOptions?.silent) {
        toast.success('草稿保存成功')
      }
    } catch (error) {
      console.error('保存草稿失败:', error)
      const message = error instanceof Error ? error.message : '保存失败，请重试'
      if (!saveOptions?.silent) {
        toast.error(message)
      }
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [editorState, isSaving, isPublishing, setEditorState, options])

  const publishContent = useCallback(async () => {
    if (isPublishing) return

    const validation = validatePublishInput({ title: editorState.title, content: editorState.content })
    if (!validation.valid) {
      toast.error(validation.error)
      throw new Error(validation.error)
    }

    setIsPublishing(true)

    try {
      const article = await publishArticle({
        title: editorState.title,
        content: editorState.content,
        draftId: editorState.draftId,
      })
      const articleId = article.id

      setEditorState(prev => ({ ...prev, isPublished: true, draftId: articleId }))
      toast.success('文章发布成功')
      options?.onPublishSuccess?.(articleId)
    } catch (error) {
      console.error('发布文章失败:', error)
      const message = error instanceof Error ? error.message : '发布失败，请重试'
      toast.error(message)
      throw error
    } finally {
      setIsPublishing(false)
    }
  }, [editorState, isPublishing, setEditorState, options])

  return {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
    validateContent: useCallback(
      () => validateDraftInput({ title: editorState.title, content: editorState.content }),
      [editorState.title, editorState.content]
    ),
  }
}
