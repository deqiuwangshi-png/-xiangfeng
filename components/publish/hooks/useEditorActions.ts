'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { EditorState } from './useEditorState'
import { createArticle } from '@/lib/articles/articleActions'

export const useEditorActions = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  /**
   * 保存草稿
   */
  const saveDraft = async () => {
    if (!editorState.title.trim()) {
      alert('请输入标题')
      titleRef.current?.focus()
      return
    }

    setEditorState(prev => ({ ...prev, isSaving: true }))

    try {
      await createArticle({
        title: editorState.title,
        content: editorState.content,
        status: 'draft',
      })

      // 保存成功后跳转到草稿页
      router.push('/drafts')
    } catch (error) {
      alert(error instanceof Error ? error.message : '保存失败')
    } finally {
      setEditorState(prev => ({ ...prev, isSaving: false }))
    }
  }

  /**
   * 发布文章 - 修复：直接跳转到已发布文章页面
   */
  const publishContent = async () => {
    if (!editorState.title.trim()) {
      alert('请输入文章标题')
      titleRef.current?.focus()
      return
    }
    if (!editorState.content.trim()) {
      alert('请输入文章内容')
      contentRef.current?.focus()
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

      // ✅ 直接跳转到文章详情页（不显示 alert，避免阻塞）
      router.push(`/article/${article.id}`)

      // ✅ 使用 replace 避免返回时还在编辑器
      // router.replace(`/article/${article.id}`)
    } catch (error) {
      console.error('发布失败:', error)
      alert(error instanceof Error ? error.message : '发布失败，请重试')
    } finally {
      setEditorState(prev => ({ ...prev, isPublishing: false }))
    }
  }

  const focusTitle = () => {
    titleRef.current?.focus()
  }

  return {
    titleRef,
    contentRef,
    saveDraft,
    publishContent,
    focusTitle,
  }
}
