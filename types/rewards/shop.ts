/**
 * 商城系统类型定义
 * @module types/rewards/shop
 * @description 商城和兑换相关的数据类型
 */

import type { LucideIcon } from 'lucide-react'
import type { ShopItemCategory, ExchangeStatus } from './common'

/**
 * 商城商品
 * @interface ShopItem
 */
export interface ShopItem {
  /** 商品ID */
  id: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  description: string | null
  /** 商品分类 */
  category: ShopItemCategory
  /** 积分价格 */
  points_price: number
  /** 原价 */
  original_price: number | null
  /** 图标名称 */
  icon_name: string
  /** 图标颜色 */
  icon_color: string
  /** 图片URL */
  image_url: string | null
  /** 库存（-1表示无限） */
  stock: number
  /** 已售数量 */
  sold_count: number
  /** 每日兑换限制 */
  daily_limit: number | null
  /** 每用户总兑换限制 */
  user_total_limit: number | null
  /** 是否上架 */
  is_active: boolean
  /** 排序 */
  sort_order: number
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/**
 * 兑换记录
 * @interface ExchangeRecord
 */
export interface ExchangeRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 商品ID */
  item_id: string
  /** 消耗积分 */
  points_spent: number
  /** 兑换数量 */
  quantity: number
  /** 状态 */
  status: ExchangeStatus
  /** 卡券兑换码 */
  coupon_code: string | null
  /** 卡券使用链接 */
  coupon_url: string | null
  /** 发放时间 */
  issued_at: string | null
  /** 使用时间 */
  used_at: string | null
  /** 过期时间 */
  expires_at: string | null
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/**
 * 兑换记录（含商品详情）
 * @interface ExchangeRecordWithItem
 */
export interface ExchangeRecordWithItem extends ExchangeRecord {
  /** 商品信息 */
  item: {
    /** 商品名称 */
    name: string
    /** 商品图标名称 */
    icon_name: string
    /** 商品图标颜色 */
    icon_color: string
  } | null
}

/**
 * 兑换记录展示项（前端组件用）
 * @interface ExchangeRecordItem
 */
export interface ExchangeRecordItem {
  /** 记录ID */
  id: string
  /** 商品名称 */
  name: string
  /** 消耗积分 */
  points: number
  /** 兑换状态 */
  status: string
  /** 兑换日期（YYYY-MM-DD） */
  date: string
  /** 图标组件 */
  icon: LucideIcon
  /** 图标颜色类名 */
  iconColor: string
}

/**
 * 兑换请求
 * @interface ExchangeRequest
 */
export interface ExchangeRequest {
  /** 商品ID */
  item_id: string
  /** 兑换数量 */
  quantity?: number
}

/**
 * 兑换响应
 * @interface ExchangeResponse
 */
export interface ExchangeResponse {
  /** 是否成功 */
  success: boolean
  /** 兑换记录ID */
  exchange_id: string
  /** 消耗积分 */
  points_spent: number
  /** 剩余积分 */
  remaining_points: number
  /** 卡券兑换码（如适用） */
  coupon_code?: string
  /** 卡券使用链接（如适用） */
  coupon_url?: string
}

/**
 * 商城分类配置
 * @interface ShopCategoryConfig
 */
export interface ShopCategoryConfig {
  /** 分类ID */
  id: ShopItemCategory | 'all'
  /** 分类显示名称 */
  name: string
}

/**
 * 商城分类类型（含'all'）
 * @type ShopCategoryType
 */
export type ShopCategoryType = 'all' | ShopItemCategory
