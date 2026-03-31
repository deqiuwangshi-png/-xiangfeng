'use client'

/**
 * 积分功能 Hook
 * @module components/rewards/hooks/usePoints
 * @description 管理用户积分总览和积分流水，使用 SWR 缓存优化性能
 */

import useSWR from 'swr'
import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getUserPointsOverview,
  getPointTransactions,
} from '@/lib/rewards/points'
import type { UserPointsOverview, PointTransaction } from '@/types/rewards'

/**
 * usePoints Hook 返回值
 * @interface UsePointsReturn
 */
interface UsePointsReturn {
  /** 积分总览 */
  overview: UserPointsOverview | null
  /** 积分流水 */
  transactions: PointTransaction[]
  /** 是否首次加载中（无缓存数据） */
  isLoading: boolean
  /** 是否在后台验证更新中 */
  isValidating: boolean
  /** 刷新数据 */
  refreshPoints: () => Promise<void>
  /** 加载更多流水 */
  loadMoreTransactions: () => Promise<void>
}

/**
 * 获取积分总览数据
 * @returns {Promise<UserPointsOverview | null>} 积分总览
 */
const fetchPointsOverview = async (): Promise<UserPointsOverview | null> => {
  return await getUserPointsOverview()
}

/**
 * 获取积分流水数据
 * @returns {Promise<PointTransaction[]>} 积分流水列表
 */
const fetchTransactions = async (): Promise<PointTransaction[]> => {
  return await getPointTransactions({ limit: 20, offset: 0 })
}

/**
 * 积分功能 Hook
 * @returns {UsePointsReturn} 积分状态和操作
 */
export function usePoints(): UsePointsReturn {
  const isMountedRef = useRef(true)

  // 组件卸载时设置标记
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // 使用 SWR 获取积分总览 - 5分钟去重，挂载时不自动重新验证
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isValidating: isOverviewValidating,
    mutate: mutateOverview,
  } = useSWR('user-points-overview', fetchPointsOverview, {
    dedupingInterval: 300000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateOnMount: false, // 服务端已提供初始数据，挂载时不重新验证
  })

  // 使用 SWR 获取积分流水 - 30秒去重，挂载时不自动重新验证
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isValidating: isTransactionsValidating,
    mutate: mutateTransactions,
  } = useSWR('user-points-transactions', fetchTransactions, {
    dedupingInterval: 30000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateOnMount: false, // 服务端已提供初始数据，挂载时不重新验证
  })

  // 加载更多流水的偏移量
  const [offset, setOffset] = useState(20)

  /**
   * 刷新积分数据（包括总览和流水）
   * @returns {Promise<void>}
   */
  const refreshPoints = useCallback(async () => {
    if (!isMountedRef.current) return
    await Promise.all([
      mutateOverview(),
      mutateTransactions(),
    ])
  }, [mutateOverview, mutateTransactions])

  /**
   * 加载更多流水
   * @returns {Promise<void>}
   */
  const loadMoreTransactions = useCallback(async () => {
    try {
      const newTransactions = await getPointTransactions({
        limit: 20,
        offset,
      })

      if (newTransactions.length > 0 && isMountedRef.current) {
        await mutateTransactions(
          (currentData) => {
            if (!currentData) return newTransactions
            return [...currentData, ...newTransactions]
          },
          { revalidate: false }
        )
        setOffset((prev) => prev + 20)
      }
    } catch {
      // 加载失败时保持现有数据
      toast.error('加载更多记录失败')
    }
  }, [offset, mutateTransactions])

  // 错误处理：已在SWR配置中处理

  return {
    overview: overview || null,
    transactions,
    isLoading: isOverviewLoading || isTransactionsLoading,
    isValidating: isOverviewValidating || isTransactionsValidating,
    refreshPoints,
    loadMoreTransactions,
  }
}
