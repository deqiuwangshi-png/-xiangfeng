'use client'

import '@/styles/domains/publish.css'
import { EditorHeader } from '@/components/publish/EditorHeader'
import { EditorCard } from '@/components/publish/EditorCard'
import { EditorToolbar } from '@/components/publish/EditorToolbar'
import { useEditorState, useEditorActions, useAutoSave } from '@/components/publish/hooks'
import {
  formatText,
  insertLink,
  insertImage,
  insertList,
  clearFormatting,
  undoAction,
  redoAction,
} from '@/components/publish/utils'

export default function PublishPage() {
  const {
    editorState,
    updateTitle,
    updateContent,
    toggleFullscreen,
    toggleToolbar,
    setEditorState,
  } = useEditorState()

  const {
    titleRef,
    contentRef,
    saveDraft,
    publishContent,
    focusTitle,
  } = useEditorActions(editorState, setEditorState)

  useAutoSave(editorState, saveDraft)

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
          content={editorState.content}
          onContentChange={updateContent}
          contentRef={contentRef}
          titleLength={editorState.titleLength}
          contentLength={editorState.contentLength}
        />
      </div>

      <EditorToolbar
        onFormatText={formatText}
        onInsertLink={insertLink}
        onInsertImage={insertImage}
        onInsertList={insertList}
        onClearFormatting={clearFormatting}
        onUndo={undoAction}
        onRedo={redoAction}
        onFocusTitle={focusTitle}
        onToggleFullscreen={toggleFullscreen}
        onToggleToolbar={toggleToolbar}
        isCollapsed={editorState.isToolbarCollapsed}
      />
    </div>
  )
}
