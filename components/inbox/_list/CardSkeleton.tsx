'use client'

/**
 * 卡片骨架屏组件属性接口
 * @interface CardSkeletonProps
 * @property {number} count - 骨架屏数量，默认为5
 */
interface CardSkeletonProps {
  count?: number
}

/**
 * 卡片骨架屏组件
 * @description 用于Suspense fallback，优化LCP感知性能
 * @param {CardSkeletonProps} props - 组件属性
 * @returns {JSX.Element} 骨架屏组件
 */
export function CardSkeleton({ count = 5 }: CardSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 animate-pulse"
        >
          {/* 图标骨架 */}
          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" />

          {/* 内容区域骨架 */}
          <div className="flex-1 min-w-0">
            {/* LCP关键区域：消息文本骨架 */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />

            {/* 时间信息骨架 */}
            <div className="flex items-center gap-3 mt-2">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="w-1 h-1 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-100 rounded w-10" />
            </div>
          </div>

          {/* 更多按钮骨架 */}
          <div className="w-6 h-6 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}
