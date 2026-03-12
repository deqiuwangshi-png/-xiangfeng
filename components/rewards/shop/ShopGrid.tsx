'use client'

/**
 * 兑换商城组件
 * @module components/rewards/ShopGrid
 * @description 福利中心首页的兑换商城卡片组件，使用真实数据
 */

import { useState, useCallback } from 'react'
import { ShoppingBag, ArrowRight, Loader2 } from '@/components/icons'
import { useShop } from '../hooks'
import { usePoints } from '../hooks'
import { getIconComponent } from '@/components/icons/rewards'

/**
 * 兑换商城组件
 * @returns {JSX.Element} 兑换商城面板
 */
export function ShopGrid() {
  const { items, isLoading, exchange } = useShop()
  const { overview, refreshPoints } = usePoints()
  const [exchangingId, setExchangingId] = useState<string | null>(null)

  const userPoints = overview?.current_points || 0

  // 只展示前6个商品
  const displayItems = items.slice(0, 6)

  /**
   * 处理兑换商品
   * @param {string} itemId - 商品ID
   * @param {number} points - 所需积分
   */
  const handleExchange = useCallback(
    async (itemId: string, points: number) => {
      if (userPoints < points) {
        alert('积分不足')
        return
      }

      setExchangingId(itemId)
      try {
        const result = await exchange(itemId, 1)
        if (result.success) {
          alert(`兑换成功！消耗 ${result.pointsSpent} 积分`)
          // 刷新积分显示
          await refreshPoints()
        } else {
          alert(result.error || '兑换失败')
        }
      } catch {
        alert('兑换失败，请重试')
      } finally {
        setExchangingId(null)
      }
    },
    [userPoints, exchange, refreshPoints]
  )

  // 加载状态
  if (isLoading) {
    return (
      <div className="card-bg rounded-2xl p-6 flex flex-col min-h-[380px]">
        <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-xf-primary" />
          兑换商城
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-xf-light/80 rounded-xl p-3 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mt-1" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 空状态
  if (displayItems.length === 0) {
    return (
      <div className="card-bg rounded-2xl p-6 flex flex-col min-h-[380px]">
        <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-xf-primary" />
          兑换商城
        </h2>
        <div className="flex-1 flex items-center justify-center text-xf-primary">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无商品</p>
            <p className="text-xs mt-1 opacity-60">商品即将上架</p>
          </div>
        </div>
        <div className="mt-4 text-right">
          <a
            href="/rewards/shop"
            className="text-xs text-xf-primary hover:text-xf-accent flex items-center justify-end gap-1"
          >
            更多商品
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="card-bg rounded-2xl p-6 flex flex-col min-h-[380px]">
      <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-xf-primary" />
        兑换商城
      </h2>

      {/* 商品网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
        {displayItems.map((item) => {
          const Icon = getIconComponent(item.icon_name)
          const canAfford = userPoints >= item.points_price
          const isExchanging = exchangingId === item.id

          return (
            <div
              key={item.id}
              className="bg-xf-light/80 rounded-xl p-3 border border-transparent hover:border-xf-primary/30 hover:bg-white hover:shadow-soft transition cursor-pointer text-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: item.icon_color + '20' }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: item.icon_color }}
                />
              </div>
              <div className="font-medium text-sm mt-2 text-xf-dark truncate">
                {item.name}
              </div>
              <div className="text-xf-accent font-bold text-sm">
                {item.points_price}
              </div>
              <button
                className={`
                  mt-2 w-full text-xs py-1.5 rounded-full transition flex items-center justify-center gap-1
                  ${canAfford
                    ? 'bg-white border border-xf-primary/30 text-xf-primary hover:bg-xf-primary hover:text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }
                `}
                disabled={!canAfford || isExchanging}
                onClick={() => handleExchange(item.id, item.points_price)}
              >
                {isExchanging ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    兑换中
                  </>
                ) : (
                  '兑换'
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* 更多商品链接 */}
      <div className="mt-4 text-right">
        <a
          href="/rewards/shop"
          className="text-xs text-xf-primary hover:text-xf-accent flex items-center justify-end gap-1"
        >
          更多商品
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
