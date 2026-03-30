/**
 * 视图类型定义
 * @module types/rewards/views
 * @description 前端视图和聚合数据类型
 */

import type { ShopItem, ExchangeRecord } from './shop'
import type { TaskProgressResponse } from './tasks'

/**
 * 用户积分总览（视图）
 * @interface UserPointsOverview
 */
export interface UserPointsOverview {
  /** 用户ID */
  user_id: string
  /** 当前可用积分 */
  current_points: number
  /** 累计获得积分 */
  total_earned: number
  /** 累计消耗积分 */
  total_spent: number
  /** 当前等级名称 */
  current_level_name: string
  /** 当前等级数字 */
  current_level: number
  /** 等级颜色 */
  level_color: string
  /** 每日签到额外奖励 */
  daily_signin_bonus: number
  /** 任务奖励加成百分比 */
  task_bonus_percent: number
  /** 即将过期积分（7天内） */
  expiring_soon_points: number
  /** 今日是否已签到 */
  has_signed_today: boolean
  /** 连续签到天数 */
  consecutive_days: number
  /** 昨日连续签到天数 */
  yesterday_consecutive_days: number
}

/**
 * 福利中心首页数据
 * @interface RewardsHomeData
 */
export interface RewardsHomeData {
  /** 用户积分总览 */
  points_overview: UserPointsOverview
  /** 今日任务列表 */
  today_tasks: TaskProgressResponse[]
  /** 热门商品 */
  hot_items: ShopItem[]
  /** 最近兑换记录 */
  recent_exchanges: ExchangeRecord[]
}

/**
 * 任务中心数据
 * @interface TaskCenterData
 */
export interface TaskCenterData {
  /** 今日已完成任务数 */
  completed_today: number
  /** 今日总任务数 */
  total_today: number
  /** 灵感积分 */
  inspiration_points: number
  /** 按分类分组的任务 */
  tasks_by_category: Record<string, TaskProgressResponse[]>
}

/**
 * 积分商城数据
 * @interface ShopData
 */
export interface ShopData {
  /** 用户当前积分 */
  user_points: number
  /** 商品列表 */
  items: ShopItem[]
  /** 分类列表 */
  categories: { id: string; name: string }[]
}
