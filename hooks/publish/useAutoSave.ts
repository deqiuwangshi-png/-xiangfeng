'use client'

import { useEffect, useCallback, useRef } from 'react'

interface EditorState {
  title: string
  content: string
  draftId: string | null
  isPublished: boolean
}

/**
 * 自动保存 Hook - 极简版
 * 只保留防抖逻辑，其他交给 Supabase
 */
export const useAutoSave = (
  editorState: EditorState,
  saveDraft: () => Promise<void>
) => {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedHashRef = useRef<string>('')
  const isPublishedRef = useRef<boolean>(editorState.isPublished)

  useEffect(() => {
    isPublishedRef.current = editorState.isPublished
  }, [editorState.isPublished])

  const getContentHash = useCallback(() => {
    return `${editorState.title}:${editorState.content}`
  }, [editorState.title, editorState.content])

  const doSave = useCallback(async () => {
    if (isPublishedRef.current) return

    const currentHash = getContentHash()
    if (currentHash === lastSavedHashRef.current) return
    if (!editorState.title && !editorState.content) return

    try {
      await saveDraft()
      lastSavedHashRef.current = currentHash
    } catch {
      // 保存失败，下次继续尝试
    }
  }, [editorState, saveDraft, getContentHash])

  useEffect(() => {
    if (editorState.isPublished) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      return
    }

    debounceTimerRef.current = setTimeout(() => {
      void doSave()
    }, 3000)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [editorState.title, editorState.content, editorState.isPublished, doSave])
}
