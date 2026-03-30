'use client'

import { useEffect, useCallback, useRef } from 'react'
import type { EditorState } from './useEditorState'

/**
 * 自动保存 Hook - 防抖优化版
 *
 * @性能优化 P0: 防抖自动保存，停止打字 800ms 后保存
 * - 打字时不保存、不刷新、不卡顿
 * - 停止输入 800ms 后自动保存 1 次
 * - 全程不影响编辑器性能
 * - 离开页面前提示保存
 */
export const useAutoSave = (
  editorState: EditorState,
  saveDraft: (options?: { silent?: boolean; skipIfEmpty?: boolean }) => Promise<void>
) => {
  /**
   * 防抖定时器引用
   * @性能优化 使用 ref 存储定时器，不触发重渲染
   */
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 上次保存的内容哈希
   */
  const lastSavedHashRef = useRef<string>('')

  /**
   * 是否有未保存的更改
   */
  const hasUnsavedChangesRef = useRef<boolean>(false)

  /**
   * 文章发布状态引用
   * @关键修复 使用 ref 存储 isPublished，避免清理函数中的闭包问题
   */
  const isPublishedRef = useRef<boolean>(editorState.isPublished)

  // 同步 isPublished 到 ref
  useEffect(() => {
    isPublishedRef.current = editorState.isPublished
  }, [editorState.isPublished])

  /**
   * 生成内容哈希 - 使用更可靠的哈希算法
   * @健壮性优化 使用长度+内容组合，避免特殊字符问题
   */
  const getContentHash = useCallback(() => {
    const title = editorState.title || ''
    const content = editorState.content || ''
    // 使用长度+内容前50字符+内容后50字符，避免大内容字符串拼接
    const contentPreview = content.length > 100
      ? content.slice(0, 50) + content.slice(-50)
      : content
    return `${title.length}:${title}:${content.length}:${contentPreview}`
  }, [editorState.title, editorState.content])

  /**
   * 执行保存
   * @性能优化 只在内容变化时保存
   * @逻辑说明 已发布文章不保存草稿
   * @returns Promise<void> 保存完成的 Promise
   */
  const doSave = useCallback(async (): Promise<void> => {
    // 已发布文章，不保存草稿（使用 ref 获取最新状态）
    if (isPublishedRef.current) {
      return
    }

    const currentHash = getContentHash()

    // 内容未变化，跳过保存
    if (currentHash === lastSavedHashRef.current) {
      return
    }

    // 有内容才保存
    if (editorState.title || editorState.content) {
      try {
        await saveDraft({ silent: true, skipIfEmpty: true })
        lastSavedHashRef.current = currentHash
        hasUnsavedChangesRef.current = false
      } catch (error) {
        // 保存失败，不更新哈希，下次继续尝试
        console.error('自动保存失败:', error)
      }
    }
  }, [editorState.title, editorState.content, saveDraft, getContentHash])

  /**
   * 防抖保存
   * @性能优化 停止输入 1000ms 后保存，全程不影响编辑
   */
  const debouncedSave = useCallback(() => {
    // 标记有未保存的更改
    hasUnsavedChangesRef.current = true

    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 设置新的定时器，1000ms 后保存
    debounceTimerRef.current = setTimeout(() => {
      void doSave()
    }, 1000)
  }, [doSave])

  /**
   * 同步保存 - 用于 beforeunload
   * @健壮性优化 使用 sendBeacon 确保数据发送
   * @逻辑说明 已发布文章不进行同步保存
   */
  const syncSave = useCallback(() => {
    // 已发布文章，不进行同步保存（使用 ref 获取最新状态）
    if (isPublishedRef.current) {
      return
    }

    const currentHash = getContentHash()

    // 内容未变化，无需保存
    if (currentHash === lastSavedHashRef.current) {
      return
    }

    // 有内容才保存
    if (editorState.title || editorState.content) {
      // 尝试使用 sendBeacon 进行同步保存
      try {
        const data = JSON.stringify({
          title: editorState.title,
          content: editorState.content,
          timestamp: Date.now()
        })

        // 使用 sendBeacon 发送数据（更可靠，页面卸载时也能完成）
        const beaconUrl = '/api/drafts/beacon-save'
        const success = navigator.sendBeacon?.(beaconUrl, new Blob([data], { type: 'application/json' }))

        if (!success) {
          // sendBeacon 失败，回退到同步 XHR（不推荐，但比丢失数据好）
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/drafts/sync-save', false) // false = 同步
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.send(data)
        }
      } catch {
        // 同步保存失败，标记有未保存更改
        hasUnsavedChangesRef.current = true
      }
    }
  }, [editorState.title, editorState.content, getContentHash])

  /**
   * 监听内容变化，触发防抖保存
   * @性能优化 使用 ref 存储防抖函数，避免重复创建
   * @逻辑说明 已发布文章停止自动保存
   */
  useEffect(() => {
    // 已发布文章，停止自动保存
    if (editorState.isPublished) {
      // 清除待执行的防抖定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      return
    }

    debouncedSave()

    // 清理函数：组件卸载时立即保存
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      // 使用同步保存确保数据不丢失（已发布文章不会执行保存）
      syncSave()
    }
    // 注意：依赖 title、content 和 isPublished，确保发布后停止保存
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.title, editorState.content, editorState.isPublished])

  /**
   * 离开页面前保存
   * @体验优化 只在真正有未保存内容时提示用户
   */
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // 检查是否有正在进行的防抖保存
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      const currentHash = getContentHash()

      // 有未保存的内容
      if (currentHash !== lastSavedHashRef.current && (editorState.title || editorState.content)) {
        // 尝试同步保存
        syncSave()

        // 如果同步保存失败（beacon/sync XHR 都失败），提示用户
        if (hasUnsavedChangesRef.current) {
          // 现代浏览器标准：只使用 preventDefault()
          event.preventDefault()
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.title, editorState.content])
}
