'use client'

/**
 * 兑换记录 Hook
 * @module components/rewards/hooks/useExchangeRecords
 * @description 管理用户兑换记录，使用 SWR 缓存优化性能
 */

import useSWR from 'swr'
import { getExchangeRecords } from '@/lib/rewards'
import type { ExchangeRecordWithItem } from '@/types/rewards'

/**
 * 查询参数接口
 * @interface ExchangeRecordsParams
 */
interface ExchangeRecordsParams {
  /** 分页限制 */
  limit?: number
  /** 分页偏移 */
  offset?: number
}

/**
 * useExchangeRecords Hook 返回值
 * @interface UseExchangeRecordsReturn
 */
interface UseExchangeRecordsReturn {
  /** 兑换记录列表 */
  records: ExchangeRecordWithItem[]
  /** 是否首次加载中 */
  isLoading: boolean
  /** 是否在后台验证更新中 */
  isValidating: boolean
  /** 刷新数据 */
  refreshRecords: () => Promise<void>
}

/**
 * 获取兑换记录数据
 * @param {ExchangeRecordsParams} params - 查询参数
 * @returns {Promise<ExchangeRecordWithItem[]>} 兑换记录列表
 */
const fetchExchangeRecords = async (
  params: ExchangeRecordsParams = {}
): Promise<ExchangeRecordWithItem[]> => {
  return await getExchangeRecords(params)
}

/**
 * 兑换记录 Hook
 * @param {ExchangeRecordsParams} [params] - 查询参数
 * @returns {UseExchangeRecordsReturn} 兑换记录状态和操作
 */
export function useExchangeRecords(
  params: ExchangeRecordsParams = {}
): UseExchangeRecordsReturn {
  const { limit = 4, offset = 0 } = params

  // 使用 SWR 获取兑换记录 - 1分钟去重，挂载时自动获取
  const {
    data: records = [],
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    ['user-exchange-records', limit, offset],
    () => fetchExchangeRecords({ limit, offset }),
    {
      dedupingInterval: 60000,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  )

  /**
   * 刷新兑换记录
   * @returns {Promise<void>}
   */
  const refreshRecords = async (): Promise<void> => {
    await mutate()
  }

  return {
    records,
    isLoading,
    isValidating,
    refreshRecords,
  }
}
