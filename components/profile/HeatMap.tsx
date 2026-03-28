/**
 * 灵感热力图组件 - 服务端数据层
 * @module components/profile/HeatMap
 * @description 负责从服务端获取热力图数据，传递给视图组件
 *
 * @文件名限制 严格小于12字符: HeatMap.tsx (8字符)
 */

import { fetchThoughtHeatMap } from '@/lib/thoughts/queries'
import { HeatMapView } from './HeatMapView'

/**
 * 热力图组件Props
 * @interface HeatMapProps
 * @property {string} [userId] - 目标用户ID（不传则查询当前用户）
 */
interface HeatMapProps {
  userId?: string
}

/**
 * 灵感热力图组件
 *
 * @function HeatMap
 * @param {HeatMapProps} props - 组件属性
 * @returns {Promise<JSX.Element>} 热力图组件
 *
 * @description
 * Server Component，职责单一：
 * - 从服务端获取热力图数据
 * - 将数据传递给 HeatMapView 客户端组件
 * - 不处理任何交互逻辑
 *
 * @数据流
 * - 从 articles 表获取发布文章（深度3）
 * - 从 comments 表获取评论（深度1）
 * - 通过 fetchThoughtHeatMap Server Action 查询
 */
export async function HeatMap({ userId }: HeatMapProps) {
  // 服务端获取数据
  const data = await fetchThoughtHeatMap(userId, 180)

  // 传递数据给客户端视图组件
  return <HeatMapView initialData={data} />
}

/**
 * 热力图骨架屏
 * @returns {JSX.Element} 骨架屏组件
 */
export function HeatMapSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 统计骨架 */}
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-baseline gap-1.5">
            <div className="h-8 w-8 bg-xf-bg/60 rounded" />
            <div className="h-4 w-16 bg-xf-bg/60 rounded" />
          </div>
        ))}
      </div>

      {/* 热力图骨架 */}
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-4 h-3 bg-xf-bg/60 rounded" />
          ))}
        </div>
        {Array.from({ length: 12 }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} className="w-3 h-3 rounded-[2px] bg-xf-bg/60" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
