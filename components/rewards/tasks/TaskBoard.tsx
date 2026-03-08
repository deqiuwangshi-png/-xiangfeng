'use client'

/**
 * 任务中心组件
 * @module components/rewards/TaskBoard
 * @description 显示每日、每周、成就任务列表
 */

import { useState } from 'react'
import { ListTodo, ArrowRight } from '@/components/icons'

/**
 * 任务类型
 * @type TaskType
 */
type TaskType = 'daily' | 'weekly' | 'achievement'

/**
 * 任务项接口
 * @interface TaskItem
 */
interface TaskItem {
  id: string
  title: string
  type: TaskType
  reward: number
  progress: number
  total: number
  desc?: string
}

/**
 * 模拟任务数据
 * @constant mockTasks
 */
const mockTasks: TaskItem[] = [
  { id: '1', title: '阅读3篇文章', type: 'daily', reward: 20, progress: 1, total: 3 },
  { id: '2', title: '发表一条想法', type: 'daily', reward: 15, progress: 0, total: 1 },
  { id: '3', title: '获得10个点赞', type: 'weekly', reward: 100, progress: 7, total: 10 },
  { id: '4', title: '邀请新朋友', type: 'achievement', reward: 200, progress: 0, total: 1, desc: '限时双倍积分' },
]

/**
 * 任务类型配置
 * @constant typeConfig
 */
const typeConfig: Record<TaskType, { label: string; bgColor: string; textColor: string }> = {
  daily: { label: '每日', bgColor: 'bg-xf-soft/30', textColor: 'text-xf-primary' },
  weekly: { label: '每周', bgColor: 'bg-xf-info/20', textColor: 'text-xf-info' },
  achievement: { label: '成就', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
}

/**
 * 任务中心组件
 * @returns {JSX.Element} 任务中心面板
 */
export function TaskBoard() {
  const [tasks] = useState<TaskItem[]>(mockTasks)

  /**
   * 计算进度百分比
   * @param {number} progress - 当前进度
   * @param {number} total - 总任务量
   * @returns {number} 百分比
   */
  const calcPercent = (progress: number, total: number) =>
    Math.min(Math.round((progress / total) * 100), 100)

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
        {tasks.map((task, index) => {
          const config = typeConfig[task.type]
          const percent = calcPercent(task.progress, task.total)

          return (
            <div
              key={task.id}
              className={`flex items-center justify-between ${
                index === 2 ? 'pt-4 border-t border-dashed border-xf-bg/40' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xf-dark">{task.title}</span>
                  <span className={`text-xs ${config.bgColor} ${config.textColor} px-2 py-0.5 rounded-full`}>
                    {config.label}
                  </span>
                </div>
                {task.desc ? (
                  <span className="text-xs text-xf-primary">{task.desc}</span>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-28 h-1.5 bg-xf-bg rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-xf-info rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-xf-primary">
                      {task.progress}/{task.total}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xf-accent font-bold mx-3">+{task.reward}</span>
              <button className="text-xs bg-xf-primary/10 hover:bg-xf-primary/20 text-xf-primary px-3 py-1.5 rounded-full transition whitespace-nowrap">
                {task.type === 'achievement' ? '去邀请' : '去完成'}
              </button>
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
