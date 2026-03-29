/**
 * 福利中心类型定义统一出口
 * @module types/rewards
 * @description 积分、签到、任务、等级、商城系统的类型定义
 */

// ============================================
// 通用类型
// ============================================
export type {
  PointTransactionType,
  PointSourceType,
  TaskCategory,
  TaskType,
  TaskStatus,
  ShopItemCategory,
  ExchangeStatus,
} from './common'

// ============================================
// 积分系统
// ============================================
export type { UserPoints, PointExpiration, PointTransaction } from './points'

// ============================================
// 签到系统
// ============================================
export type { SignInRecord, SignInReward, SignInResponse } from './signin'

// ============================================
// 任务系统
// ============================================
export type {
  Task,
  UserTaskRecord,
  TaskProgressResponse,
  TaskCategoryConfig,
} from './tasks'

// ============================================
// 等级系统
// ============================================
export type {
  PointLevel,
  UserLevelRecord,
  LevelConfig,
} from './levels'

// ============================================
// 商城系统
// ============================================
export type {
  ShopItem,
  ExchangeRecord,
  ExchangeRecordWithItem,
  ExchangeRecordItem,
  ExchangeRequest,
  ExchangeResponse,
  ShopCategoryConfig,
  ShopCategoryType,
} from './shop'

// ============================================
// 视图类型
// ============================================
export type {
  UserPointsOverview,
  RewardsHomeData,
  TaskCenterData,
  ShopData,
} from './views'
