'use client'

/**
 * 积分商城完整商品网格组件
 * @module components/rewards/ShopFull
 * @description 积分商城子页面的商品展示组件，支持分类筛选
 */

import { useState, useMemo } from 'react'
import type { ShopCategoryType } from '@/types/rewards'
import {
  Film,
  Music,
  ShoppingBag,
  Bookmark,
  Smartphone,
  BookOpen,
  CupSoda,
  Palette,
  Sparkles,
  Gift,
  Crown,
  Zap,
  Coffee,
} from '@/components/icons'

/**
 * 商品项接口（前端展示用）
 * @interface ShopItem
 */
interface ShopItem {
  id: string
  name: string
  points: number
  category: ShopCategoryType
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

/**
 * 模拟商品数据
 * @constant mockItems
 */
const mockItems: ShopItem[] = [
  // 卡券类
  { id: '1', name: '咖啡兑换券', points: 200, category: 'card', icon: Coffee, iconColor: 'text-xf-accent', iconBg: 'bg-xf-accent/10' },
  { id: '2', name: '视频月卡', points: 600, category: 'card', icon: Film, iconColor: 'text-xf-accent', iconBg: 'bg-xf-accent/10' },
  { id: '3', name: '音乐季卡', points: 800, category: 'card', icon: Music, iconColor: 'text-xf-accent', iconBg: 'bg-xf-accent/10' },
  // 周边类
  { id: '4', name: '帆布袋', points: 1200, category: 'merch', icon: ShoppingBag, iconColor: 'text-xf-primary', iconBg: 'bg-xf-primary/10' },
  { id: '5', name: '金属书签', points: 350, category: 'merch', icon: Bookmark, iconColor: 'text-xf-primary', iconBg: 'bg-xf-primary/10' },
  { id: '6', name: '手机支架', points: 280, category: 'merch', icon: Smartphone, iconColor: 'text-xf-primary', iconBg: 'bg-xf-primary/10' },
  // 实体类
  { id: '7', name: '精装笔记本', points: 900, category: 'physical', icon: BookOpen, iconColor: 'text-xf-info', iconBg: 'bg-xf-info/10' },
  { id: '8', name: '保温杯', points: 1500, category: 'physical', icon: CupSoda, iconColor: 'text-xf-info', iconBg: 'bg-xf-info/10' },
  // 皮肤类
  { id: '9', name: '极简白', points: 500, category: 'skin', icon: Palette, iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
  { id: '10', name: '墨韵黑', points: 500, category: 'skin', icon: Palette, iconColor: 'text-gray-700', iconBg: 'bg-gray-200' },
  { id: '11', name: '樱花粉', points: 600, category: 'skin', icon: Palette, iconColor: 'text-pink-500', iconBg: 'bg-pink-100' },
  // 抽奖类
  { id: '12', name: '幸运抽奖', points: 100, category: 'lottery', icon: Sparkles, iconColor: 'text-rose-500', iconBg: 'bg-rose-100' },
  { id: '13', name: '高级抽奖', points: 500, category: 'lottery', icon: Gift, iconColor: 'text-rose-500', iconBg: 'bg-rose-100' },
  // 代币类
  { id: '14', name: '100 灵感币', points: 100, category: 'token', icon: Zap, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  { id: '15', name: '500 灵感币', points: 450, category: 'token', icon: Zap, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  { id: '16', name: '月度会员', points: 880, category: 'card', icon: Crown, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
]

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
  const [items] = useState<ShopItem[]>(mockItems)

  /**
   * 根据分类筛选商品
   */
  const filteredItems = useMemo(() => {
    if (category === 'all') return items
    return items.filter((item) => item.category === category)
  }, [items, category])

  /**
   * 处理兑换按钮点击
   * @param {string} itemName - 商品名称
   * @param {number} points - 所需积分
   */
  const handleExchange = (itemName: string, points: number) => {
    if (userPoints >= points) {
      alert(`兑换成功：${itemName}，消耗 ${points} 积分`)
    } else {
      alert(`积分不足，还需 ${points - userPoints} 积分`)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const canAfford = userPoints >= item.points

        return (
          <div
            key={item.id}
            className="card-bg rounded-xl p-4 border border-transparent hover:border-xf-primary/30 cursor-pointer text-center transition-all hover:-translate-y-1"
          >
            <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center mx-auto`}>
              <Icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <div className="font-medium text-sm mt-3 text-xf-dark">{item.name}</div>
            <div className="text-xf-accent font-bold text-base mt-1">{item.points}</div>
            <button
              onClick={() => handleExchange(item.name, item.points)}
              disabled={!canAfford}
              className={`
                mt-3 w-full text-xs py-2 rounded-full transition
                ${canAfford
                  ? 'bg-white border border-xf-primary/30 text-xf-primary hover:bg-xf-primary hover:text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }
              `}
            >
              {canAfford ? '兑换' : '积分不足'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
