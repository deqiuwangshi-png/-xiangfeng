'use client'

/**
 * 任务中心组件
 * @module components/rewards/TaskBoard
 * @description 显示每日、每周、成就任务列表，使用真实数据
 */

import { toast } from 'sonner'
import Link from 'next/link'
import { useTasks } from '../hooks'
import { ListTodo, ArrowRight, Target, BookOpen, Trophy, Users, PenTool, Heart, MessageCircle } from '@/components/icons'
import type { TaskStatus } from '@/types/rewards'

/**
 * 图标映射表
 * @constant iconMap
 */
const iconMap: Record<string, React.ElementType> = {
  Target,
  BookOpen,
  Trophy,
  Users,
  PenTool,
  Heart,
  MessageCircle,
}

/**
 * 类型配置
 * @constant typeConfig
 */
const typeConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  daily: { label: '每日', bgColor: 'bg-xf-soft/30', textColor: 'text-xf-primary' },
  weekly: { label: '每周', bgColor: 'bg-xf-info/20', textColor: 'text-xf-info' },
  monthly: { label: '每月', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  event: { label: '活动', bgColor: 'bg-rose-100', textColor: 'text-rose-600' },
}

/**
 * 任务中心组件
 * @returns {JSX.Element} 任务中心面板
 */
export function TaskBoard() {
  const { tasks, isLoading, claimReward, accept } = useTasks()

  /**
   * 计算进度百分比
   * @param {number} progress - 当前进度
   * @param {number} total - 总任务量
   * @returns {number} 百分比
   */
  const calcPercent = (progress: number, total: number) =>
    Math.min(Math.round((progress / total) * 100), 100)

  /**
   * 获取图标组件
   * @param {string} iconName - 图标名称
   * @returns {React.ElementType} 图标组件
   */
  const getIcon = (iconName: string): React.ElementType => {
    return iconMap[iconName] || Target
  }

  /**
   * 判断是否已完成
   * @param {TaskStatus} status - 任务状态
   * @returns {boolean} 是否已完成
   */
  const isCompleted = (status: TaskStatus): boolean => {
    return status === 'completed' || status === 'reward_claimed'
  }

  /**
   * 判断是否可领取奖励
   * @param {TaskStatus} status - 任务状态
   * @returns {boolean} 是否可领取
   */
  const canClaimReward = (status: TaskStatus): boolean => {
    return status === 'completed'
  }

  /**
   * 处理领取奖励
   * @param {string} taskId - 任务ID
   */
  const handleClaimReward = async (taskId: string) => {
    const result = await claimReward(taskId)
    if (result.success) {
      toast.success(`领取成功，获得灵感币: ${result.points}`)
    }
  }

  /**
   * 处理接取任务
   * @param {string} taskId - 任务ID
   */
  const handleAccept = async (taskId: string) => {
    const result = await accept(taskId)
    if (result.success) {
      toast.success('接取任务成功')
    } else {
      toast.error(result.error || '接取失败')
    }
  }

  /**
   * 判断是否已接取（进行中）
   * @param {TaskStatus} status - 任务状态
   * @returns {boolean} 是否进行中
   */
  const isInProgress = (status: TaskStatus): boolean => {
    return status === 'in_progress'
  }

  /**
   * 判断是否未接取
   * @param {TaskStatus} status - 任务状态
   * @returns {boolean} 是否未接取
   */
  const isPending = (status: TaskStatus): boolean => {
    return status === 'pending'
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="card-bg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 分区：进行中（动态渲染进度）
  const inProgressTasks = tasks.filter((t) => isInProgress(t.status)).slice(0, 2)

  // 分区：可领取奖励
  const claimableTasks = tasks.filter((t) => canClaimReward(t.status)).slice(0, 2)

  // 分区：已完成
  const completedTasks = tasks.filter((t) => t.status === 'reward_claimed').slice(0, 2)

  // 分区：可接取（静态展示）
  const availableTasks = tasks.filter((t) => isPending(t.status)).slice(0, 4)

  // 空状态处理
  if (tasks.length === 0) {
    return (
      <div className="card-bg rounded-2xl p-6">
        <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-xf-primary" />
          任务中心
        </h2>
        <div className="text-center py-8 text-xf-primary">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">暂无任务</p>
          <p className="text-xs mt-1 opacity-60">任务将在不久后上线</p>
        </div>
        <div className="mt-5 text-right">
          <Link
            href="/rewards/tasks"
            className="text-xs text-xf-primary hover:text-xf-accent flex items-center justify-end gap-1"
          >
            所有任务
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  /**
   * 渲染任务项
   * @param {TaskProgressResponse} task - 任务数据
   * @param {boolean} showProgress - 是否显示进度
   * @param {boolean} isLast - 是否为最后一个（添加分隔线）
   * @returns {JSX.Element} 任务项
   */
  const renderTaskItem = (task: typeof tasks[0], showProgress: boolean, isLast: boolean) => {
    const config = typeConfig[task.category] || typeConfig['daily']
    const percent = calcPercent(task.current_progress, task.target_progress)
    const completed = isCompleted(task.status)
    const claimable = canClaimReward(task.status)
    const pending = isPending(task.status)
    const inProgress = isInProgress(task.status)
    const Icon = getIcon(task.icon_name || 'Target')

    return (
      <div
        key={task.task_id}
        className={`flex items-center justify-between ${
          isLast ? 'pt-4 border-t border-dashed border-xf-bg/40' : ''
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.textColor}`} />
            <span className="font-medium text-xf-dark">{task.title}</span>
            <span className={`text-xs ${config.bgColor} ${config.textColor} px-2 py-0.5 rounded-full`}>
              {config.label}
            </span>
          </div>
          {/* 进行中任务显示进度条（动态渲染） */}
          {showProgress && inProgress && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-28 h-1.5 bg-xf-bg rounded-full overflow-hidden">
                <div
                  className="h-1.5 bg-xf-info rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-xf-primary">
                {task.current_progress}/{task.target_progress}
              </span>
            </div>
          )}
        </div>
        <span className="text-xf-accent font-bold mx-3">+{task.reward_points}</span>
        {/* 已完成 */}
        {completed && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full whitespace-nowrap">
            已完成
          </span>
        )}
        {/* 可领取 */}
        {claimable && (
          <button
            onClick={() => handleClaimReward(task.task_id)}
            className="text-xs bg-xf-accent hover:bg-xf-accent/90 text-white px-3 py-1.5 rounded-full transition whitespace-nowrap"
          >
            领取
          </button>
        )}
        {/* 进行中 */}
        {inProgress && (
          <span className="text-xs bg-xf-info/20 text-xf-info px-3 py-1.5 rounded-full whitespace-nowrap">
            进行中
          </span>
        )}
        {/* 未接取 */}
        {pending && (
          <button
            onClick={() => handleAccept(task.task_id)}
            className="text-xs bg-xf-primary/10 hover:bg-xf-primary/20 text-xf-primary px-3 py-1.5 rounded-full transition whitespace-nowrap"
          >
            接取任务
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="card-bg rounded-2xl p-6 flex flex-col min-h-[400px]">
      <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
        <ListTodo className="w-5 h-5 text-xf-primary" />
        任务中心
      </h2>

      {/* 任务分类标签 - 静态 */}
      <div className="flex gap-2 mb-4 text-xs">
        <span className="bg-xf-primary/10 text-xf-primary px-3 py-1 rounded-full">每日任务</span>
        <span className="bg-xf-info/10 text-xf-info px-3 py-1 rounded-full">每周任务</span>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">成就</span>
      </div>

      {/* 任务列表区域 - 可滚动，链接固定在底部 */}
      <div className="flex-1 space-y-4">
        {/* 进行中任务 - 动态渲染进度 */}
        {inProgressTasks.length > 0 && (
          <div className="space-y-3">
            {inProgressTasks.map((task, idx) =>
              renderTaskItem(task, true, idx > 0)
            )}
          </div>
        )}

        {/* 可领取奖励任务 */}
        {claimableTasks.length > 0 && (
          <div className="space-y-3">
            {claimableTasks.map((task, idx) =>
              renderTaskItem(task, false, idx > 0 || inProgressTasks.length > 0)
            )}
          </div>
        )}

        {/* 已完成任务 - 静态展示 */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            {completedTasks.map((task, idx) =>
              renderTaskItem(task, false, idx > 0 || inProgressTasks.length > 0 || claimableTasks.length > 0)
            )}
          </div>
        )}

        {/* 可接取任务 - 静态展示 */}
        {availableTasks.length > 0 && (
          <div className="space-y-3">
            {availableTasks.map((task, idx) =>
              renderTaskItem(
                task,
                false,
                idx > 0 || inProgressTasks.length > 0 || claimableTasks.length > 0 || completedTasks.length > 0
              )
            )}
          </div>
        )}
      </div>

      {/* 所有任务链接 - 固定在底部 */}
      <div className="mt-5 text-right">
        <a
          href="/rewards/tasks"
          className="text-xs text-xf-primary hover:text-xf-accent flex items-center justify-end gap-1"
        >
          所有任务
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
