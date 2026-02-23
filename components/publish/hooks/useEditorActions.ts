'use client'

import { useRef } from 'react'
import type { EditorState } from './useEditorState'

export const useEditorActions = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const saveDraft = async () => {
    setEditorState(prev => ({ ...prev, isSaving: true }))
    
    try {
      console.log('保存草稿:', { title: editorState.title, content: editorState.content })
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('草稿已保存')
    } catch (error) {
      console.error('保存草稿失败:', error)
      alert('保存草稿失败，请重试')
    } finally {
      setEditorState(prev => ({ ...prev, isSaving: false }))
    }
  }

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
      console.log('发布内容:', { title: editorState.title, content: editorState.content })
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('文章发布成功！')
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败，请重试')
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
