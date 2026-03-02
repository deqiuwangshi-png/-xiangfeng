/**
 * 草稿卡片骨架屏组件
 * @description 用于Suspense fallback，优化LCP感知性能
 * @param {Object} props - 组件属性
 * @param {number} props.count - 骨架屏数量，默认为6
 * @returns {JSX.Element} 骨架屏组件
 */
interface DraftCardSkeletonProps {
  count?: number
}

export function DraftCardSkeleton({ count = 6 }: DraftCardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-xf-border rounded-2xl p-5 animate-pulse"
        >
          <div className="flex items-start gap-4">
            {/* 选择框骨架 */}
            <div className="pt-1">
              <div className="w-5 h-5 rounded-md border-2 border-gray-200 bg-gray-100" />
            </div>

            {/* 内容区域骨架 */}
            <div className="flex-1 min-w-0">
              {/* 标题和状态行骨架 */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                <div className="h-5 bg-xf-bg/60 rounded-lg w-2/3" />
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-xf-bg/40 rounded-full w-16" />
                  <div className="w-8 h-8 bg-xf-bg/30 rounded-lg" />
                </div>
              </div>

              {/* 摘要骨架 - LCP关键区域 */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-xf-bg/40 rounded w-full" />
                <div className="h-4 bg-xf-bg/40 rounded w-4/5" />
              </div>

              {/* 日期骨架 */}
              <div className="h-3 bg-xf-bg/30 rounded w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
