'use client'

/**
 * 任务中心组件
 * @module components/rewards/TaskBoard
 * @description 显示每日、每周、成就任务列表，使用真实数据
 */

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
  const { tasks, isLoading, claimReward } = useTasks()

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
      console.log('领取成功，获得积分:', result.points)
    } else {
      console.error('领取失败:', result.error)
    }
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

  // 只显示前4个任务
  const displayTasks = tasks.slice(0, 4)

  // 空状态处理
  if (displayTasks.length === 0) {
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

  return (
    <div className="card-bg rounded-2xl p-6">
      <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
        <ListTodo className="w-5 h-5 text-xf-primary" />
        任务中心
      </h2>

      {/* 任务分类标签 */}
      <div className="flex gap-2 mb-4 text-xs">
        <span className="bg-xf-primary/10 text-xf-primary px-3 py-1 rounded-full">每日任务</span>
        <span className="bg-xf-info/10 text-xf-info px-3 py-1 rounded-full">每周任务</span>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">成就</span>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {displayTasks.map((task, index) => {
          const config = typeConfig[task.category] || typeConfig['daily']
          const percent = calcPercent(task.current_progress, task.target_progress)
          const completed = isCompleted(task.status)
          const claimable = canClaimReward(task.status)
          const Icon = getIcon(task.icon_name || 'Target')

          return (
            <div
              key={task.task_id}
              className={`flex items-center justify-between ${
                index === 2 ? 'pt-4 border-t border-dashed border-xf-bg/40' : ''
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
              </div>
              <span className="text-xf-accent font-bold mx-3">+{task.reward_points}</span>
              {completed ? (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                  已完成
                </span>
              ) : claimable ? (
                <button
                  onClick={() => handleClaimReward(task.task_id)}
                  className="text-xs bg-xf-accent hover:bg-xf-accent/90 text-white px-3 py-1.5 rounded-full transition whitespace-nowrap"
                >
                  领取
                </button>
              ) : (
                <button className="text-xs bg-xf-primary/10 hover:bg-xf-primary/20 text-xf-primary px-3 py-1.5 rounded-full transition whitespace-nowrap">
                  去完成
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 所有任务链接 */}
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
