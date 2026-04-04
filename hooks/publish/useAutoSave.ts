'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useAuthStore, selectIsAuthenticated, selectStatus } from '@/stores/auth'

interface EditorState {
  title: string
  content: string
  draftId: string | null
  isPublished: boolean
}

const AUTH_RETRY_COOLDOWN_MS = 30_000

const isAuthRelatedError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()

  return (
    normalized.includes('auth session missing') ||
    normalized.includes('未登录') ||
    normalized.includes('row-level security policy')
  )
}

/**
 * 自动保存 Hook - 极简版
 * 只保留防抖逻辑，其他交给 Supabase
 */
export const useAutoSave = (
  editorState: EditorState,
  saveDraft: (options?: { silent?: boolean }) => Promise<void>
) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isInitialized = useAuthStore(state => state.isInitialized)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedHashRef = useRef<string>('')
  const isPublishedRef = useRef<boolean>(editorState.isPublished)
  const authErrorLockedUntilRef = useRef<number>(0)

  useEffect(() => {
    isPublishedRef.current = editorState.isPublished
  }, [editorState.isPublished])

  useEffect(() => {
    if (isAuthenticated) {
      authErrorLockedUntilRef.current = 0
    }
  }, [isAuthenticated])

  const getContentHash = useCallback(() => {
    return `${editorState.title}:${editorState.content}`
  }, [editorState.title, editorState.content])

  const doSave = useCallback(async () => {
    if (isPublishedRef.current) return
    if (!isInitialized || !isAuthenticated) return
    if (Date.now() < authErrorLockedUntilRef.current) return

    const currentHash = getContentHash()
    if (currentHash === lastSavedHashRef.current) return
    if (!editorState.title && !editorState.content) return

    try {
      await saveDraft({ silent: true })
      lastSavedHashRef.current = currentHash
      authErrorLockedUntilRef.current = 0
    } catch (error) {
      console.error('自动保存失败:', error)
      if (isAuthRelatedError(error)) {
        authErrorLockedUntilRef.current = Date.now() + AUTH_RETRY_COOLDOWN_MS
      }
      // 保存失败，下次继续尝试
    }
  }, [editorState, getContentHash, isAuthenticated, isInitialized, saveDraft])

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || editorState.isPublished || Date.now() < authErrorLockedUntilRef.current) {
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
  }, [editorState.title, editorState.content, editorState.isPublished, doSave, isAuthenticated, isInitialized])
}
