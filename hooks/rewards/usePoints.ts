'use client'

/**
 * 积分功能 Hook
 * @module components/rewards/hooks/usePoints
 * @description 管理用户积分总览和积分流水，使用 SWR 缓存优化性能
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useSWRQuery } from '@/hooks/useSWRQuery'
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
  // 使用通用 SWR Query 获取积分总览
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isValidating: isOverviewValidating,
    refresh: refreshOverview,
  } = useSWRQuery('user-points-overview', fetchPointsOverview, {
    preset: 'default',
    revalidateOnMount: false, // 服务端已提供初始数据
  })

  // 使用通用 SWR Query 获取积分流水
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isValidating: isTransactionsValidating,
    refresh: refreshTransactions,
    mutate: mutateTransactions,
  } = useSWRQuery('user-points-transactions', fetchTransactions, {
    preset: 'short',
    revalidateOnMount: false, // 服务端已提供初始数据
  })

  // 加载更多流水的偏移量
  const [offset, setOffset] = useState(20)

  /**
   * 刷新积分数据（包括总览和流水）
   * @returns {Promise<void>}
   */
  const refreshPoints = useCallback(async () => {
    await Promise.all([refreshOverview(), refreshTransactions()])
  }, [refreshOverview, refreshTransactions])

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

      if (newTransactions.length > 0) {
        await mutateTransactions(
          (currentData) => {
            if (!currentData) return newTransactions
            return [...currentData, ...newTransactions]
          },
          false
        )
        setOffset((prev) => prev + 20)
      }
    } catch {
      toast.error('加载更多记录失败')
    }
  }, [offset, mutateTransactions])

  return {
    overview: overview || null,
    transactions,
    isLoading: isOverviewLoading || isTransactionsLoading,
    isValidating: isOverviewValidating || isTransactionsValidating,
    refreshPoints,
    loadMoreTransactions,
  }
}
