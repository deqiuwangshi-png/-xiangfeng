'use client'

/**
 * 编辑器操作 Hook - 带媒体状态管理
 *
 * 提供保存草稿、发布文章等操作功能
 * 保存/发布时自动更新 media 表状态
 *
 * @module useEditorActions
 */

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'
import type { EditorState } from './useEditorState'
import { useEditorToast } from './useEditorToast'
import { createArticle, updateArticle, updateArticleStatus } from '@/lib/articles/actions/crud'
import { batchUpdateMediaStatus } from '@/lib/media/actions'
import { extractImageUrls } from '@/lib/media/utils'

/** SWR 缓存 Key */
const DRAFTS_CACHE_KEY = 'drafts/list'

/**
 * 编辑器操作 Hook
 *
 * @param editorState - 编辑器状态
 * @param setEditorState - 设置编辑器状态
 * @returns 编辑器操作方法和引用
 */
export const useEditorActions = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // 使用统一的 toast 提示 hook
  const {
    showDraftSaved,
    showDraftUpdated,
    showPublished,
    showTitleRequired,
    showContentRequired,
    showSaveError,
    showPublishError,
    showStatusError,
  } = useEditorToast()

  /**
   * 更新文章中媒体状态为 published
   *
   * @param articleId - 文章ID
   * @param content - 文章内容（HTML）
   */
  const updateMediaStatus = async (articleId: string, content: string) => {
    try {
      // 从内容中提取所有图片 URL
      const imageUrls = extractImageUrls(content)

      if (imageUrls.length > 0) {
        // 批量更新媒体状态
        const result = await batchUpdateMediaStatus(imageUrls, articleId, 'published')

        if (!result.success) {
          console.error('更新媒体状态失败:', result.error)
        } else {
          console.log(`已更新 ${result.updated} 张图片状态为 published`)
        }
      }
    } catch (error) {
      // 媒体状态更新失败不影响主流程
      console.error('更新媒体状态异常:', error)
    }
  }

  /**
   * 保存草稿
   *
   * @param options - 保存选项
   * @param options.silent - 是否静默保存（不显示 toast，不跳转）
   * @param options.skipIfEmpty - 如果标题为空是否跳过保存
   */
  const saveDraft = async (options?: { silent?: boolean; skipIfEmpty?: boolean }) => {
    const { silent = false, skipIfEmpty = false } = options || {}

    // @关键修复 已发布文章不保存草稿
    if (editorState.isPublished) {
      return
    }

    if (!editorState.title.trim()) {
      if (skipIfEmpty) return
      if (!silent) {
        showTitleRequired(() => titleRef.current?.focus())
      }
      return
    }

    setEditorState(prev => ({ ...prev, isSaving: true }))

    try {
      let articleId: string

      if (editorState.draftId) {
        // 已有草稿ID，执行更新
        await updateArticle(editorState.draftId, {
          title: editorState.title,
          content: editorState.content,
        })
        articleId = editorState.draftId
        if (!silent) showDraftUpdated()
      } else {
        // 无草稿ID，创建新草稿
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'draft',
        })
        articleId = article.id
        // 保存草稿ID到状态
        setEditorState(prev => ({ ...prev, draftId: article.id }))
        if (!silent) showDraftSaved()
      }

      // 更新媒体状态为 published（草稿也更新，方便后续直接发布）
      await updateMediaStatus(articleId, editorState.content)

      // 只有手动保存才跳转到草稿页
      if (!silent) {
        router.push('/drafts')
      }
    } catch (error) {
      if (!silent) {
        showSaveError(error instanceof Error ? error : '保存失败')
      }
    } finally {
      setEditorState(prev => ({ ...prev, isSaving: false }))
    }
  }

  /**
   * 发布文章
   *
   * @description 将当前编辑器内容发布为正式文章
   */
  const publishContent = async () => {
    if (!editorState.title.trim()) {
      showTitleRequired(() => titleRef.current?.focus())
      return
    }
    // 检查纯文本长度
    const textContent = editorState.content.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim()
    if (!textContent || textContent.length === 0) {
      showContentRequired()
      return
    }

    setEditorState(prev => ({ ...prev, isPublishing: true }))

    try {
      let articleId: string

      if (editorState.draftId) {
        // 有草稿ID，先更新内容，再更新状态为已发布
        // @关键修复 使用 Promise.all 确保内容和状态同时更新成功
        const [, statusResult] = await Promise.all([
          updateArticle(editorState.draftId, {
            title: editorState.title,
            content: editorState.content,
          }),
          updateArticleStatus(editorState.draftId, 'published'),
        ])

        // 验证状态更新是否成功
        if (!statusResult.success) {
          showStatusError()
          throw new Error('文章状态更新失败，请重试')
        }

        articleId = editorState.draftId
      } else {
        // 无草稿ID，创建新文章
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'published',
        })
        articleId = article.id
      }

      // 更新媒体状态为 published
      await updateMediaStatus(articleId, editorState.content)

      // 标记文章已发布，停止自动保存草稿
      setEditorState(prev => ({ ...prev, isPublished: true }))

      // @关键修复 清除草稿列表 SWR 缓存，确保返回草稿页时能看到最新状态
      mutate(DRAFTS_CACHE_KEY, undefined, { revalidate: false })

      showPublished()

      // 直接跳转到文章详情页
      router.push(`/article/${articleId}`)
    } catch (error) {
      showPublishError(error instanceof Error ? error : '发布失败，请重试')
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
