'use client'

/**
 * @fileoverview 编辑器操作 Hook
 * @module hooks/publish/useEditorActions
 * @description 支持 JSON 格式内容保存，提供保存草稿和发布文章功能
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createArticle, updateArticle, updateArticleStatus } from '@/lib/articles/actions/mutate'
import { toast } from 'sonner'
import { isContentEmpty, extractTextFromJSON } from '@/lib/utils/json'
import type {
  EditorBaseState,
  SaveDraftOptions,
  EditorActionsOptions,
  ValidationResult,
  UseEditorActionsReturn,
} from '@/types/publish/editor'

/**
 * 验证内容是否可以保存
 * 规则：标题或正文至少一个有实质性内容
 */
function validateContent(title: string, content: string): ValidationResult {
  const hasTitle = title.trim().length > 0
  const hasContent = !isContentEmpty(content)

  if (!hasTitle && !hasContent) {
    return { valid: false, error: '标题和内容不能同时为空' }
  }

  if (hasTitle && title.trim().length > 100) {
    return { valid: false, error: '标题不能超过100个字符' }
  }

  return { valid: true }
}

/**
 * 验证内容是否可以发布
 * 规则：必须有标题和内容，且内容不少于10个字符
 */
function validatePublish(title: string, content: string): ValidationResult {
  if (!title.trim()) {
    return { valid: false, error: '发布文章必须填写标题' }
  }

  if (isContentEmpty(content)) {
    return { valid: false, error: '发布文章必须填写内容' }
  }

  const textContent = extractTextFromJSON(content).replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
  if (textContent.length < 10) {
    return { valid: false, error: '发布内容不能少于10个字符' }
  }

  return { valid: true }
}

/**
 * 编辑器操作 Hook
 *
 * @param editorState - 编辑器状态
 * @param setEditorState - 设置编辑器状态的函数
 * @param options - 编辑器操作选项
 * @returns 编辑器操作方法
 */
export function useEditorActions<T extends EditorBaseState>(
  editorState: T,
  setEditorState: React.Dispatch<React.SetStateAction<T>>,
  options?: EditorActionsOptions
): UseEditorActionsReturn {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  /**
   * 保存草稿
   * @param saveOptions - 保存选项
   */
  const saveDraft = useCallback(async (saveOptions?: SaveDraftOptions) => {
    if (isSaving) return

    if (!saveOptions?.skipValidation) {
      const validation = validateContent(editorState.title, editorState.content)
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
        router.push('/drafts')
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
  }, [editorState, isSaving, setEditorState, options, router])

  /**
   * 发布文章
   */
  const publishContent = useCallback(async () => {
    if (isPublishing) return

    const validation = validatePublish(editorState.title, editorState.content)
    if (!validation.valid) {
      toast.error(validation.error)
      throw new Error(validation.error)
    }

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
      options?.onPublishSuccess?.(articleId)
      toast.success('文章发布成功')
      router.push(`/article/${articleId}`)
    } catch (error) {
      console.error('发布文章失败:', error)
      const message = error instanceof Error ? error.message : '发布失败，请重试'
      toast.error(message)
      throw error
    } finally {
      setIsPublishing(false)
    }
  }, [editorState, isPublishing, setEditorState, options, router])

  return {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
    validateContent: useCallback(
      () => validateContent(editorState.title, editorState.content),
      [editorState.title, editorState.content]
    ),
  }
}
