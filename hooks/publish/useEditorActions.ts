'use client'

/**
 * 编辑器操作 Hook - JSON 版本
 * 支持 JSON 格式内容保存
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createArticle, updateArticle, updateArticleStatus } from '@/lib/articles/actions/mutate'
import { toast } from 'sonner'
import { isContentEmpty, extractTextFromJSON } from '@/lib/utils/json'

interface EditorState {
  title: string
  content: string
  draftId: string | null
  isPublished: boolean
}

/**
 * 编辑器操作 Hook
 */
export function useEditorActions<T extends EditorState>(
  editorState: T,
  setEditorState: React.Dispatch<React.SetStateAction<T>>,
  options?: {
    onSaveSuccess?: () => void
    onPublishSuccess?: (articleId: string) => void
  }
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
   * 验证内容是否可以保存
   * 规则：标题或正文至少一个有实质性内容
   */
  const validateContent = useCallback((): { valid: boolean; error?: string } => {
    const hasTitle = editorState.title.trim().length > 0
    const hasContent = !isContentEmpty(editorState.content)

    // 标题和内容都为空时，不允许保存
    if (!hasTitle && !hasContent) {
      return { valid: false, error: '标题和内容不能同时为空' }
    }

    // 标题长度限制（如果有标题）
    if (hasTitle && editorState.title.trim().length > 100) {
      return { valid: false, error: '标题不能超过100个字符' }
    }

    return { valid: true }
  }, [editorState.title, editorState.content])

  /**
   * 保存草稿
   * @param options - 保存选项
   * @param options.silent - 是否静默保存（不跳转）
   * @param options.skipValidation - 是否跳过验证
   */
  const saveDraft = async (saveOptions?: { 
    silent?: boolean
    skipValidation?: boolean 
  }) => {
    if (saveLockRef.current || isSaving) return

    // 验证内容
    if (!saveOptions?.skipValidation) {
      const validation = validateContent()
      if (!validation.valid) {
        if (!saveOptions?.silent) {
          toast.error(validation.error)
        }
        throw new Error(validation.error)
      }
    }

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
      saveLockRef.current = false
    }
  }

  /**
   * 发布文章
   */
  const publishContent = async () => {
    if (publishLockRef.current || isPublishing) return

    // 发布前严格验证：必须有标题
    if (!editorState.title.trim()) {
      toast.error('发布文章必须填写标题')
      throw new Error('发布文章必须填写标题')
    }

    // 发布前严格验证：必须有内容
    if (isContentEmpty(editorState.content)) {
      toast.error('发布文章必须填写内容')
      throw new Error('发布文章必须填写内容')
    }

    // 额外验证：内容不能太短
    const textContent = extractTextFromJSON(editorState.content).replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
    if (textContent.length < 10) {
      toast.error('发布内容不能少于10个字符')
      throw new Error('发布内容不能少于10个字符')
    }

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
      publishLockRef.current = false
    }
  }

  return {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
    validateContent,
  }
}
