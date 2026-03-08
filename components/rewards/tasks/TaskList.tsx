'use client'

/**
 * 任务列表组件
 * @module components/rewards/TaskList
 * @description 展示所有任务卡片，支持分类筛选
 */

import { useState, useMemo } from 'react'
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
} from '@/components/icons'

/**
 * 分类类型
 * @type CategoryType
 */
type CategoryType = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'event'

/**
 * 任务项接口
 * @interface TaskItem
 */
interface TaskItem {
  id: string
  title: string
  desc: string
  category: CategoryType
  reward: number
  progress: number
  total: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  timeLeft?: string
  completed?: boolean
}

/**
 * 模拟任务数据
 * @constant mockTasks
 */
const mockTasks: TaskItem[] = [
  {
    id: '1',
    title: '记录今日的「灵光一瞬」',
    desc: '用一句话捕捉今天最触动你的瞬间',
    category: 'daily',
    reward: 25,
    progress: 0,
    total: 1,
    icon: Sun,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: '2',
    title: '给一位陌生人的文章写一句真诚的回应',
    desc: '不是评论，是共鸣的延续',
    category: 'daily',
    reward: 30,
    progress: 0,
    total: 1,
    icon: MessageCircle,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: '3',
    title: '静观窗外五分钟',
    desc: '放下手机，纯粹地观察自然或街景',
    category: 'daily',
    reward: 20,
    progress: 0,
    total: 1,
    icon: Eye,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: '4',
    title: '写一封给五年后自己的信',
    desc: '存入时光胶囊，到期可开启',
    category: 'weekly',
    reward: 120,
    progress: 0,
    total: 1,
    icon: Feather,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: '5',
    title: '整理本周最爱的三篇收藏',
    desc: '为它们各写一句推荐语',
    category: 'weekly',
    reward: 90,
    progress: 0,
    total: 3,
    icon: Bookmark,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: '6',
    title: '发起一个「三人对谈」',
    desc: '邀请两位朋友围绕一个话题深度交流',
    category: 'weekly',
    reward: 200,
    progress: 0,
    total: 1,
    icon: Users,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: '7',
    title: '撰写一篇「思想小传」',
    desc: '梳理自己某个观念的演变历程',
    category: 'monthly',
    reward: 300,
    progress: 0,
    total: 1,
    icon: PenTool,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: '8',
    title: '绘制「灵感地图」',
    desc: '用思维导图呈现你感兴趣的知识关联',
    category: 'monthly',
    reward: 250,
    progress: 0,
    total: 1,
    icon: Map,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: '9',
    title: '拍摄一组「日常诗意」',
    desc: '用照片记录平凡中的不平凡，组图+短句',
    category: 'monthly',
    reward: 280,
    progress: 0,
    total: 1,
    icon: Camera,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: '10',
    title: '完成年度「思想年鉴」',
    desc: '整理这一年最重要的思考与转变',
    category: 'yearly',
    reward: 800,
    progress: 0,
    total: 1,
    icon: Scroll,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '11',
    title: '完成一次「精神远足」',
    desc: '深入探索一个陌生领域，输出学习笔记',
    category: 'yearly',
    reward: 1000,
    progress: 0,
    total: 1,
    icon: Compass,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '12',
    title: '「春日哲思」主题创作',
    desc: '围绕"新生"写一篇文章或诗',
    category: 'event',
    reward: 400,
    progress: 0,
    total: 1,
    icon: Sparkles,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
    timeLeft: '剩余 5 天',
  },
  {
    id: '13',
    title: '「世界哲学日」特别任务',
    desc: '分享一位你喜欢的哲学家的一句话及感悟',
    category: 'event',
    reward: 350,
    progress: 0,
    total: 1,
    icon: Globe,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
    timeLeft: '剩余 2 天',
  },
  {
    id: '14',
    title: '记录今日的「灵光一瞬」',
    desc: '昨天已记录："黄昏时看到两只鸟并肩飞过，想起远方的朋友。"',
    category: 'daily',
    reward: 25,
    progress: 1,
    total: 1,
    icon: Check,
    iconBg: 'bg-gray-200',
    iconColor: 'text-gray-500',
    completed: true,
  },
]

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
  const [tasks] = useState<TaskItem[]>(mockTasks)

  /**
   * 根据分类筛选任务
   */
  const filteredTasks = useMemo(() => {
    if (category === 'all') return tasks
    return tasks.filter((task) => task.category === category)
  }, [tasks, category])

  /**
   * 计算进度百分比
   * @param {number} progress - 当前进度
   * @param {number} total - 总任务量
   * @returns {number} 百分比
   */
  const calcPercent = (progress: number, total: number) =>
    Math.min(Math.round((progress / total) * 100), 100)

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => {
        const Icon = task.icon
        const percent = calcPercent(task.progress, task.total)

        return (
          <div
            key={task.id}
            className={`card-bg rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              task.completed ? 'opacity-70 bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${task.iconBg}`}
              >
                <Icon className={`w-5 h-5 ${task.iconColor}`} />
              </div>
              <div>
                <h3
                  className={`font-bold text-xf-dark ${
                    task.completed ? 'line-through' : ''
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-xs text-xf-primary mt-0.5">{task.desc}</p>
                {task.timeLeft && (
                  <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full inline-block mt-1">
                    {task.timeLeft}
                  </span>
                )}
                {!task.completed && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-32 h-1.5 bg-xf-bg rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          task.completed ? 'bg-gray-400' : 'bg-xf-info'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-xf-primary">
                      {task.progress}/{task.total}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <span
                className={`text-xf-accent font-bold ${
                  task.completed ? 'line-through' : ''
                }`}
              >
                +{task.reward}
              </span>
              {task.completed ? (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  已完成
                </span>
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
