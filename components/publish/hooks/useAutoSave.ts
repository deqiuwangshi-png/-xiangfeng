'use client'

import { useEffect } from 'react'
import type { EditorState } from './useEditorState'

export const useAutoSave = (
  editorState: EditorState,
  saveDraft: () => Promise<void>
) => {
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (editorState.title || editorState.content) {
        saveDraft()
      }
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [editorState.title, editorState.content, saveDraft])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (editorState.title || editorState.content) {
        event.preventDefault()
        event.returnValue = ''
        saveDraft()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [editorState.title, editorState.content, saveDraft])
}
