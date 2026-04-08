'use client'

/**
 * 商城数据 Hook
 * @module components/rewards/hooks/useShop
 * @description 管理商城商品数据和兑换操作
 */

import { useSWRConfig } from 'swr'
import { useCallback, useState } from 'react'
import { useSWRQuery } from '@/hooks/useSWRQuery'
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
  const { mutate: globalMutate } = useSWRConfig()

  // 使用通用 SWR Query 获取商品数据
  const {
    data: items = [],
    error,
    isLoading,
    refresh: refreshItems,
    mutate,
  } = useSWRQuery(cacheKey, () => fetchItems(category), {
    preset: 'default',
    revalidateOnReconnect: false,
  })

  /**
   * 兑换商品
   * @param {string} itemId - 商品ID
   * @param {number} [quantity] - 数量
   * @returns {Promise<Object>} 兑换结果
   */
  const exchange = useCallback(
    async (itemId: string, quantity: number = 1) => {
      setIsExchanging(true)
      try {
        const result = await exchangeItem({ item_id: itemId, quantity })
        if (result.success) {
          // 兑换成功后刷新商品列表（库存变化）
          await mutate()
          // 刷新兑换记录
          await globalMutate('user-exchange-records')
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
        setIsExchanging(false)
      }
    },
    [globalMutate, mutate]
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
