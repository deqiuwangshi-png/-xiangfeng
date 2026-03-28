/**
 * 灵感任务子页面
 * @module app/(app)/rewards/tasks/page
 * @description 任务中心子页面，展示所有创意任务
 * @优化说明 改为Server Component，服务端获取任务列表和积分数据，减少客户端JS体积
 */

import { TasksHeader } from '@/components/rewards/tasks/TasksHeader'
import { TasksServerList } from '@/components/rewards/tasks/TasksServerList'
import { CategoryNavClient } from '@/components/rewards/tasks/CategoryNavClient'
import { MobileBackButton } from '@/components/mobile/MobileBackButton'
import { getUserPointsOverview } from '@/lib/rewards/points'
import { getUserTaskProgress } from '@/lib/rewards/tasks'
import type { TaskCategory } from '@/types/rewards'

/**
 * 任务中心页面
 * @param {Object} searchParams - 查询参数
 * @returns {JSX.Element} 任务中心页面
 */
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 获取分类参数
  const params = await searchParams
  const category = (params.category as TaskCategory | 'all' | undefined) || 'all'

  // 并行获取积分和任务数据
  const [overview, tasks] = await Promise.all([
    getUserPointsOverview(),
    getUserTaskProgress(category === 'all' ? undefined : category),
  ])

  const currentPoints = overview?.current_points

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <MobileBackButton href="/rewards" title="任务中心" />

      <div className="max-w-5xl mx-auto fade-in-up px-6 md:px-10 pt-8 pb-12">
        {/* 静态头部 - Server Component渲染 */}
        <TasksHeader currentPoints={currentPoints} />

        {/* 分类导航 - Client Component */}
        <CategoryNavClient activeCategory={category} />

        {/* 任务列表 - Server Component渲染 */}
        <TasksServerList tasks={tasks} />

        {/* 底部留白 */}
        <div className="mt-8 text-center text-sm text-xf-primary">
          每一个任务都是对成果的奖励
        </div>
      </div>
    </div>
  )
}
