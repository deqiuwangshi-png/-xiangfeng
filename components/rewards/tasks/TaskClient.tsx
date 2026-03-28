'use client'

/**
 * 任务中心客户端组件
 * @module components/rewards/tasks/TaskClient
 * @description 灵感任务主客户端组件，管理分类筛选和任务状态
 * @优化说明 移除静态头部内容，由Server Component渲染，只保留交互逻辑
 */

import { useState } from 'react'
import { TaskList } from './TaskList'
import { CategoryNav } from './CategoryNav'
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

  return (
    <>
      {/* 分类导航 */}
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categoryConfig}
      />

      {/* 任务列表 */}
      <TaskList category={activeCategory} />

      {/* 底部留白 */}
      <div className="mt-8 text-center text-sm text-xf-primary">每一个任务都是对成果的奖励</div>
    </>
  )
}
