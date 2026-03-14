'use client'

/**
 * 动态加载的编辑器组件
 *
 * 使用动态导入避免首屏加载 TipTap 的巨大包体积
 * 仅在需要时加载编辑器代码，显著减少初始 JS 大小
 * 采用单向数据流：TipTap 编辑器作为唯一数据源
 *
 * @module DynamicEditor
 */

import { useState } from 'react'
import { useEditorState, useEditorActions } from '../hooks'
import { useTipTapEditor } from '../hooks/useTipTapEditor'
import { EditorHeader } from '../_header/EditorHeader'
import { EditorCard } from '../_core/EditorCard'  
import { EditorToolbar } from '../_toolbar/EditorToolbar'

/**
 * 动态编辑器组件属性
 */
interface DynamicEditorProps {
  /** 初始标题 */
  initialTitle?: string
  /** 初始内容 */
  initialContent?: string
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
  initialContent = ''
}: DynamicEditorProps) {
  // 链接气泡菜单状态
  const [showLinkBubble, setShowLinkBubble] = useState(false)

  // 编辑器状态管理（标题和字数统计）
  const {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    setEditorState,
  } = useEditorState(initialTitle, initialContent)

  // 编辑器操作（保存、发布）
  const {
    titleRef,
    saveDraft,
    publishContent,
    focusTitle,
  } = useEditorActions(editorState, setEditorState)

  // TipTap 编辑器实例 - 作为内容唯一数据源
  const { editor, isMounted } = useTipTapEditor({
    content: initialContent,
    onChange: updateContent,
    placeholder: '开始书写你的故事...（支持Markdown格式）',
  })

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth publish-page-container">
      <EditorHeader
        onSaveDraft={saveDraft}
        onPublish={publishContent}
      />

      <div className="max-w-[840px] mx-auto px-4 py-8 md:py-12 fade-in">
        <EditorCard
          title={editorState.title}
          onTitleChange={updateTitle}
          titleRef={titleRef}
          titleLength={editorState.titleLength}
          contentLength={editorState.contentLength}
          editor={editor}
          isMounted={isMounted}
          showLinkBubble={showLinkBubble}
          onCloseLinkBubble={() => setShowLinkBubble(false)}
          onPlaceholderClick={focusTitle}
        />
      </div>

      <EditorToolbar
        editor={editor}
        onFocusTitle={focusTitle}
        onToggleFullscreen={toggleFullscreen}
        onToggleToolbar={toggleToolbar}
        isCollapsed={editorState.isToolbarCollapsed}
        onShowLinkBubble={() => setShowLinkBubble(true)}
        showLinkBubble={showLinkBubble}
      />
    </div>
  )
}
