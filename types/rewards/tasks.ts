/**
 * 任务系统类型定义
 * @module types/rewards/tasks
 * @description 任务相关的数据类型
 */

import type { TaskCategory, TaskType, TaskStatus } from './common'

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
