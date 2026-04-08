'use client'

/**
 * @fileoverview 自动保存 Hook
 * @module hooks/publish/useAutoSave
 * @description 自动保存编辑器内容，带保存状态指示器
 */

import { useEffect, useCallback, useRef, useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { isContentEmpty } from '@/lib/utils/json'
import type { SaveStatus, EditorBaseState, UseAutoSaveReturn } from '@/types/publish/editor'

/** 认证错误重试冷却时间（毫秒） */
const AUTH_RETRY_COOLDOWN_MS = 30_000

/** 自动保存防抖延迟（毫秒） */
const AUTOSAVE_DELAY_MS = 3000

/**
 * 判断是否为认证相关错误
 */
function isAuthRelatedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    normalized.includes('auth session missing') ||
    normalized.includes('未登录') ||
    normalized.includes('row-level security policy')
  )
}

/**
 * 自动保存 Hook
 * @param editorState - 编辑器状态
 * @param saveDraft - 保存草稿函数
 * @returns 保存状态和上次保存时间
 */
export const useAutoSave = (
  editorState: EditorBaseState,
  saveDraft: (options?: { silent?: boolean }) => Promise<void>
): UseAutoSaveReturn => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isInitialized = useAuthStore(state => state.isInitialized)

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

  /**
   * 标记用户已交互
   */
  const markUserInteracted = useCallback(() => {
    hasUserInteractedRef.current = true
  }, [])

  /**
   * 执行保存
   */
  const doSave = useCallback(async () => {
    if (editorState.isPublished) return
    if (!isInitialized || !isAuthenticated) return
    if (Date.now() < authErrorLockedUntilRef.current) return
    if (isSavingRef.current) return

    const currentContent = `${editorState.title}:${editorState.content}`

    // 内容未变化，不保存
    if (currentContent === lastContentRef.current) return

    // 用户未交互，不保存
    if (!hasUserInteractedRef.current) {
      lastContentRef.current = currentContent
      return
    }

    // 标题和内容都为空，不保存
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
    } finally {
      isSavingRef.current = false
    }
  }, [editorState, isAuthenticated, isInitialized])

  /**
   * 清理定时器
   */
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    // 不满足保存条件，清理定时器并返回
    if (!isInitialized || !isAuthenticated || editorState.isPublished || Date.now() < authErrorLockedUntilRef.current) {
      clearDebounceTimer()
      return
    }

    const currentContent = `${editorState.title}:${editorState.content}`

    // 内容变化时重置状态
    if (currentContent !== lastContentRef.current && saveStatus !== 'saving') {
      setSaveStatus('idle')
    }

    // 用户未交互，不启动自动保存
    if (!hasUserInteractedRef.current) return

    // 内容为空，不启动自动保存
    const hasTitle = editorState.title.trim().length > 0
    const hasContent = !isContentEmpty(editorState.content)
    if (!hasTitle && !hasContent) return

    // 设置防抖定时器
    debounceTimerRef.current = setTimeout(() => {
      void doSave()
    }, AUTOSAVE_DELAY_MS)

    return clearDebounceTimer
  }, [editorState.title, editorState.content, editorState.isPublished, doSave, isAuthenticated, isInitialized, saveStatus, clearDebounceTimer])

  /**
   * 手动触发保存
   */
  const triggerSave = useCallback(async () => {
    clearDebounceTimer()
    await doSave()
  }, [doSave, clearDebounceTimer])

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
