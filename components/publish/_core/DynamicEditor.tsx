'use client'

/**
 * 动态加载的编辑器组件 - JSON 版本
 *
 * 使用动态导入避免首屏加载 TipTap 的巨大包体积
 * 仅在需要时加载编辑器代码，显著减少初始 JS 大小
 * 采用单向数据流：TipTap 编辑器作为唯一数据源
 * 支持编辑模式：接收draftId用于更新草稿
 *
 * @module DynamicEditor
 */

import { useEffect } from 'react'
import { useEditorState } from '@/hooks/publish/useEditorState'
import { useEditorActions } from '@/hooks/publish/useEditorActions'
import { useTipTapEditor } from '@/hooks/publish/useTipTapEditor'
import { EditorHeader } from '../_header/EditorHeader'
import { EditorCard } from '../_core/EditorCard'
import { BubbleMenu } from '../_toolbar/BubbleMenu'
import { SlashMenu } from '../_toolbar/SlashMenu'

/**
 * 动态编辑器组件属性
 */
interface DynamicEditorProps {
  /** 初始标题 */
  initialTitle?: string
  /** 初始内容 (JSON 字符串) */
  initialContent?: string
  /** 草稿ID（编辑模式） */
  draftId?: string | null
  /** 是否已发布（编辑已发布文章时使用） */
  isPublished?: boolean
}

/**
 * 动态编辑器组件
 *
 * 将原本分散在 page.tsx 中的编辑器逻辑封装在此组件
 * 配合 dynamic import 实现代码分割
 * 单向数据流：TipTap 编辑器 -> onChange -> useEditorState
 *
 * @param props - 组件属性
 * @returns 编辑器组件
 */
export default function DynamicEditor({
  initialTitle = '',
  initialContent = '',
  draftId = null,
  isPublished = false,
}: DynamicEditorProps) {
  // 编辑器状态管理（标题和字数统计）
  const {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    setEditorState,
    markSaved,
  } = useEditorState(initialTitle, initialContent, draftId, isPublished)

  // 编辑器操作（保存、发布）
  const {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
  } = useEditorActions(editorState, setEditorState, {
    onSaveSuccess: () => {
      markSaved()
    },
  })

  // TipTap 编辑器实例 - 作为内容唯一数据源
  const { editor, flushPendingContent } = useTipTapEditor({
    content: initialContent,
    onChange: updateContent,
    placeholder: '输入 / 唤起命令菜单，或开始书写你的故事...',
  })

  /**
   * 处理保存草稿
   */
  const handleSaveDraft = async () => {
    flushPendingContent()
    try {
      await saveDraft()
      markSaved()
    } catch {
      // 错误已在 useEditorActions 中处理
    }
  }

  /**
   * 处理发布
   */
  const handlePublish = async () => {
    flushPendingContent()
    try {
      await publishContent()
    } catch {
      // 错误已在 useEditorActions 中处理
    }
  }

  /**
   * 页面关闭前保护 - 防止内容丢失
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 如果有未保存的变更，提示用户
      if (editorState.hasUnsavedChanges && !editorState.isPublished) {
        // 显示确认提示
        e.preventDefault()
        e.returnValue = '您有未保存的更改，确定要离开吗？'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [editorState.hasUnsavedChanges, editorState.isPublished])

  /**
   * 键盘快捷键 - Ctrl/Cmd + S 保存
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (!editorState.isPublished) {
          void handleSaveDraft()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.isPublished])

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <EditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isFullscreen={editorState.isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 内容区域容器 - 使用 flex-1 占据剩余空间，overflow-auto 处理滚动 */}
      <div className={`flex-1 overflow-auto mx-auto w-full py-6 sm:py-8 md:py-12 pb-24 sm:pb-32 fade-in ${
        editorState.isFullscreen
          ? 'max-w-full px-4 sm:px-8 lg:px-16'
          : 'max-w-[840px] px-4 sm:px-6'
      }`}>
        <EditorCard
          title={editorState.title}
          onTitleChange={updateTitle}
          titleLength={editorState.titleLength}
          contentLength={editorState.contentLength}
          editor={editor}
          isFocusMode={editorState.isFullscreen}
        />

        {/* 浮动气泡菜单 - 选中文本时显示 */}
        <BubbleMenu editor={editor} />

        {/* 斜杠命令菜单 - 输入 / 时显示 */}
        <SlashMenu editor={editor} />
      </div>
    </div>
  )
}
