'use client'

/**
 * 动态加载的编辑器组件
 *
 * 使用动态导入避免首屏加载 TipTap 的巨大包体积
 * 仅在需要时加载编辑器代码，显著减少初始 JS 大小
 * 采用单向数据流：TipTap 编辑器作为唯一数据源
 * 支持编辑模式：接收draftId用于更新草稿
 *
 * @module DynamicEditor
 */

import { useEditorState, useEditorActions } from '../hooks'
import { useTipTapEditor } from '../hooks/useTipTapEditor'
import { useAutoSave } from '../hooks/useAutoSave'
import { EditorHeader } from '../_header/EditorHeader'
import { EditorCard } from '../_core/EditorCard'
import { EditorToolbar } from '../_toolbar/EditorToolbar'
import { BubbleMenu } from '../_toolbar/BubbleMenu'
import { SlashMenu } from '../_toolbar/SlashMenu'

/**
 * 动态编辑器组件属性
 */
interface DynamicEditorProps {
  /** 初始标题 */
  initialTitle?: string
  /** 初始内容 */
  initialContent?: string
  /** 草稿ID（编辑模式） */
  draftId?: string | null
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
}: DynamicEditorProps) {
  // 编辑器状态管理（标题和字数统计）
  const {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    setEditorState,
  } = useEditorState(initialTitle, initialContent, draftId)

  // 编辑器操作（保存、发布）
  const {
    titleRef,
    saveDraft,
    publishContent,
    focusTitle,
  } = useEditorActions(editorState, setEditorState)

  // 从状态中解构出loading状态
  const { isSaving, isPublishing } = editorState

  // 接入自动保存功能（每30秒自动保存 + 离开页面前保存）
  useAutoSave(editorState, saveDraft)

  // TipTap 编辑器实例 - 作为内容唯一数据源
  const { editor, isMounted } = useTipTapEditor({
    content: initialContent,
    onChange: updateContent,
    placeholder: '输入 / 唤起命令菜单，或开始书写你的故事...',
  })

  return (
    <div className="relative">
      <EditorHeader
        onSaveDraft={saveDraft}
        onPublish={publishContent}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isFullscreen={editorState.isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 内容区域容器 - 工具栏将相对于此容器定位 */}
      <div className={`mx-auto py-6 sm:py-8 md:py-12 pb-24 sm:pb-32 fade-in ${
        editorState.isFullscreen
          ? 'max-w-full px-4 sm:px-8 lg:px-16'
          : 'max-w-full sm:max-w-[840px] px-3 sm:px-4'
      }`}>
        <EditorCard
          title={editorState.title}
          onTitleChange={updateTitle}
          titleRef={titleRef}
          titleLength={editorState.titleLength}
          contentLength={editorState.contentLength}
          editor={editor}
          isMounted={isMounted}
          onPlaceholderClick={focusTitle}
          isFocusMode={editorState.isFullscreen}
        />

        {/* 浮动气泡菜单 - 选中文本时显示 */}
        <BubbleMenu editor={editor} />

        {/* 斜杠命令菜单 - 输入 / 时显示 */}
        <SlashMenu editor={editor} />

        {/* 底部工具栏 - 专注模式下隐藏，普通模式下简化显示 */}
        {!editorState.isFullscreen && (
          <div className="sticky bottom-4 sm:bottom-8 flex justify-center z-30 mt-6 sm:mt-8">
            <EditorToolbar
              editor={editor}
              onFocusTitle={focusTitle}
              onToggleFullscreen={toggleFullscreen}
              onToggleToolbar={toggleToolbar}
              isCollapsed={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
