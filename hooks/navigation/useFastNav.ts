'use client'

/**
 * 快速导航 Hook
 * @module hooks/useFastNav
 * @description 使用 useTransition 实现非阻塞导航
 */

import { useCallback, useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 快速导航 Hook
 * @returns {object} 导航状态和方法
 */
export function useFastNav() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  /**
   * 快速导航
   * @param {string} url - 目标URL
   */
  const navigate = useCallback(
    (url: string) => {
      setPendingUrl(url)

      startTransition(() => {
        router.push(url)

        // 导航完成后清除pending状态
        setTimeout(() => {
          setPendingUrl(null)
        }, 100)
      })
    },
    [router, startTransition]
  )

  /**
   * 预加载页面
   * @param {string} url - 目标URL
   */
  const prefetch = useCallback(
    (url: string) => {
      router.prefetch(url)
    },
    [router]
  )

  return {
    navigate,
    prefetch,
    isPending,
    pendingUrl,
  }
}
