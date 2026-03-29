/**
 * 福利中心通用类型定义
 * @module types/rewards/common
 * @description 枚举类型和通用基础类型
 */

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
