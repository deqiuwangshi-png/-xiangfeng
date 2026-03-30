'use client'

/**
 * 乐观导航 Hook
 * @module hooks/useOptimisticNavigation
 * @description 使用 useTransition 实现非阻塞导航
 */

import { useCallback, useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 乐观导航 Hook
 * @returns {object} 导航状态和方法
 */
export function useOptimisticNavigation() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  /**
   * 乐观导航
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
