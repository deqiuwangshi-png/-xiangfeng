/**
 * 签到系统类型定义
 * @module types/rewards/signin
 * @description 签到相关的数据类型
 */

/**
 * 签到记录
 * @interface SignInRecord
 */
export interface SignInRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 签到日期 */
  sign_date: string
  /** 获得积分 */
  points_earned: number
  /** 连续签到天数 */
  consecutive_days: number
  /** 是否为奖励日 */
  is_bonus_day: boolean
  /** 创建时间 */
  created_at: string
}

/**
 * 连续签到奖励配置
 * @interface SignInReward
 */
export interface SignInReward {
  /** 配置ID */
  id: string
  /** 第几天（1-7） */
  day_number: number
  /** 积分奖励 */
  points_reward: number
  /** 是否为大奖日 */
  is_bonus: boolean
  /** 大奖额外积分 */
  bonus_extra_points: number
  /** 描述 */
  description: string | null
  /** 是否启用 */
  is_active: boolean
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/**
 * 签到响应
 * @interface SignInResponse
 */
export interface SignInResponse {
  /** 是否成功 */
  success: boolean
  /** 获得积分 */
  points_earned: number
  /** 连续签到天数 */
  consecutive_days: number
  /** 是否为奖励日 */
  is_bonus_day: boolean
  /** 当前总积分 */
  current_points: number
  /** 错误信息 */
  error?: string
}
