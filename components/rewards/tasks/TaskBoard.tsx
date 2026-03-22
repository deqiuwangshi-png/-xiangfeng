'use client'

/**
 * 任务中心组件
 * @module components/rewards/TaskBoard
 * @description 任务中心面板，紧凑列表布局，支持分类筛选
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { useTasks } from '../hooks'
import {
  ListTodo,
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
import type { TaskCategory, TaskStatus } from '@/types/rewards'

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
 * 分类配置
 * @constant categoryConfig
 */
const categoryConfig: Record<CategoryType, { label: string; short: string }> = {
  all: { label: '全部', short: '全部' },
  daily: { label: '每日哲思', short: '每日' },
  weekly: { label: '周度探索', short: '每周' },
  monthly: { label: '月度修行', short: '每月' },
  yearly: { label: '年度回响', short: '年度' },
  event: { label: '特别活动', short: '活动' },
}

/**
 * 情感化任务名称映射表
 * @constant poeticTaskNameMap
 */
const poeticTaskNameMap: Record<string, string> = {
  '阅读3篇文章': '吸收3份灵感',
  '阅读5篇文章': '沉浸5段故事',
  '阅读10篇文章': '探索10个世界',
  '阅读1篇文章': '邂逅1篇心动',
  '阅读文章': '与文字相遇',
  '获得10个点赞': '引起10次共鸣',
  '获得5个点赞': '收获5份认可',
  '获得20个点赞': '触动20颗心灵',
  '获得点赞': '收获共鸣',
  '点赞10篇文章': '传递10份欣赏',
  '点赞5篇文章': '点亮5个灵感',
  '点赞文章': '为心动点赞',
  '评论3篇文章': '留下3段思考',
  '评论5篇文章': '参与5场对话',
  '发表评论': '分享你的声音',
  '评论文章': '诉说你的感悟',
  '发布1篇文章': '记录1段心路',
  '发布3篇文章': '书写3篇故事',
  '发布文章': '让想法流淌',
  '发布想法': '捕捉一闪灵光',
  '发布5个想法': '记录5次顿悟',
  '收藏3篇文章': '珍藏3份感动',
  '收藏文章': '收藏心动瞬间',
  '关注3位用户': '遇见3个有趣的灵魂',
  '关注用户': '结识同行者',
  '分享1篇文章': '传递1份美好',
  '分享文章': '让好内容流动',
  '邀请好友': '邀请知己同行',
  '完善资料': '介绍你自己',
  '每日签到': '今日份的坚持',
}

/**
 * 获取情感化任务名称
 * @param {string} originalTitle - 原始任务名称
 * @returns {string} 情感化后的名称
 */
function getPoeticTaskName(originalTitle: string): string {
  return poeticTaskNameMap[originalTitle] || originalTitle
}

/**
 * 任务中心组件
 * @returns {JSX.Element} 任务中心面板
 */
export function TaskBoard() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all')
  const { tasks, isLoading, claimReward, claimingTaskIds } = useTasks(
    activeCategory === 'all' ? undefined : activeCategory
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

  /**
   * 处理领取奖励
   * @param {string} taskId - 任务ID
   */
  const handleClaimReward = async (taskId: string) => {
    const result = await claimReward(taskId)
    if (result.success) {
      toast.success(`领取成功，获得积分: ${result.points}`)
    }
  }

  /**
   * 获取任务引导链接
   * @param {string} title - 任务标题
   * @returns {string} 引导链接
   */
  const getTaskGuideLink = (title: string): string => {
    if (title.includes('阅读')) return '/articles'
    if (title.includes('发布文章') || title.includes('书写')) return '/write'
    if (title.includes('想法') || title.includes('灵感')) return '/ideas'
    if (title.includes('点赞') || title.includes('共鸣') || title.includes('欣赏')) return '/articles'
    if (title.includes('评论') || title.includes('思考') || title.includes('对话')) return '/articles'
    if (title.includes('分享') || title.includes('传递')) return '/articles'
    if (title.includes('关注') || title.includes('遇见') || title.includes('结识')) return '/users'
    if (title.includes('收藏') || title.includes('珍藏')) return '/articles'
    if (title.includes('邀请') || title.includes('知己')) return '/invite'
    if (title.includes('资料') || title.includes('介绍')) return '/settings/profile'
    return '/'
  }

  /**
   * 获取任务引导文本
   * @param {string} title - 任务标题
   * @returns {string} 引导文本
   */
  const getTaskGuideText = (title: string): string => {
    if (title.includes('阅读') || title.includes('吸收') || title.includes('沉浸') || title.includes('探索')) return '去阅读'
    if (title.includes('发布') || title.includes('书写') || title.includes('记录') || title.includes('创作')) return '去创作'
    if (title.includes('想法') || title.includes('灵感') || title.includes('顿悟')) return '去发布'
    if (title.includes('点赞') || title.includes('共鸣') || title.includes('欣赏') || title.includes('点亮')) return '去发现'
    if (title.includes('评论') || title.includes('思考') || title.includes('对话') || title.includes('分享')) return '去互动'
    if (title.includes('关注') || title.includes('遇见') || title.includes('结识')) return '去关注'
    if (title.includes('收藏') || title.includes('珍藏')) return '去收藏'
    if (title.includes('邀请') || title.includes('知己')) return '去邀请'
    if (title.includes('资料') || title.includes('介绍')) return '去完善'
    return '去完成'
  }


  return (
    <div className="card-bg rounded-2xl p-5">
      {/* 标题 */}
      <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
        <ListTodo className="w-5 h-5 text-xf-primary" />
        任务中心
      </h2>

      {/* 分类筛选 - 统一颜色样式 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(categoryConfig) as CategoryType[]).map((category) => {
          const config = categoryConfig[category]
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs px-2.5 py-1 rounded-md transition font-medium ${
                isActive
                  ? 'bg-xf-primary text-white shadow-sm'
                  : 'bg-xf-soft/20 text-xf-primary hover:bg-xf-soft/40'
              }`}
            >
              {config.short}
            </button>
          )
        })}
      </div>

      {/* 任务列表 - 两列网格布局 */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-bg rounded-xl p-3 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1.5" />
                  <div className="h-1.5 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-6 text-xf-primary">
          <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">暂无任务</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {tasks.map((task) => {
            const Icon = getIcon(task.icon_name)
            const percent = calcPercent(task.current_progress, task.target_progress)
            const completed = isCompleted(task.status)
            const claimable = canClaimReward(task.status)
            const inProgress = isInProgress(task.status)
            const pending = isPending(task.status)
            const guideLink = getTaskGuideLink(task.title)
            const guideText = getTaskGuideText(task.title)

            return (
              <div
                key={task.task_id}
                className={`card-bg rounded-xl p-3 transition ${
                  completed ? 'opacity-60 bg-gray-50/50' : 'hover:shadow-sm'
                }`}
              >
                {/* 顶部：图标 + 标题 + 积分 */}
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-xf-soft/30">
                    <Icon className="w-3.5 h-3.5 text-xf-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        className={`font-medium text-xf-dark text-sm truncate ${
                          completed ? 'line-through text-xf-medium' : ''
                        }`}
                      >
                        {getPoeticTaskName(task.title)}
                      </h3>
                      <span className={`text-xs font-bold shrink-0 ${completed ? 'text-green-600' : 'text-xf-accent'}`}>
                        +{task.reward_points}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 bg-xf-bg rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        completed ? 'bg-green-500' : percent >= 100 ? 'bg-xf-accent' : 'bg-xf-info'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-xf-primary whitespace-nowrap">
                    {task.current_progress}/{task.target_progress}
                  </span>
                </div>

                {/* 底部操作区 */}
                <div className="flex justify-end">
                  {/* 已完成 */}
                  {completed && (
                    <span className="text-xs text-green-600 font-medium">
                      已完成
                    </span>
                  )}
                  {/* 可领取 */}
                  {claimable && (
                    <button
                      onClick={() => handleClaimReward(task.task_id)}
                      disabled={claimingTaskIds.has(task.task_id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                        claimingTaskIds.has(task.task_id)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-xf-accent hover:bg-xf-accent/90 text-white'
                      }`}
                    >
                      {claimingTaskIds.has(task.task_id) ? '...' : '领取'}
                    </button>
                  )}
                  {/* 进行中 */}
                  {inProgress && (
                    <span className="text-xs text-xf-info font-medium">
                      进行中
                    </span>
                  )}
                  {/* 未接取 - 引导链接 */}
                  {pending && (
                    <a
                      href={guideLink}
                      className="text-xs px-2.5 py-1 rounded-full bg-xf-primary/10 hover:bg-xf-primary text-xf-primary hover:text-white transition font-medium"
                    >
                      {guideText}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
