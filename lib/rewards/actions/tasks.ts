'use server'

/**
 * 任务系统 Server Actions
 * @module lib/rewards/actions/tasks
 * @description 处理任务查询、进度更新、任务完成检测
 */

import { createClient } from '@/lib/supabase/server'
import type {
  Task,
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
  try {
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

    if (!data || !Array.isArray(data)) {
      return []
    }

    return data as Task[]
  } catch (err) {
    console.error('获取任务列表异常:', (err as Error)?.message)
    return []
  }
}

/**
 * 获取用户任务进度
 * @param {TaskCategory} [category] - 任务分类筛选
 * @returns {Promise<TaskProgressResponse[]>} 任务进度列表
 */
export async function getUserTaskProgress(
  category?: TaskCategory
): Promise<TaskProgressResponse[]> {
  try {
    const supabase = await createClient()

    // 获取任务列表（常驻显示，即使用户未登录）
    const tasks = await getTasks(category)

    // 如果 tasks 为空，直接返回空数组
    if (!tasks || tasks.length === 0) {
      return []
    }

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()

    // 如果用户未登录，返回默认状态的任务列表
    if (!user) {
      return tasks.map((task) => ({
        task_id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        icon_name: task.icon_name,
        icon_color: task.icon_color,
        current_progress: 0,
        target_progress: task.target_count,
        status: 'pending' as const,
        reward_points: task.reward_points,
      }))
    }

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
      // 出错时仍返回默认状态的任务列表
      return tasks.map((task) => ({
        task_id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        icon_name: task.icon_name,
        icon_color: task.icon_color,
        current_progress: 0,
        target_progress: task.target_count,
        status: 'pending' as const,
        reward_points: task.reward_points,
      }))
    }

    const recordMap = new Map(records?.map((r) => [r.task_id, r]))

    return tasks.map((task) => {
      const record = recordMap.get(task.id)
      return {
        task_id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        icon_name: task.icon_name,
        icon_color: task.icon_color,
        current_progress: record?.current_progress || 0,
        target_progress: task.target_count,
        status: record?.status || 'pending',
        reward_points: task.reward_points,
      }
    })
  } catch (err) {
    console.error('获取用户任务进度异常:', (err as Error)?.message)
    return []
  }
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

  // 调用安全进度更新函数（带参数校验和增量限制）
  const { error } = await supabase.rpc('safe_update_task_prog', {
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

  // 调用安全领取函数（带并发保护）
  const { data, error } = await supabase.rpc('safe_claim_task_reward', {
    p_user_id: user.id,
    p_task_id: taskId,
  })

  if (error) {
    console.error('领取任务奖励失败:', error)
    return { success: false, error: error.message }
  }

  // 解析返回的 JSON 结果
  const result = data as { success: boolean; points?: number; error?: string }
  if (!result.success) {
    return { success: false, error: result.error || '领取失败' }
  }

  return { success: true, points: result.points }
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

// ============================================
// 任务接取功能
// ============================================

/**
 * 接取任务
 * @param {string} taskId - 任务ID
 * @returns {Promise<{success: boolean; error?: string}>} 接取结果
 */
export async function acceptTask(
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '请先登录' }

  // 获取任务信息
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (taskError || !task) {
    return { success: false, error: '任务不存在' }
  }

  // 计算周期
  const now = new Date()
  let periodStart: string | null = null
  let periodEnd: string | null = null

  switch (task.category) {
    case 'daily':
      periodStart = now.toISOString().split('T')[0]
      periodEnd = periodStart
      break
    case 'weekly': {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(now.setDate(diff))
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      periodStart = monday.toISOString().split('T')[0]
      periodEnd = sunday.toISOString().split('T')[0]
      break
    }
    case 'monthly':
      periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      periodEnd = lastDay.toISOString().split('T')[0]
      break
    default:
      periodStart = null
      periodEnd = null
  }

  // 检查是否已接取
  const { data: existing } = await supabase
    .from('user_task_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('task_id', taskId)
    .eq('period_start', periodStart)
    .single()

  if (existing) {
    return { success: false, error: '已接取该任务' }
  }

  // 检查进行中的任务数量（限制5个）
  const { count: activeCount } = await supabase
    .from('user_task_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'in_progress')

  if (activeCount && activeCount >= 5) {
    return { success: false, error: '最多同时接取5个任务' }
  }

  // 创建任务记录
  const { error: insertError } = await supabase.from('user_task_records').insert({
    user_id: user.id,
    task_id: taskId,
    current_progress: 0,
    target_progress: task.target_count,
    status: 'in_progress',
    started_at: new Date().toISOString(),
    period_start: periodStart,
    period_end: periodEnd,
  })

  if (insertError) {
    console.error('接取任务失败:', insertError)
    return { success: false, error: '接取失败，请重试' }
  }

  return { success: true }
}
