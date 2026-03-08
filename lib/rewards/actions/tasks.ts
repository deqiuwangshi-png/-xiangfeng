'use server'

/**
 * 任务系统 Server Actions
 * @module lib/rewards/actions/tasks
 * @description 处理任务查询、进度更新、任务完成检测
 */

import { createClient } from '@/lib/supabase/server'
import type {
  Task,
  UserTaskRecord,
  TaskProgressResponse,
  TaskCategory,
  TaskType,
} from '@/types/rewards'

/**
 * 获取任务列表（按分类）
 * @param {TaskCategory} [category] - 任务分类筛选
 * @returns {Promise<Task[]>} 任务列表
 */
export async function getTasks(category?: TaskCategory): Promise<Task[]> {
  const supabase = await createClient()

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('获取任务列表失败:', error)
    return []
  }

  return data as Task[]
}

/**
 * 获取用户任务进度
 * @param {TaskCategory} [category] - 任务分类筛选
 * @returns {Promise<TaskProgressResponse[]>} 任务进度列表
 */
export async function getUserTaskProgress(
  category?: TaskCategory
): Promise<TaskProgressResponse[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // 获取任务列表
  const tasks = await getTasks(category)

  // 获取用户任务记录
  const { data: records, error } = await supabase
    .from('user_task_records')
    .select('*')
    .eq('user_id', user.id)
    .in(
      'task_id',
      tasks.map((t) => t.id)
    )

  if (error) {
    console.error('获取任务进度失败:', error)
    return []
  }

  const recordMap = new Map(records?.map((r) => [r.task_id, r]))

  return tasks.map((task) => {
    const record = recordMap.get(task.id)
    return {
      task_id: task.id,
      title: task.title,
      current_progress: record?.current_progress || 0,
      target_progress: task.target_count,
      status: record?.status || 'pending',
      reward_points: task.reward_points,
    }
  })
}

/**
 * 更新任务进度（自动检测触发）
 * @param {TaskType} taskType - 任务类型
 * @param {number} [increment=1] - 进度增量
 * @returns {Promise<boolean>} 是否成功
 */
export async function updateTaskProgress(
  taskType: TaskType,
  increment: number = 1
): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // 调用数据库函数更新任务进度
  const { error } = await supabase.rpc('update_task_progress', {
    p_user_id: user.id,
    p_task_type: taskType,
    p_increment: increment,
  })

  if (error) {
    console.error('更新任务进度失败:', error)
    return false
  }

  return true
}

/**
 * 领取任务奖励
 * @param {string} taskId - 任务ID
 * @returns {Promise<{success: boolean; points?: number; error?: string}>} 领取结果
 */
export async function claimTaskReward(
  taskId: string
): Promise<{ success: boolean; points?: number; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '请先登录' }

  // 调用数据库函数领取奖励
  const { data, error } = await supabase.rpc('claim_task_reward', {
    p_user_id: user.id,
    p_task_id: taskId,
  })

  if (error) {
    console.error('领取任务奖励失败:', error)
    return { success: false, error: error.message }
  }

  return { success: true, points: data }
}

/**
 * 获取任务中心数据（灵感任务页面）
 * @returns {Promise<{
 *   completedToday: number;
 *   totalToday: number;
 *   inspirationPoints: number;
 *   tasks: TaskProgressResponse[];
 * }>} 任务中心数据
 */
export async function getTaskCenterData(): Promise<{
  completedToday: number
  totalToday: number
  inspirationPoints: number
  tasks: TaskProgressResponse[]
}> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { completedToday: 0, totalToday: 0, inspirationPoints: 0, tasks: [] }
  }

  // 获取积分总览
  const { data: overview } = await supabase
    .from('user_points_overview')
    .select('current_points, consecutive_days')
    .eq('user_id', user.id)
    .single()

  // 获取今日任务
  const tasks = await getUserTaskProgress('daily')

  const completedToday = tasks.filter((t) => t.status === 'completed' || t.status === 'reward_claimed').length

  return {
    completedToday,
    totalToday: tasks.length,
    inspirationPoints: overview?.current_points || 0,
    tasks,
  }
}

// ============================================
// 任务检测钩子（在相关业务操作中调用）
// ============================================

/**
 * 检测阅读文章任务
 * 在文章阅读时调用
 */
export async function checkReadArticleTask(): Promise<void> {
  await updateTaskProgress('read_article')
}

/**
 * 检测发布文章任务
 * 在文章发布时调用
 */
export async function checkPublishArticleTask(): Promise<void> {
  await updateTaskProgress('publish_article')
}

/**
 * 检测发布想法任务
 * 在想法发布时调用
 */
export async function checkPublishIdeaTask(): Promise<void> {
  await updateTaskProgress('publish_idea')
}

/**
 * 检测点赞文章任务
 * 在文章点赞时调用
 */
export async function checkLikeArticleTask(): Promise<void> {
  await updateTaskProgress('like_article')
}

/**
 * 检测评论文章任务
 * 在发表评论时调用
 */
export async function checkCommentArticleTask(): Promise<void> {
  await updateTaskProgress('comment_article')
}

/**
 * 检测关注用户任务
 * 在关注用户时调用
 */
export async function checkFollowUserTask(): Promise<void> {
  await updateTaskProgress('follow_user')
}

/**
 * 检测收藏文章任务
 * 在收藏文章时调用
 */
export async function checkCollectArticleTask(): Promise<void> {
  await updateTaskProgress('collect_article')
}
