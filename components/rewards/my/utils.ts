/**
 * 工具函数
 * @module components/rewards/my/utils
 * @description 我的奖励页面工具函数
 */

import {
  Coffee,
  Crown,
  Film,
  Music,
  ShoppingBag,
  BookOpen,
  Smartphone,
  CupSoda,
  Palette,
  Sparkles,
  Gift,
  Zap,
  Sticker,
  LucideIcon,
} from '@/components/icons'
import type { ExchangeRecordWithItem, ExchangeRecordItem } from '@/types/rewards'

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
 * 将兑换记录转换为展示格式
 * @param {ExchangeRecordWithItem} record - 兑换记录
 * @returns {ExchangeRecordItem} 展示用记录项
 */
export function mapExchangeToRecord(record: ExchangeRecordWithItem): ExchangeRecordItem {
  const iconName = record.item?.icon_name || 'Gift'
  const iconColor = record.item?.icon_color || ''
  const iconConfig = iconMapping[iconName] || getDefaultIcon()

  return {
    id: record.id,
    name: record.item?.name || '未知商品',
    points: record.points_spent,
    status: record.status,
    date: new Date(record.created_at).toISOString().split('T')[0],
    icon: iconConfig.icon,
    iconColor: iconColor || iconConfig.color,
  }
}
