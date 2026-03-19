/**
 * 灵感任务子页面
 * @module app/(app)/rewards/tasks/page
 * @description 任务中心子页面，展示所有创意任务
 */

import { TaskClient } from '@/components/rewards/tasks/TaskClient'
import { MobileBackButton } from '@/components/mobile/MobileBackButton'

/**
 * 任务中心页面
 * @returns {JSX.Element} 任务中心页面
 */
export default function TasksPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <MobileBackButton href="/rewards" title="任务中心" />
      <TaskClient />
    </div>
  )
}
