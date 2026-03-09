'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { EditorState } from './useEditorState'
import { createArticle, updateArticle } from '@/lib/articles/actions/crud'

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
   */
  const saveDraft = async () => {
    if (!editorState.title.trim()) {
      alert('请输入标题')
      titleRef.current?.focus()
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
      } else {
        // 无草稿ID，创建新草稿
        const article = await createArticle({
          title: editorState.title,
          content: editorState.content,
          status: 'draft',
        })
        // 保存草稿ID到状态
        setEditorState(prev => ({ ...prev, draftId: article.id }))
      }

      // 保存成功后跳转到草稿页
      router.push('/drafts')
    } catch (error) {
      alert(error instanceof Error ? error.message : '保存失败')
    } finally {
      setEditorState(prev => ({ ...prev, isSaving: false }))
    }
  }

  /**
   * 发布文章
   *
   * @description 将当前编辑器内容发布为正式文章
   * @requires 标题和内容都不能为空
   * @redirects 发布成功后跳转到文章详情页
   */
  const publishContent = async () => {
    if (!editorState.title.trim()) {
      alert('请输入文章标题')
      titleRef.current?.focus()
      return
    }
    if (!editorState.content.trim()) {
      alert('请输入文章内容')
      return
    }

    setEditorState(prev => ({ ...prev, isPublishing: true }))

    try {
      // 发布文章
      const article = await createArticle({
        title: editorState.title,
        content: editorState.content,
        status: 'published',
      })

      // 直接跳转到文章详情页（不显示 alert，避免阻塞）
      router.push(`/article/${article.id}`)
    } catch (error) {
      console.error('发布失败:', error)
      alert(error instanceof Error ? error.message : '发布失败，请重试')
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
