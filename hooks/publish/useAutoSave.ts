'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useAuthStore, selectIsAuthenticated } from '@/stores/auth'

/**
 * 保存状态类型
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

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
 * 自动保存 Hook - 带保存状态指示器
 * @param editorState - 编辑器状态
 * @param saveDraft - 保存草稿函数
 * @returns 保存状态和上次保存时间
 */
export const useAutoSave = (
  editorState: EditorState,
  saveDraft: (options?: { silent?: boolean }) => Promise<void>
) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isInitialized = useAuthStore(state => state.isInitialized)

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedHashRef = useRef<string>('')
  const isPublishedRef = useRef<boolean>(editorState.isPublished)
  const authErrorLockedUntilRef = useRef<number>(0)
  const saveDraftRef = useRef(saveDraft)
  const isSavingRef = useRef(false)
  const hasUserInteractedRef = useRef(false)
  const initialContentHashRef = useRef<string>('')
  const hasSetInitialHashRef = useRef(false)

  useEffect(() => {
    isPublishedRef.current = editorState.isPublished
  }, [editorState.isPublished])

  useEffect(() => {
    saveDraftRef.current = saveDraft
  }, [saveDraft])

  useEffect(() => {
    if (isAuthenticated) {
      authErrorLockedUntilRef.current = 0
    }
  }, [isAuthenticated])

  const getContentHash = useCallback(() => {
    return `${editorState.title}:${editorState.content}`
  }, [editorState.title, editorState.content])

  /**
   * 标记用户已交互
   */
  const markUserInteracted = useCallback(() => {
    hasUserInteractedRef.current = true
  }, [])

  const doSave = useCallback(async () => {
    if (isPublishedRef.current) return
    if (!isInitialized || !isAuthenticated) return
    if (Date.now() < authErrorLockedUntilRef.current) return

    const currentHash = getContentHash()

    // 如果内容没有变化，不保存
    if (currentHash === lastSavedHashRef.current) return

    // 如果用户从未交互过（初始加载状态），不保存
    if (!hasUserInteractedRef.current) return

    // 如果标题和内容都为空，不保存
    if (!editorState.title.trim() && !editorState.content.trim()) return

    // 如果是初始内容（未修改过），不保存
    if (!hasSetInitialHashRef.current) {
      initialContentHashRef.current = currentHash
      hasSetInitialHashRef.current = true
      return
    }

    // 如果内容与初始内容相同，不保存
    if (currentHash === initialContentHashRef.current) return

    try {
      if (isSavingRef.current) return
      isSavingRef.current = true
      setSaveStatus('saving')
      setErrorMessage(null)

      await saveDraftRef.current({ silent: true })

      lastSavedHashRef.current = currentHash
      authErrorLockedUntilRef.current = 0
      setSaveStatus('saved')
      setLastSavedAt(new Date())

      // 3秒后恢复 idle 状态
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

      // 保存失败时，不更新 lastSavedHashRef，允许下次重试
    } finally {
      isSavingRef.current = false
    }
  }, [editorState, getContentHash, isAuthenticated, isInitialized])

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || editorState.isPublished || Date.now() < authErrorLockedUntilRef.current) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      return
    }

    // 内容变化时设置为 idle（如果有变更）
    const currentHash = getContentHash()
    if (currentHash !== lastSavedHashRef.current && saveStatus !== 'saving') {
      setSaveStatus('idle')
    }

    // 如果用户未交互过，不启动自动保存定时器
    if (!hasUserInteractedRef.current) return

    // 如果标题和内容都为空，不启动自动保存
    if (!editorState.title.trim() && !editorState.content.trim()) return

    debounceTimerRef.current = setTimeout(() => {
      void doSave()
    }, 3000)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [editorState.title, editorState.content, editorState.isPublished, doSave, isAuthenticated, isInitialized, getContentHash, saveStatus])

  /**
   * 手动触发保存
   */
  const triggerSave = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    await doSave()
  }, [doSave])

  /**
   * 重置保存状态
   */
  const resetStatus = useCallback(() => {
    setSaveStatus('idle')
    setErrorMessage(null)
  }, [])

  return {
    saveStatus,
    lastSavedAt,
    errorMessage,
    triggerSave,
    resetStatus,
    markUserInteracted,
  }
}
