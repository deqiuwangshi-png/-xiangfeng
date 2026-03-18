'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { EditorState } from './useEditorState'
import { createArticle, updateArticle, updateArticleStatus } from '@/lib/articles/actions/crud'

/**
 * 编辑器操作 Hook
 *
 * 提供保存草稿、发布文章等操作功能
 * 采用单向数据流，所有内容从 editorState 读取
 *
 * @param editorState - 编辑器状态
 * @param setEditorState - 设置编辑器状态
 * @returns 编辑器操作方法和引用
 */
export const useEditorActions = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  /**
   * 保存草稿
   *
   * @description 将当前编辑器内容保存为草稿
   * @requires 标题不能为空
   * @logic 如果有 draftId 则更新，否则创建新草稿
   * @param options - 保存选项
   * @param options.silent - 是否静默保存（不显示 toast，不跳转）
   * @param options.skipIfEmpty - 如果标题为空是否跳过保存
   */
  const saveDraft = async (options?: { silent?: boolean; skipIfEmpty?: boolean }) => {
    const { silent = false, skipIfEmpty = false } = options || {}

    // 自动保存时如果标题为空可以跳过
    if (!editorState.title.trim()) {
      if (skipIfEmpty) return
      if (!silent) {
        toast.error('请输入标题')
        titleRef.current?.focus()
      }
      return
    }

    setEditorState(prev => ({ ...prev, isSaving: true }))

    try {
      if (editorState.draftId) {
        // 已有草稿ID，执行更新
        await updateArticle(editorState.draftId, {
          title: editorState.title,
          content: editorState.content,
        })
        if (!silent) toast.success('草稿更新成功')
      } else {
        // 无草稿ID，创建新草稿
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'draft',
        })
        // 保存草稿ID到状态
        setEditorState(prev => ({ ...prev, draftId: article.id }))
        if (!silent) toast.success('草稿保存成功')
      }

      // 只有手动保存才跳转到草稿页
      if (!silent) {
        router.push('/drafts')
      }
    } catch (error) {
      if (!silent) {
        toast.error(error instanceof Error ? error.message : '保存失败')
      }
    } finally {
      setEditorState(prev => ({ ...prev, isSaving: false }))
    }
  }

  /**
   * 发布文章
   *
   * @description 将当前编辑器内容发布为正式文章
   * @requires 标题和内容都不能为空（内容检查纯文本长度，避免HTML标签干扰）
   * @logic 如果有draftId则更新原草稿状态为published，否则创建新文章
   * @redirects 发布成功后跳转到文章详情页
   */
  const publishContent = async () => {
    if (!editorState.title.trim()) {
      toast.error('请输入文章标题')
      titleRef.current?.focus()
      return
    }
    // 检查纯文本长度，避免HTML标签（如<p></p>）通过校验
    const textContent = editorState.content.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim()
    if (!textContent || textContent.length === 0) {
      toast.error('请输入文章内容')
      return
    }

    setEditorState(prev => ({ ...prev, isPublishing: true }))

    try {
      let articleId: string

      if (editorState.draftId) {
        // 有草稿ID，先更新内容，再更新状态为已发布
        await updateArticle(editorState.draftId, {
          title: editorState.title,
          content: editorState.content,
        })
        await updateArticleStatus(editorState.draftId, 'published')
        articleId = editorState.draftId
        toast.success('草稿发布成功')
      } else {
        // 无草稿ID，创建新文章
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'published',
        })
        articleId = article.id
        toast.success('发布成功')
      }

      // 直接跳转到文章详情页
      router.push(`/article/${articleId}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '发布失败，请重试')
    } finally {
      setEditorState(prev => ({ ...prev, isPublishing: false }))
    }
  }

  /**
   * 聚焦标题输入框
   */
  const focusTitle = () => {
    titleRef.current?.focus()
  }

  return {
    titleRef,
    saveDraft,
    publishContent,
    focusTitle,
  }
}
