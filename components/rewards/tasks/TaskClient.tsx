'use client'

/**
 * 任务中心客户端组件
 * @module components/rewards/tasks/TaskClient
 * @description 灵感任务主客户端组件，管理分类筛选和任务状态
 */

import { useState } from 'react'
import { ArrowLeft, Sparkles, Moon, Link } from '@/components/icons'
import { TaskList } from './TaskList'
import { CategoryNav } from './CategoryNav'
import { usePoints } from '../hooks/usePoints'
import type { TaskCategory } from '@/types/rewards'

/**
 * 任务分类类型
 * @type TaskCategoryType
 */
type TaskCategoryType = 'all' | TaskCategory

/**
 * 分类配置
 * @constant categoryConfig
 */
const categoryConfig: Record<TaskCategoryType, string> = {
  all: '全部',
  daily: '每日哲思',
  weekly: '周度探索',
  monthly: '月度修行',
  yearly: '年度回响',
  event: '特别活动',
}

/**
 * 任务中心客户端组件
 * @returns {JSX.Element} 任务中心客户端组件
 */
export function TaskClient() {
  const [activeCategory, setActiveCategory] = useState<TaskCategoryType>('all')

  const { overview, isLoading } = usePoints()

  // 有缓存数据时立即显示，无需等待loading
  const currentPoints = overview?.current_points ?? 0
  const displayPoints = overview ? currentPoints : isLoading ? '-' : '0'

  return (
    <div className="max-w-5xl mx-auto fade-in-up px-6 md:px-10 pt-8 pb-12">
      {/* 页头 + 返回链接 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            灵感任务
          </h1>
          <p className="text-xf-primary mt-1 text-sm">不是为了打卡，而是为了遇见更好的自己</p>
        </div>
        <Link 
          href="/rewards"
          className="text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> 返回福利中心
        </Link>
      </div>

      {/* 今日状态卡片 - 有缓存时立即显示积分 */}
      <div className="card-bg rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-xf-primary" />
          </div>
          <div>
            <div className="text-sm text-xf-primary">灵感积分</div>
            <div className="text-2xl font-bold text-xf-accent">{displayPoints}</div>
          </div>
        </div>
        <div className="text-sm text-xf-medium bg-xf-light/50 px-4 py-2 rounded-full">
          <Moon className="w-3 h-3 inline mr-1" /> 夜深了，适合沉思
        </div>
      </div>

      {/* 分类导航 */}
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categoryConfig}
      />

      {/* 任务列表 */}
      <TaskList category={activeCategory} />

      {/* 底部留白 */}
      <div className="mt-8 text-center text-sm text-xf-primary">每一个任务都是一次心灵的散步</div>
    </div>
  )
}
