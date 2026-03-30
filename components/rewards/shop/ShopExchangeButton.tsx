'use client'

/**
 * 商品兑换按钮组件 (Client Component)
 * @module components/rewards/shop/ShopExchangeButton
 * @description 处理商品兑换交互
 * @优化说明 从ShopFull提取为独立Client Component，支持商品列表改为Server Component
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useShop } from '@/hooks/rewards/useShop'
import { usePoints } from '@/hooks/rewards/usePoints'

interface ShopExchangeButtonProps {
  /** 商品ID */
  itemId: string
  /** 商品名称 */
  itemName: string
  /** 所需积分 */
  pointsCost: number
  /** 用户当前积分 */
  userPoints: number
  /** 是否足够积分 */
  canAfford: boolean
}

/**
 * 商品兑换按钮组件
 * @param {ShopExchangeButtonProps} props - 组件属性
 * @returns {JSX.Element} 兑换按钮
 */
export function ShopExchangeButton({
  itemId,
  itemName,
  pointsCost,
  canAfford,
}: ShopExchangeButtonProps) {
  const { exchange } = useShop()
  const { refreshPoints } = usePoints()
  const [isExchanging, setIsExchanging] = useState(false)

  /**
   * 处理兑换
   */
  const handleExchange = useCallback(async () => {
    if (!canAfford) {
      toast.error('积分不足')
      return
    }

    // 确认对话框
    if (!confirm(`确认兑换 ${itemName}？\n将消耗 ${pointsCost} 灵感币`)) {
      return
    }

    setIsExchanging(true)
    try {
      const result = await exchange(itemId, 1)
      if (result.success) {
        toast.success(`兑换成功！\n${itemName}\n消耗 ${result.pointsSpent} 灵感币\n剩余 ${result.remainingPoints} 灵感币`)
        await refreshPoints()
      } else {
        toast.error(result.error || '兑换失败')
      }
    } catch {
      toast.error('兑换失败，请重试')
    } finally {
      setIsExchanging(false)
    }
  }, [itemId, itemName, pointsCost, canAfford, exchange, refreshPoints])

  return (
    <button
      onClick={handleExchange}
      disabled={isExchanging || !canAfford}
      className={`text-xs px-3 py-1.5 rounded-full transition ${
        isExchanging
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : canAfford
          ? 'bg-xf-accent hover:bg-xf-accent/90 text-white'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      {isExchanging ? '兑换中...' : canAfford ? '兑换' : '积分不足'}
    </button>
  )
}
