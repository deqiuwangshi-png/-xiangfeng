'use client'

/**
 * 分类导航客户端组件
 * @module components/rewards/tasks/CategoryNavClient
 * @description 任务分类导航，使用URL参数进行筛选
 * @优化说明 使用URL参数替代useState，支持Server Component获取数据
 */

import { useRouter, useSearchParams } from 'next/navigation'
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

interface CategoryNavClientProps {
  /** 当前激活的分类 */
  activeCategory: TaskCategoryType
}

/**
 * 分类导航客户端组件
 * @param {CategoryNavClientProps} props - 组件属性
 * @returns {JSX.Element} 分类导航
 */
export function CategoryNavClient({ activeCategory }: CategoryNavClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * 处理分类切换
   * @param {TaskCategoryType} category - 目标分类
   */
  const handleCategoryChange = (category: TaskCategoryType) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/rewards/tasks?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {(Object.keys(categoryConfig) as TaskCategoryType[]).map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-xf-accent text-white shadow-md'
              : 'bg-white text-xf-primary hover:bg-xf-light'
          }`}
        >
          {categoryConfig[category]}
        </button>
      ))}
    </div>
  )
}
