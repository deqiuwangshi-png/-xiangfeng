'use client'

/**
 * 积分商城完整商品网格组件
 * @module components/rewards/ShopFull
 * @description 积分商城子页面的商品展示组件，支持分类筛选，使用真实数据
 */

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { ShopCategoryType } from '@/types/rewards'
import { useShop } from '../hooks'
import { usePoints } from '../hooks'
import { getIconComponent } from '@/components/icons/rewards'
import { Loader2 } from '@/components/icons'

/**
 * 商品网格Props
 * @interface ShopFullProps
 */
interface ShopFullProps {
  /** 当前分类筛选 */
  category: ShopCategoryType
  /** 用户当前积分 */
  userPoints: number
}

/**
 * 积分商城完整商品网格组件
 * @param {ShopFullProps} props - 组件属性
 * @returns {JSX.Element} 商品网格
 */
export function ShopFull({ category, userPoints }: ShopFullProps) {
  const { items, isLoading, exchange } = useShop(
    category === 'all' ? undefined : (category as Exclude<ShopCategoryType, 'all'>)
  )
  const { refreshPoints } = usePoints()
  const [exchangingId, setExchangingId] = useState<string | null>(null)

  /**
   * 处理兑换按钮点击
   * @param {string} itemId - 商品ID
   * @param {string} itemName - 商品名称
   * @param {number} points - 所需积分
   */
  const handleExchange = useCallback(
    async (itemId: string, itemName: string, points: number) => {
      if (userPoints < points) {
        toast.error('积分不足')
        return
      }

      {/* confirm 使用原生确认对话框 */}
      if (!confirm(`确认兑换 ${itemName}？\n将消耗 ${points} 灵感币`)) {
        return
      }

      setExchangingId(itemId)
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
        setExchangingId(null)
      }
    },
    [userPoints, exchange, refreshPoints]
  )

  // 加载状态
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="card-bg rounded-xl p-4 animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-3" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mt-1" />
            <div className="h-8 bg-gray-200 rounded w-full mx-auto mt-3" />
          </div>
        ))}
      </div>
    )
  }

  // 空状态
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-xf-primary">
        <div className="text-4xl mb-2">🛍️</div>
        <div className="text-sm">暂无商品</div>
        <div className="text-xs mt-1 opacity-60">该分类下暂时没有商品</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = getIconComponent(item.icon_name)
        const canAfford = userPoints >= item.points_price
        const isExchanging = exchangingId === item.id

        return (
          <div
            key={item.id}
            className="card-bg rounded-xl p-4 border border-transparent hover:border-xf-primary/30 cursor-pointer text-center transition-all hover:-translate-y-1"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: item.icon_color + '20' }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: item.icon_color }}
              />
            </div>
            <div className="font-medium text-sm mt-3 text-xf-dark">
              {item.name}
            </div>
            <div className="text-xf-accent font-bold text-base mt-1">
              {item.points_price} 灵感币
            </div>
            {/* 库存提示 */}
            {item.stock >= 0 && item.stock < 10 && (
              <div className="text-xs text-rose-500 mt-1">
                仅剩 {item.stock} 件
              </div>
            )}
            <button
              onClick={() => handleExchange(item.id, item.name, item.points_price)}
              disabled={!canAfford || isExchanging}
              className={`
                mt-3 w-full text-xs py-2 rounded-full transition flex items-center justify-center gap-1
                ${canAfford
                  ? 'bg-white border border-xf-primary/30 text-xf-primary hover:bg-xf-primary hover:text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }
              `}
            >
              {isExchanging ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  兑换中...
                </>
              ) : (
                canAfford ? '兑换' : '灵感币不足'
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
