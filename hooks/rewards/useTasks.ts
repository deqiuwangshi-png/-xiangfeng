'use client'

/**
 * 任务数据 Hook
 * @module components/rewards/hooks/useTasks
 * @description 管理用户任务数据，使用 SWR 缓存优化性能
 */

import useSWR from 'swr'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  getUserTaskProgress,
  claimTaskReward,
  acceptTask,
} from '@/lib/rewards/tasks'
import type { TaskProgressResponse, TaskCategory } from '@/types/rewards'

/**
 * useTasks Hook 返回值
 * @interface UseTasksReturn
 */
interface UseTasksReturn {
  /** 任务列表 */
  tasks: TaskProgressResponse[]
  /** 是否首次加载中（无缓存数据） */
  isLoading: boolean
  /** 是否在后台验证更新中 */
  isValidating: boolean
  /** 错误信息 */
  error: Error | null
  /** 正在领取奖励的任务ID集合 */
  claimingTaskIds: Set<string>
  /** 正在接取的任务ID集合 */
  acceptingTaskIds: Set<string>
  /** 刷新任务数据 */
  refreshTasks: () => Promise<void>
  /** 领取任务奖励 */
  claimReward: (taskId: string) => Promise<{ success: boolean; points?: number; error?: string }>
  /** 接取任务 */
  accept: (taskId: string) => Promise<{ success: boolean; error?: string }>
}

/**
 * 获取任务数据
 * @param {TaskCategory} category - 任务分类
 * @returns {Promise<TaskProgressResponse[]>} 任务列表
 */
const fetchTasks = async (category?: TaskCategory): Promise<TaskProgressResponse[]> => {
  try {
    return await getUserTaskProgress(category)
  } catch {
    toast.error('获取任务列表失败，请稍后重试')
    return []
  }
}

/**
 * 任务数据 Hook
 * @param {TaskCategory} [category] - 任务分类筛选
 * @returns {UseTasksReturn} 任务状态和操作
 */
export function useTasks(category?: TaskCategory): UseTasksReturn {
  const cacheKey = category ? `tasks-${category}` : 'tasks-all'

  // P1-4: 请求中状态管理
  const [claimingTaskIds, setClaimingTaskIds] = useState<Set<string>>(new Set())
  const [acceptingTaskIds, setAcceptingTaskIds] = useState<Set<string>>(new Set())

  // 使用 SWR 获取任务数据 - 1分钟去重，挂载时自动获取
  const {
    data: tasks = [],
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(cacheKey, () => fetchTasks(category), {
    dedupingInterval: 60000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
  })

  /**
   * 刷新任务数据
   * @returns {Promise<void>}
   */
  const refreshTasks = useCallback(async () => {
    await mutate()
  }, [mutate])

  /**
   * 领取任务奖励
   * @param {string} taskId - 任务ID
   * @returns {Promise<{success: boolean; points?: number; error?: string}>} 领取结果
   */
  const claimReward = useCallback(
    async (taskId: string): Promise<{ success: boolean; points?: number; error?: string }> => {
      // P1-4: 防止重复请求
      if (claimingTaskIds.has(taskId)) {
        return { success: false, error: '正在处理中' }
      }

      setClaimingTaskIds(prev => new Set(prev).add(taskId))

      try {
        const result = await claimTaskReward(taskId)
        if (result.success) {
          // 领取成功后刷新任务列表
          await mutate()
        }
        return result
      } finally {
        setClaimingTaskIds(prev => {
          const next = new Set(prev)
          next.delete(taskId)
          return next
        })
      }
    },
    [mutate, claimingTaskIds]
  )

  /**
   * 接取任务
   * @param {string} taskId - 任务ID
   * @returns {Promise<{success: boolean; error?: string}>} 接取结果
   */
  const accept = useCallback(
    async (taskId: string): Promise<{ success: boolean; error?: string }> => {
      // P1-4: 防止重复请求
      if (acceptingTaskIds.has(taskId)) {
        return { success: false, error: '正在处理中' }
      }

      setAcceptingTaskIds(prev => new Set(prev).add(taskId))

      try {
        const result = await acceptTask(taskId)
        if (result.success) {
          // 接取成功后刷新任务列表
          await mutate()
        }
        return result
      } finally {
        setAcceptingTaskIds(prev => {
          const next = new Set(prev)
          next.delete(taskId)
          return next
        })
      }
    },
    [mutate, acceptingTaskIds]
  )

  return {
    tasks,
    isLoading,
    isValidating,
    error,
    claimingTaskIds,
    acceptingTaskIds,
    refreshTasks,
    claimReward,
    accept,
  }
}
