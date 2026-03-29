'use client'

/**
 * 我的兑换组件
 * @module components/rewards/MyRw
 * @description 显示用户已兑换的物品列表（首页预览）
 */

import { useMemo } from 'react'
import {
  Archive,
  ArrowRight,
  BookOpen,
  Crown,
  Coffee,
  Sticker,
  Gift,
  ShoppingBag,
  Film,
  Music,
  Smartphone,
  CupSoda,
  Palette,
  Sparkles,
  Zap,
  type LucideIcon,
} from '@/components/icons'
import { useExchangeRecords } from '@/hooks/rewards/useExchangeRecords'
import type { ExchangeRecordWithItem, ExchangeStatus } from '@/types/rewards'

/**
 * 兑换项展示接口
 * @interface RwItem
 */
interface RwItem {
  id: string
  name: string
  date: string
  points: number
  status: ExchangeStatus
  icon: LucideIcon
  iconColor: string
}

/**
 * 图标映射配置
 * @constant iconMapping
 */
const iconMapping: Record<string, { icon: LucideIcon; color: string }> = {
  Coffee: { icon: Coffee, color: 'text-xf-primary' },
  Film: { icon: Film, color: 'text-xf-accent' },
  Music: { icon: Music, color: 'text-xf-accent' },
  Crown: { icon: Crown, color: 'text-amber-600' },
  ShoppingBag: { icon: ShoppingBag, color: 'text-xf-primary' },
  Bookmark: { icon: BookOpen, color: 'text-xf-primary' },
  Smartphone: { icon: Smartphone, color: 'text-xf-primary' },
  CupSoda: { icon: CupSoda, color: 'text-xf-info' },
  BookOpen: { icon: BookOpen, color: 'text-xf-accent' },
  Palette: { icon: Palette, color: 'text-purple-600' },
  Sparkles: { icon: Sparkles, color: 'text-rose-500' },
  Gift: { icon: Gift, color: 'text-rose-500' },
  Zap: { icon: Zap, color: 'text-amber-600' },
  Sticker: { icon: Sticker, color: 'text-xf-primary' },
}

/**
 * 获取默认图标配置
 * @returns {Object} 默认图标和颜色
 */
function getDefaultIcon() {
  return { icon: Gift, color: 'text-xf-accent' }
}

/**
 * 状态配置
 * @constant statusConfig
 */
const statusConfig: Record<
  Exclude<ExchangeStatus, 'pending' | 'processing'>,
  { label: string; bgColor: string; textColor: string }
> = {
  issued: { label: '已发放', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  used: { label: '已使用', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  expired: { label: '已过期', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
  cancelled: { label: '已取消', bgColor: 'bg-red-100', textColor: 'text-red-700' },
}

/**
 * 获取状态显示配置
 * @param {ExchangeStatus} status - 兑换状态
 * @returns {Object} 状态显示配置
 */
function getStatusConfig(status: ExchangeStatus) {
  // pending 和 processing 统一显示为"准备中"
  if (status === 'pending' || status === 'processing') {
    return { label: '准备中', bgColor: 'bg-amber-100', textColor: 'text-amber-700' }
  }
  return statusConfig[status]
}

/**
 * 将兑换记录转换为展示格式
 * @param {ExchangeRecordWithItem} record - 兑换记录
 * @returns {RwItem} 展示用记录项
 */
function mapExchangeToItem(record: ExchangeRecordWithItem): RwItem {
  const iconConfig = iconMapping[record.item?.icon_name || ''] || getDefaultIcon()

  return {
    id: record.id,
    name: record.item?.name || '未知商品',
    date: new Date(record.created_at).toISOString().split('T')[0],
    points: record.points_spent,
    status: record.status,
    icon: iconConfig.icon,
    iconColor: record.item?.icon_color || iconConfig.color,
  }
}

/**
 * 我的兑换组件
 * @returns {JSX.Element} 我的兑换面板
 */
export function MyRw() {
  const { records, isLoading } = useExchangeRecords({ limit: 4 })

  /**
   * 转换后的展示数据（只取前4条）
   */
  const items = useMemo(() => {
    return records.slice(0, 4).map(mapExchangeToItem)
  }, [records])

  /**
   * 加载中状态
   */
  if (isLoading) {
    return (
      <div className="card-bg rounded-2xl p-6 mb-8">
        {/* 头部骨架 */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        {/* 卡片骨架 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-xf-light/80 rounded-xl p-3 flex items-start gap-2 border border-xf-bg/30 animate-pulse"
            >
              <div className="w-6 h-6 bg-gray-200 rounded shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card-bg rounded-2xl p-6 mb-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-bold text-xf-dark flex items-center gap-2">
          <Archive className="w-5 h-5 text-xf-primary" />
          历史记录
        </h2>
        <a
          href="/rewards/my"
          className="text-xs text-xf-primary hover:text-xf-accent flex items-center gap-1"
        >
          查看全部
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* 兑换列表 */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item) => {
            const Icon = item.icon
            const status = getStatusConfig(item.status)

            return (
              <div
                key={item.id}
                className="bg-xf-light/80 rounded-xl p-3 flex items-start gap-2 border border-xf-bg/30"
              >
                <Icon className={`w-6 h-6 ${item.iconColor} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-xf-dark">
                    {item.name}
                  </div>
                  <div className="text-xs text-xf-primary">{item.date}</div>
                  <span className="text-xs text-xf-accent font-semibold">
                    {item.points}灵感币
                  </span>
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
      ) : (
        <div className="text-center py-8 text-xf-primary">
          <div className="text-3xl mb-2">🎁</div>
          <div className="text-sm">暂无兑换记录</div>
          <a
            href="/rewards/shop"
            className="text-xs text-xf-primary hover:text-xf-accent mt-2 inline-block"
          >
            去商城看看 →
          </a>
        </div>
      )}
    </div>
  )
}
