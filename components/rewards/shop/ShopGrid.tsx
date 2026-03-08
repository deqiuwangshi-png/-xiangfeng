'use client'

/**
 * 兑换商城组件
 * @module components/rewards/ShopGrid
 * @description 福利中心首页的兑换商城卡片组件
 */

import { useState } from 'react'
import { ShoppingBag, ArrowRight, BookOpen, Crown, Coffee, Sticker, GraduationCap, Palette } from '@/components/icons'

/**
 * 商品项接口（首页简化版）
 * @interface ShopItem
 * @description 福利中心首页展示用，无category字段
 */
interface ShopItem {
  id: string
  name: string
  points: number
  icon: React.ElementType
  iconColor: string
}

/**
 * 模拟商品数据
 * @constant mockItems
 */
const mockItems: ShopItem[] = [
  { id: '1', name: '电子书券', points: 500, icon: BookOpen, iconColor: 'text-xf-accent' },
  { id: '2', name: '7天会员', points: 880, icon: Crown, iconColor: 'text-amber-600' },
  { id: '3', name: '咖啡折扣券', points: 200, icon: Coffee, iconColor: 'text-xf-primary' },
  { id: '4', name: '写作课', points: 1500, icon: GraduationCap, iconColor: 'text-xf-info' },
  { id: '5', name: '表情包', points: 80, icon: Sticker, iconColor: 'text-xf-primary' },
  { id: '6', name: '皮肤·半月', points: 320, icon: Palette, iconColor: 'text-xf-accent' },
]

/**
 * 兑换商城组件
 * @returns {JSX.Element} 兑换商城面板
 */
export function ShopGrid() {
  const [items] = useState<ShopItem[]>(mockItems)

  /**
   * 处理兑换商品
   * @param {string} itemId - 商品ID
   */
  const handleExchange = (itemId: string) => {
    {/* TODO: 实现兑换逻辑 */}
  }

  return (
    <div className="card-bg rounded-2xl p-6">
      <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-xf-primary" />
        兑换商城
      </h2>

      {/* 商品网格 - 2列小屏，3列大屏 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="bg-xf-light/80 rounded-xl p-3 border border-transparent hover:border-xf-primary/30 hover:bg-white hover:shadow-soft transition cursor-pointer text-center"
              onClick={() => handleExchange(item.id)}
            >
              <Icon className={`w-8 h-8 ${item.iconColor} mx-auto`} />
              <div className="font-medium text-sm mt-1 text-xf-dark">{item.name}</div>
              <div className="text-xf-accent font-bold text-sm">{item.points}</div>
              <button
                className="mt-2 w-full bg-white border border-xf-primary/30 text-xf-primary text-xs py-1.5 rounded-full hover:bg-xf-primary hover:text-white transition"
                onClick={(e) => {
                  e.stopPropagation()
                  handleExchange(item.id)
                }}
              >
                兑换
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
