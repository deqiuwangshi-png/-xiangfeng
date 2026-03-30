/**
 * 等级系统类型定义
 * @module types/rewards/levels
 * @description 等级相关的数据类型
 */

/**
 * 积分等级
 * @interface PointLevel
 */
export interface PointLevel {
  /** 等级ID */
  id: string
  /** 等级数字（1-10） */
  level: number
  /** 等级名称 */
  name: string
  /** 最低积分要求 */
  min_points: number
  /** 最高积分（null表示无上限） */
  max_points: number | null
  /** 每日签到额外奖励 */
  daily_signin_bonus: number
  /** 任务奖励加成百分比 */
  task_bonus_percent: number
  /** 图标名称 */
  icon_name: string
  /** 图标颜色 */
  icon_color: string
  /** 徽章图片URL */
  badge_url: string | null
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
 * 用户等级记录
 * @interface UserLevelRecord
 */
export interface UserLevelRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 等级ID */
  level_id: string
  /** 等级数字 */
  level: number
  /** 升级时的累计积分 */
  total_earned_at_upgrade: number
  /** 升级时间 */
  upgraded_at: string
  /** 创建时间 */
  created_at: string
}

/**
 * 等级配置项（前端展示用）
 * @interface LevelConfig
 */
export interface LevelConfig {
  /** 等级数字 */
  level: number
  /** 等级名称 */
  name: string
  /** 最低积分 */
  minPoints: number
  /** 最高积分（null表示无上限） */
  maxPoints: number | null
  /** 每日签到额外奖励 */
  dailyBonus: number
  /** 任务奖励加成 */
  taskBonus: number
  /** 等级描述 */
  description: string
}
