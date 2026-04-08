'use client'

/**
 * 防抖导航 Hook
 * @module hooks/useDebouncedNavigation
 * @description 防止用户快速连续点击导致的多次导航
 */

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

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
  const isNavigatingRef = useRef(false)

  /**
   * 执行导航
   * @param {string} url - 目标URL
   */
  const performNavigate = useCallback(
    (url: string) => {
      isNavigatingRef.current = true

      if (showLoading) {
        document.body.style.cursor = 'wait'
      }

      router.push(url)

      setTimeout(() => {
        isNavigatingRef.current = false
        if (showLoading) {
          document.body.style.cursor = 'default'
        }
      }, 100)
    },
    [router, showLoading]
  )

  /**
   * 防抖导航
   * @param {string} url - 目标URL
   */
  const debouncedNavigate = useDebounce(performNavigate, delay)

  /**
   * 防抖导航（带状态检查）
   * @param {string} url - 目标URL
   */
  const navigate = useCallback(
    (url: string) => {
      if (isNavigatingRef.current) {
        return
      }
      debouncedNavigate(url)
    },
    [debouncedNavigate]
  )

  /**
   * 立即导航（跳过防抖）
   * @param {string} url - 目标URL
   */
  const navigateImmediate = useCallback(
    (url: string) => {
      isNavigatingRef.current = true
      router.push(url)
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 100)
    },
    [router]
  )

  return {
    navigate,
    navigateImmediate,
    isNavigating: () => isNavigatingRef.current,
  }
}
