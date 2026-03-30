/**
 * 积分系统类型定义
 * @module types/rewards/points
 * @description 积分相关的数据类型
 */

import type { PointTransactionType, PointSourceType } from './common'

/**
 * 用户积分
 * @interface UserPoints
 */
export interface UserPoints {
  /** 用户ID */
  user_id: string
  /** 当前可用积分 */
  current_points: number
  /** 累计获得积分（用于等级计算） */
  total_earned: number
  /** 累计消耗积分 */
  total_spent: number
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/**
 * 积分有效期记录
 * @interface PointExpiration
 */
export interface PointExpiration {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 关联交易ID */
  transaction_id: string | null
  /** 获得积分数量 */
  amount: number
  /** 剩余未消耗积分 */
  remaining: number
  /** 获得时间 */
  earned_at: string
  /** 过期时间 */
  expires_at: string
  /** 是否已完全消耗 */
  is_fully_consumed: boolean
  /** 创建时间 */
  created_at: string
}

/**
 * 积分流水
 * @interface PointTransaction
 */
export interface PointTransaction {
  /** 流水ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 交易类型 */
  type: PointTransactionType
  /** 变动数量 */
  amount: number
  /** 变动后余额 */
  balance_after: number
  /** 来源类型 */
  source: PointSourceType
  /** 关联记录ID */
  source_id: string | null
  /** 描述 */
  description: string | null
  /** 创建时间 */
  created_at: string
}
