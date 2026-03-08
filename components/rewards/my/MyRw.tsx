'use client'

/**
 * 我的兑换组件
 * @module components/rewards/MyRw
 * @description 显示用户已兑换的物品列表
 */

import { useState } from 'react'
import { Archive, ArrowRight, BookOpen, Crown, Coffee, Sticker } from '@/components/icons'

/**
 * 兑换状态类型
 * @type RwStatus
 */
type RwStatus = 'issued' | 'pending' | 'used'

/**
 * 兑换项接口
 * @interface RwItem
 */
interface RwItem {
  id: string
  name: string
  date: string
  points: number
  status: RwStatus
  icon: React.ElementType
  iconColor: string
}

/**
 * 模拟兑换数据
 * @constant mockItems
 */
const mockItems: RwItem[] = [
  { id: '1', name: '电子书券', date: '2024-05-12', points: 500, status: 'issued', icon: BookOpen, iconColor: 'text-xf-accent' },
  { id: '2', name: '7天会员', date: '2024-05-10', points: 880, status: 'issued', icon: Crown, iconColor: 'text-amber-600' },
  { id: '3', name: '咖啡折扣券', date: '2024-05-08', points: 200, status: 'pending', icon: Coffee, iconColor: 'text-xf-primary' },
  { id: '4', name: '表情包', date: '2024-05-05', points: 80, status: 'used', icon: Sticker, iconColor: 'text-xf-primary' },
]

/**
 * 状态配置
 * @constant statusConfig
 */
const statusConfig: Record<RwStatus, { label: string; bgColor: string; textColor: string }> = {
  issued: { label: '已发放', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  pending: { label: '待使用', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  used: { label: '已使用', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
}

/**
 * 我的兑换组件
 * @returns {JSX.Element} 我的兑换面板
 */
export function MyRw() {
  const [items] = useState<RwItem[]>(mockItems)

  return (
    <div className="card-bg rounded-2xl p-6 mb-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-bold text-xf-dark flex items-center gap-2">
          <Archive className="w-5 h-5 text-xf-primary" />
          我的兑换
        </h2>
        <a
          href="#"
          className="text-xs text-xf-primary hover:text-xf-accent flex items-center gap-1"
        >
          查看全部
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* 兑换列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon
          const status = statusConfig[item.status]

          return (
            <div
              key={item.id}
              className="bg-xf-light/80 rounded-xl p-3 flex items-start gap-2 border border-xf-bg/30"
            >
              <Icon className={`w-6 h-6 ${item.iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate text-xf-dark">{item.name}</div>
                <div className="text-xs text-xf-primary">{item.date}</div>
                <span className="text-xs text-xf-accent font-semibold">{item.points}积分</span>
              </div>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${status.bgColor} ${status.textColor}`}
              >
                {status.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
