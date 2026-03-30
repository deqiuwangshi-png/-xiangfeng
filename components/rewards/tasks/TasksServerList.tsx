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
import { TaskActionButton } from './TaskActionButton'
import { getUserTaskProgress } from '@/lib/rewards/tasks'
import type { TaskCategory, TaskStatus, TaskProgressResponse } from '@/types/rewards'

/**
 * 任务列表服务端组件
 * @module components/rewards/tasks/TasksServerList
 * @description 服务端渲染任务列表，只负责展示，交互由客户端组件处理
 * @优化说明 改为Server Component，减少客户端JS体积
 */

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
 * 计算进度百分比
 * @param {number} progress - 当前进度
 * @param {number} total - 总任务量
 * @returns {number} 百分比
 */
function calcPercent(progress: number, total: number): number {
  return Math.min(Math.round((progress / total) * 100), 100)
}

/**
 * 获取图标组件
 * @param {string} iconName - 图标名称
 * @returns {React.ElementType} 图标组件
 */
function getIcon(iconName: string): React.ElementType {
  return iconMap[iconName] || Target
}

/**
 * 判断是否已完成
 * @param {TaskStatus} status - 任务状态
 * @returns {boolean} 是否已完成
 */
function isCompleted(status: TaskStatus): boolean {
  return status === 'completed' || status === 'reward_claimed'
}

/**
 * 获取分类样式
 * @param {TaskCategory} taskCategory - 任务分类
 * @returns {Object} 背景色和文字色
 */
function getCategoryStyle(taskCategory: TaskCategory) {
  return {
    bg: categoryBgMap[taskCategory] || 'bg-gray-100',
    color: categoryColorMap[taskCategory] || 'text-gray-600',
  }
}

/**
 * 任务列表服务端组件
 * @returns {JSX.Element} 任务列表
 */
export async function TasksServerList() {
  // 服务端获取任务数据
  const tasks = await getUserTaskProgress()

  // 空状态
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xf-primary">暂无任务</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tasks.map((task) => {
        const Icon = getIcon(task.icon_name)
        const percent = calcPercent(task.current_progress, task.target_progress)
        const completed = isCompleted(task.status)
        const style = getCategoryStyle(task.category)

        return (
          <div
            key={task.task_id}
            className={`card-bg rounded-xl p-4 ${
              completed ? 'opacity-70 bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}
              >
                <Icon className={`w-4 h-4 ${style.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-xf-dark text-sm ${
                    completed ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-xs text-xf-medium mt-0.5 line-clamp-1 ${completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-xf-bg rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        completed ? 'bg-green-500' : 'bg-xf-info'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-xf-primary whitespace-nowrap">
                    {task.current_progress}/{task.target_progress}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-xf-bg">
              <span
                className={`text-xf-accent font-bold text-sm ${
                  completed ? 'line-through' : ''
                }`}
              >
                +{task.reward_points}
              </span>
              {/* 状态标签和交互按钮 */}
              <TaskActionButton
                taskId={task.task_id}
                status={task.status}
                rewardPoints={task.reward_points}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
