'use client'

/**
 * 商城数据 Hook
 * @module components/rewards/hooks/useShop
 * @description 管理商城商品数据和兑换操作
 */

import useSWR from 'swr'
import { useCallback, useState, useRef, useEffect } from 'react'
import { getShopItems, exchangeItem } from '@/lib/rewards/shop'
import type { ShopItem, ShopItemCategory } from '@/types/rewards'

/**
 * useShop Hook 返回值
 * @interface UseShopReturn
 */
interface UseShopReturn {
  /** 商品列表 */
  items: ShopItem[]
  /** 是否加载中 */
  isLoading: boolean
  /** 错误信息 */
  error: Error | null
  /** 刷新商品列表 */
  refreshItems: () => Promise<void>
  /** 兑换商品 */
  exchange: (itemId: string, quantity?: number) => Promise<{
    success: boolean
    pointsSpent?: number
    remainingPoints?: number
    error?: string
  }>
  /** 是否正在兑换 */
  isExchanging: boolean
}

/**
 * 获取商品数据
 * @param {ShopItemCategory} category - 商品分类
 * @returns {Promise<ShopItem[]>} 商品列表
 */
const fetchItems = async (category?: ShopItemCategory): Promise<ShopItem[]> => {
  return await getShopItems({ category })
}

/**
 * 商城数据 Hook
 * @param {ShopItemCategory} [category] - 商品分类筛选
 * @returns {UseShopReturn} 商城状态和操作
 */
export function useShop(category?: ShopItemCategory): UseShopReturn {
  const cacheKey = category ? `shop-${category}` : 'shop-all'
  const [isExchanging, setIsExchanging] = useState(false)
  const isMountedRef = useRef(true)

  // 组件卸载时设置标记
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // 使用 SWR 获取商品数据 - 5分钟缓存
  const {
    data: items = [],
    error,
    isLoading,
    mutate,
  } = useSWR(cacheKey, () => fetchItems(category), {
    dedupingInterval: 300000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  })

  /**
   * 刷新商品数据
   * @returns {Promise<void>}
   */
  const refreshItems = useCallback(async () => {
    if (!isMountedRef.current) return
    await mutate()
  }, [mutate])

  /**
   * 兑换商品
   * @param {string} itemId - 商品ID
   * @param {number} [quantity] - 数量
   * @returns {Promise<Object>} 兑换结果
   */
  const exchange = useCallback(
    async (itemId: string, quantity: number = 1) => {
      if (!isMountedRef.current) {
        return { success: false, error: '组件已卸载' }
      }
      
      setIsExchanging(true)
      try {
        const result = await exchangeItem({ item_id: itemId, quantity })
        if (result.success && isMountedRef.current) {
          // 兑换成功后刷新商品列表（库存变化）
          await mutate()
          return {
            success: true,
            pointsSpent: result.points_spent,
            remainingPoints: result.remaining_points,
          }
        }
        return { success: false, error: '兑换失败' }
      } catch (err) {
        const msg = err instanceof Error ? err.message : '兑换失败'
        return { success: false, error: msg }
      } finally {
        if (isMountedRef.current) {
          setIsExchanging(false)
        }
      }
    },
    [mutate]
  )

  return {
    items,
    isLoading,
    error,
    refreshItems,
    exchange,
    isExchanging,
  }
}
