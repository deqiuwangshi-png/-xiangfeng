/**
 * 福利中心类型定义
 * @module types/rewards
 * @description 积分系统、签到系统、任务系统、等级系统、商城系统的类型定义
 */

// ============================================
// 枚举类型
// ============================================

/**
 * 积分交易类型
 * @type PointTransactionType
 */
export type PointTransactionType = 'earn' | 'spend' | 'expire' | 'refund'

/**
 * 积分来源类型
 * @type PointSourceType
 */
export type PointSourceType =
  | 'signin'
  | 'signin_bonus'
  | 'task_daily'
  | 'task_weekly'
  | 'task_monthly'
  | 'task_yearly'
  | 'task_event'
  | 'exchange'
  | 'exchange_refund'
  | 'expire'
  | 'system'
  | 'reward_send'
  | 'reward_receive'

/**
 * 任务分类
 * @type TaskCategory
 */
export type TaskCategory = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'event'

/**
 * 任务类型（用于自动检测）
 * @type TaskType
 */
export type TaskType =
  | 'read_article'
  | 'publish_article'
  | 'publish_idea'
  | 'like_article'
  | 'comment_article'
  | 'share_article'
  | 'follow_user'
  | 'collect_article'
  | 'invite_friend'
  | 'complete_profile'
  | 'custom'

/**
 * 任务状态
 * @type TaskStatus
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'reward_claimed'

/**
 * 商品分类
 * @type ShopItemCategory
 */
export type ShopItemCategory = 'card' | 'merch' | 'physical' | 'lottery' | 'skin'

/**
 * 兑换状态
 * @type ExchangeStatus
 */
export type ExchangeStatus = 'pending' | 'processing' | 'issued' | 'used' | 'expired' | 'cancelled'

// ============================================
// 数据库实体类型
// ============================================

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
 * 任务定义
 * @interface Task
 */
export interface Task {
  /** 任务ID */
  id: string
  /** 任务标题 */
  title: string
  /** 任务描述 */
  description: string | null
  /** 任务分类 */
  category: TaskCategory
  /** 任务类型（用于自动检测） */
  type: TaskType
  /** 奖励积分 */
  reward_points: number
  /** 目标数量 */
  target_count: number
  /** 图标名称 */
  icon_name: string
  /** 图标颜色 */
  icon_color: string
  /** 排序 */
  sort_order: number
  /** 活动开始时间 */
  start_at: string | null
  /** 活动结束时间 */
  end_at: string | null
  /** 是否启用 */
  is_active: boolean
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

/**
 * 用户任务记录
 * @interface UserTaskRecord
 */
export interface UserTaskRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 任务ID */
  task_id: string
  /** 当前进度 */
  current_progress: number
  /** 目标进度 */
  target_progress: number
  /** 状态 */
  status: TaskStatus
  /** 开始时间 */
  started_at: string | null
  /** 完成时间 */
  completed_at: string | null
  /** 奖励发放时间 */
  rewarded_at: string | null
  /** 周期开始日期 */
  period_start: string | null
  /** 周期结束日期 */
  period_end: string | null
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string
}

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

// ============================================
// 视图类型
// ============================================

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

// ============================================
// API 请求/响应类型
// ============================================

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

/**
 * 任务进度响应
 * @interface TaskProgressResponse
 */
export interface TaskProgressResponse {
  /** 任务ID */
  task_id: string
  /** 任务标题 */
  title: string
  /** 任务描述 */
  description: string | null
  /** 任务分类 */
  category: TaskCategory
  /** 图标名称 */
  icon_name: string
  /** 图标颜色 */
  icon_color: string
  /** 当前进度 */
  current_progress: number
  /** 目标进度 */
  target_progress: number
  /** 状态 */
  status: TaskStatus
  /** 奖励积分 */
  reward_points: number
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

// ============================================
// 前端展示类型
// ============================================

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
  tasks_by_category: Record<TaskCategory, TaskProgressResponse[]>
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
  categories: { id: ShopItemCategory; name: string }[]
}

// ============================================
// 前端组件类型
// ============================================

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

/**
 * 任务分类配置
 * @interface TaskCategoryConfig
 */
export interface TaskCategoryConfig {
  /** 分类ID */
  id: TaskCategory | 'all'
  /** 分类显示名称 */
  name: string
  /** 分类图标 */
  icon?: string
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
