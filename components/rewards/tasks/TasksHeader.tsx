import Link from 'next/link'
import { ArrowLeft, Sparkles, Moon } from '@/components/icons'

/**
 * 任务中心头部组件 (Server Component)
 * @module components/rewards/tasks/TasksHeader
 * @description 任务中心页面头部，服务端渲染静态内容
 * @优化说明 从TaskClient提取为Server Component，减少客户端JS体积
 */

interface TasksHeaderProps {
  /** 当前灵感币数量 */
  currentPoints?: number
}

/**
 * 任务中心头部组件
 * @param {TasksHeaderProps} props - 组件属性
 * @returns {JSX.Element} 任务中心头部
 */
export function TasksHeader({ currentPoints }: TasksHeaderProps) {
  // 显示积分，如果没有数据则显示占位符
  const displayPoints = currentPoints !== undefined ? currentPoints : '-'

  return (
    <>
      {/* 页头 + 返回链接 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            灵感任务
          </h1>
          <p className="text-xf-primary mt-1 text-sm">不是为了打卡，而是为了赚取灵感币</p>
        </div>
        <Link
          href="/rewards"
          className="text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> 返回福利中心
        </Link>
      </div>

      {/* 今日状态卡片 */}
      <div className="card-bg rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-xf-primary" />
          </div>
          <div>
            <div className="text-sm text-xf-primary">我的灵感币</div>
            <div className="text-2xl font-bold text-xf-accent">{displayPoints}</div>
          </div>
        </div>
        <div className="text-sm text-xf-medium bg-xf-light/50 px-4 py-2 rounded-full">
          <Moon className="w-3 h-3 inline mr-1" /> 夜深了，适合沉思
        </div>
      </div>
    </>
  )
}
