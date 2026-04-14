'use client'

/**
 * @fileoverview 自动保存 Hook
 * @module hooks/publish/useAutoSave
 */

import { useEffect, useCallback, useRef, useState } from 'react'
import { isContentEmpty } from '@/lib/utils/json'
import type { SaveStatus, EditorBaseState, UseAutoSaveReturn } from '@/types/publish/editor'
import { useIsAuthenticated } from '@/hooks/auth'

const AUTH_RETRY_COOLDOWN_MS = 30_000
const AUTOSAVE_DELAY_MS = 3000

function isAuthRelatedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    normalized.includes('auth session missing') ||
    normalized.includes('未登录') ||
    normalized.includes('row-level security policy')
  )
}

export const useAutoSave = (
  editorState: EditorBaseState,
  saveDraft: (options?: { silent?: boolean }) => Promise<void>,
  isPublishing: boolean = false
): UseAutoSaveReturn => {
  const isAuthenticated = useIsAuthenticated()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isSavingRef = useRef(false)
  const hasUserInteractedRef = useRef(false)
  const lastContentRef = useRef<string>('')
  const authErrorLockedUntilRef = useRef<number>(0)
  const saveDraftRef = useRef(saveDraft)

  useEffect(() => {
    saveDraftRef.current = saveDraft
  }, [saveDraft])

  useEffect(() => {
    if (isAuthenticated) {
      authErrorLockedUntilRef.current = 0
    }
  }, [isAuthenticated])

  const markUserInteracted = useCallback(() => {
    hasUserInteractedRef.current = true
  }, [])

  const doSave = useCallback(async () => {
    if (editorState.isPublished) return
    if (isPublishing) return
    if (!isAuthenticated) return
    if (Date.now() < authErrorLockedUntilRef.current) return
    if (isSavingRef.current) return

    const currentContent = `${editorState.title}:${editorState.content}`

    if (currentContent === lastContentRef.current) return

    if (!hasUserInteractedRef.current) {
      lastContentRef.current = currentContent
      return
    }

    const hasTitle = editorState.title.trim().length > 0
    const hasContent = !isContentEmpty(editorState.content)
    if (!hasTitle && !hasContent) return

    isSavingRef.current = true
    setSaveStatus('saving')
    setErrorMessage(null)

    try {
      await saveDraftRef.current({ silent: true })

      lastContentRef.current = currentContent
      authErrorLockedUntilRef.current = 0
      setSaveStatus('saved')
      setLastSavedAt(new Date())

      setTimeout(() => {
        setSaveStatus(prev => prev === 'saved' ? 'idle' : prev)
      }, 3000)
    } catch (error) {
      console.error('自动保存失败:', error)
      const message = error instanceof Error ? error.message : '保存失败'
      setErrorMessage(message)
      setSaveStatus('error')

      if (isAuthRelatedError(error)) {
        authErrorLockedUntilRef.current = Date.now() + AUTH_RETRY_COOLDOWN_MS
      }
    } finally {
      isSavingRef.current = false
    }
  }, [editorState, isAuthenticated, isPublishing])

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || editorState.isPublished || isPublishing || Date.now() < authErrorLockedUntilRef.current) {
      clearDebounceTimer()
      return
    }

    const currentContent = `${editorState.title}:${editorState.content}`

    if (currentContent !== lastContentRef.current && saveStatus !== 'saving') {
      setSaveStatus('idle')
    }

    if (!hasUserInteractedRef.current) return

    const hasTitle = editorState.title.trim().length > 0
    const hasContent = !isContentEmpty(editorState.content)
    if (!hasTitle && !hasContent) return

    clearDebounceTimer()

    debounceTimerRef.current = setTimeout(() => {
      doSave()
    }, AUTOSAVE_DELAY_MS)

    return clearDebounceTimer
  }, [editorState, isAuthenticated, isPublishing, saveStatus, doSave, clearDebounceTimer])

  return {
    saveStatus,
    lastSavedAt,
    errorMessage,
    markUserInteracted,
  }
}
