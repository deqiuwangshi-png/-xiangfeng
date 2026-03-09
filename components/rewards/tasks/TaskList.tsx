'use client'

/**
 * 任务列表组件
 * @module components/rewards/TaskList
 * @description 展示所有任务卡片，支持分类筛选，使用真实数据
 */

import { useTasks } from '../hooks'
import type { TaskCategory, TaskStatus } from '@/types/rewards'
import {
  Sun,
  MessageCircle,
  Eye,
  Feather,
  Bookmark,
  Users,
  PenTool,
  Map,
  Camera,
  Scroll,
  Compass,
  Sparkles,
  Globe,
  Check,
  BookOpen,
  Trophy,
  Target,
  Heart,
} from '@/components/icons'

/**
 * 分类类型
 * @type CategoryType
 */
type CategoryType = 'all' | TaskCategory

/**
 * 图标映射表
 * @constant iconMap
 */
const iconMap: Record<string, React.ElementType> = {
  Sun,
  MessageCircle,
  Eye,
  Feather,
  Bookmark,
  Users,
  PenTool,
  Map,
  Camera,
  Scroll,
  Compass,
  Sparkles,
  Globe,
  Check,
  BookOpen,
  Trophy,
  Target,
  Heart,
}

/**
 * 分类背景色映射
 * @constant categoryBgMap
 */
const categoryBgMap: Record<TaskCategory, string> = {
  daily: 'bg-indigo-100',
  weekly: 'bg-emerald-100',
  monthly: 'bg-amber-100',
  yearly: 'bg-purple-100',
  event: 'bg-rose-100',
}

/**
 * 分类文字色映射
 * @constant categoryColorMap
 */
const categoryColorMap: Record<TaskCategory, string> = {
  daily: 'text-indigo-600',
  weekly: 'text-emerald-600',
  monthly: 'text-amber-600',
  yearly: 'text-purple-600',
  event: 'text-rose-500',
}

/**
 * 任务列表Props
 * @interface TaskListProps
 */
interface TaskListProps {
  /** 当前分类筛选 */
  category: CategoryType
}

/**
 * 任务列表组件
 * @param {TaskListProps} props - 组件属性
 * @returns {JSX.Element} 任务列表
 */
export function TaskList({ category }: TaskListProps) {
  const { tasks, isLoading, claimReward } = useTasks(
    category === 'all' ? undefined : category
  )

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
   * 获取分类样式
   * @param {TaskCategory} taskCategory - 任务分类
   * @returns {Object} 背景色和文字色
   */
  const getCategoryStyle = (taskCategory: TaskCategory) => {
    return {
      bg: categoryBgMap[taskCategory] || 'bg-gray-100',
      color: categoryColorMap[taskCategory] || 'text-gray-600',
    }
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
      // 领取成功，UI会自动刷新
      console.log('领取成功，获得积分:', result.points)
    } else {
      console.error('领取失败:', result.error)
    }
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-bg rounded-xl p-5 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 空状态
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xf-primary">暂无任务</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const Icon = getIcon(task.icon_name)
        const percent = calcPercent(task.current_progress, task.target_progress)
        const completed = isCompleted(task.status)
        const claimable = canClaimReward(task.status)
        const style = getCategoryStyle(task.category)

        return (
          <div
            key={task.task_id}
            className={`card-bg rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              completed ? 'opacity-70 bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}
              >
                <Icon className={`w-5 h-5 ${style.color}`} />
              </div>
              <div>
                <h3
                  className={`font-bold text-xf-dark ${
                    completed ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </h3>
                {!completed && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-32 h-1.5 bg-xf-bg rounded-full overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-xf-info"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-xf-primary">
                      {task.current_progress}/{task.target_progress}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <span
                className={`text-xf-accent font-bold ${
                  completed ? 'line-through' : ''
                }`}
              >
                +{task.reward_points}
              </span>
              {completed ? (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  已完成
                </span>
              ) : claimable ? (
                <button
                  onClick={() => handleClaimReward(task.task_id)}
                  className="text-xs bg-xf-accent hover:bg-xf-accent/90 text-white px-4 py-2 rounded-full transition"
                >
                  领取奖励
                </button>
              ) : (
                <button className="text-xs bg-xf-primary/10 hover:bg-xf-primary/20 text-xf-primary px-4 py-2 rounded-full transition">
                  去完成
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
