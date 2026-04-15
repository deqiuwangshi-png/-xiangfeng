'use client'

/**
 * 动态加载的编辑器组件
 * @module DynamicEditor
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorState } from '@/hooks/publish/useEditorState'
import { useEditorActions } from '@/hooks/publish/useEditorActions'
import { useAutoSave } from '@/hooks/publish/useAutoSave'
import { useTipTapEditor } from '@/hooks/publish/useTipTapEditor'
import { EditorHeader } from '../_header/EditorHeader'
import { EditorCard } from '../_core/EditorCard'
import { BubbleMenu } from '../_toolbar/BubbleMenu'
import { SlashMenu } from '../_toolbar/SlashMenu'

interface DynamicEditorProps {
  initialTitle?: string
  initialContent?: string
  draftId?: string | null
  isPublished?: boolean
}

export default function DynamicEditor({
  initialTitle = '',
  initialContent = '',
  draftId = null,
  isPublished = false,
}: DynamicEditorProps) {
  const router = useRouter()
  const baseState = useEditorState(initialTitle, initialContent, draftId, isPublished)

  const {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
  } = useEditorActions(baseState, (updater) => {
    const nextState = typeof updater === 'function' ? updater(baseState) : updater
    if (nextState.title !== baseState.title) {
      baseState.setTitle(nextState.title)
    }
    if (nextState.content !== baseState.content) {
      baseState.setContent(nextState.content)
    }
    if (nextState.draftId !== baseState.draftId) {
      baseState.setDraftId(nextState.draftId ?? null)
    }
    if (nextState.isPublished !== baseState.isPublished) {
      baseState.setPublished(!!nextState.isPublished)
    }
  }, {
    onSaveSuccess: () => {
      baseState.setUnsavedChanges(false)
      baseState.setLastSavedAt(new Date())
    },
    onPublishSuccess: (articleId) => {
      router.push(`/article/${articleId}`)
    },
  })

  const autoSave = useAutoSave(baseState, saveDraft, isPublishing)

  const { editor, flushPendingContent } = useTipTapEditor({
    content: initialContent,
    onChange: (content) => {
      baseState.setContent(content)
      baseState.setUnsavedChanges(true)
      autoSave.markUserInteracted()
    },
    placeholder: '输入 / 唤起命令菜单，或开始书写你的故事...',
  })

  const handleSaveDraft = async () => {
    flushPendingContent()
    try {
      await saveDraft()
      baseState.setUnsavedChanges(false)
      baseState.setLastSavedAt(new Date())
    } catch {
      // 错误已在 useEditorActions 中处理
    }
  }

  const handlePublish = async () => {
    flushPendingContent()
    try {
      await publishContent()
    } catch {
      // 错误已在 useEditorActions 中处理
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (baseState.hasUnsavedChanges && !baseState.isPublished) {
        e.preventDefault()
        e.returnValue = '您有未保存的更改，确定要离开吗？'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [baseState.hasUnsavedChanges, baseState.isPublished])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (!baseState.isPublished) {
          void handleSaveDraft()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [baseState.isPublished])

  const handleTitleChange = (title: string) => {
    baseState.setTitle(title)
    baseState.setUnsavedChanges(true)
    autoSave.markUserInteracted()
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <EditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isFullscreen={baseState.isFullscreen}
        onToggleFullscreen={baseState.toggleFullscreen}
        saveStatus={autoSave.saveStatus}
        lastSavedAt={autoSave.lastSavedAt || baseState.lastSavedAt}
        errorMessage={autoSave.errorMessage}
      />

      <div className={`flex-1 overflow-auto mx-auto w-full py-6 sm:py-8 md:py-12 pb-24 sm:pb-32 fade-in ${
        baseState.isFullscreen
          ? 'max-w-full px-4 sm:px-8 lg:px-16'
          : 'max-w-[840px] px-4 sm:px-6'
      }`}>
        <EditorCard
          title={baseState.title}
          onTitleChange={handleTitleChange}
          titleLength={baseState.titleLength}
          contentLength={baseState.contentLength}
          editor={editor}
          isFocusMode={baseState.isFullscreen}
        />

        <BubbleMenu editor={editor} />
        <SlashMenu editor={editor} />
      </div>
    </div>
  )
}
