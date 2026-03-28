'use client'

/**
 * 防抖导航 Hook
 * @module hooks/useDebouncedNavigation
 * @description 防止用户快速连续点击导致的多次导航
 */

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 防抖导航配置
 * @interface DebouncedNavigationOptions
 */
interface DebouncedNavigationOptions {
  /** 防抖延迟(ms) */
  delay?: number
  /** 是否显示加载状态 */
  showLoading?: boolean
}

/**
 * 防抖导航 Hook
 * @param {DebouncedNavigationOptions} options - 配置选项
 * @returns {object} 导航方法
 */
export function useDebouncedNavigation(options: DebouncedNavigationOptions = {}) {
  const { delay = 300, showLoading = true } = options
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isNavigatingRef = useRef(false)

  /**
   * 防抖导航
   * @param {string} url - 目标URL
   */
  const navigate = useCallback(
    (url: string) => {
      // 如果正在导航中，忽略新请求
      if (isNavigatingRef.current) {
        return
      }

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 设置新的定时器
      timeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = true
        
        if (showLoading) {
          // 可以在这里显示全局加载状态
          document.body.style.cursor = 'wait'
        }

        router.push(url)

        // 导航完成后重置状态
        setTimeout(() => {
          isNavigatingRef.current = false
          if (showLoading) {
            document.body.style.cursor = 'default'
          }
        }, 100)
      }, delay)
    },
    [router, delay, showLoading]
  )

  /**
   * 立即导航（跳过防抖）
   * @param {string} url - 目标URL
   */
  const navigateImmediate = useCallback(
    (url: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      isNavigatingRef.current = true
      router.push(url)
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 100)
    },
    [router]
  )

  /**
   * 取消待处理的导航
   */
  const cancelNavigation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return {
    navigate,
    navigateImmediate,
    cancelNavigation,
    isNavigating: () => isNavigatingRef.current,
  }
}
