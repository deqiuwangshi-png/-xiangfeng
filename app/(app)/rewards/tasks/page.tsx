/**
 * 灵感任务子页面
 * @module app/(app)/rewards/tasks/page
 * @description 任务中心子页面，展示所有创意任务
 */

import { TaskClient } from '@/components/rewards/tasks/TaskClient'

/**
 * 任务中心页面
 * @returns {JSX.Element} 任务中心页面
 */
export default function TasksPage() {
  return <TaskClient />
}
