'use client'

/**
 * 任务操作按钮组件 (Client Component)
 * @module components/rewards/tasks/TaskActionButton
 * @description 处理任务接取、领取奖励等交互操作
 * @优化说明 从TaskList提取为独立Client Component，支持任务列表改为Server Component
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useTasks } from '@/hooks/rewards/useTasks'
import { useDebounce } from '@/hooks/useDebounce'
import type { TaskStatus } from '@/types/rewards'

interface TaskActionButtonProps {
  /** 任务ID */
  taskId: string
  /** 任务状态 */
  status: TaskStatus
  /** 奖励积分 */
  rewardPoints: number
}

/**
 * 任务操作按钮组件
 * @param {TaskActionButtonProps} props - 组件属性
 * @returns {JSX.Element} 操作按钮
 */
export function TaskActionButton({ taskId, status }: TaskActionButtonProps) {
  const { claimReward, accept } = useTasks()
  const [isClaiming, setIsClaiming] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  // 防抖处理
  const debouncedClaimReward = useDebounce(claimReward, 300)
  const debouncedAccept = useDebounce(accept, 300)

  /**
   * 判断是否已完成
   */
  const isCompleted = status === 'completed' || status === 'reward_claimed'

  /**
   * 判断是否可领取奖励
   */
  const canClaimReward = status === 'completed'

  /**
   * 判断是否已接取（进行中）
   */
  const isInProgress = status === 'in_progress'

  /**
   * 判断是否未接取
   */
  const isPending = status === 'pending'

  /**
   * 处理领取奖励
   */
  const handleClaimReward = useCallback(async () => {
    setIsClaiming(true)
    try {
      const result = await debouncedClaimReward(taskId)
      if (result.success) {
        toast.success(`领取成功，获得灵感币: ${result.points}`)
      }
    } finally {
      setIsClaiming(false)
    }
  }, [taskId, debouncedClaimReward])

  /**
   * 处理接取任务
   */
  const handleAccept = useCallback(async () => {
    setIsAccepting(true)
    try {
      const result = await debouncedAccept(taskId)
      if (result.success) {
        toast.success('接取任务成功')
      } else {
        toast.error(result.error || '接取失败')
      }
    } finally {
      setIsAccepting(false)
    }
  }, [taskId, debouncedAccept])

  // 已完成
  if (isCompleted) {
    return (
      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
        已完成
      </span>
    )
  }

  // 可领取奖励
  if (canClaimReward) {
    return (
      <button
        onClick={handleClaimReward}
        disabled={isClaiming}
        className={`text-xs px-2.5 py-1 rounded-full transition ${
          isClaiming
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-xf-accent hover:bg-xf-accent/90 text-white'
        }`}
      >
        {isClaiming ? '领取中...' : '领取奖励'}
      </button>
    )
  }

  // 进行中
  if (isInProgress) {
    return (
      <span className="text-xs bg-xf-info/20 text-xf-info px-2.5 py-1 rounded-full">
        进行中
      </span>
    )
  }

  // 未接取
  if (isPending) {
    return (
      <button
        onClick={handleAccept}
        disabled={isAccepting}
        className={`text-xs px-2.5 py-1 rounded-full transition ${
          isAccepting
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-xf-primary/10 hover:bg-xf-primary/20 text-xf-primary'
        }`}
      >
        {isAccepting ? '接取中...' : '接取任务'}
      </button>
    )
  }

  return null
}
