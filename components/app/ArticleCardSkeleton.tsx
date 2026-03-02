/**
 * 文章卡片骨架屏组件
 * @description 用于Suspense fallback，优化LCP感知性能
 * @param {Object} props - 组件属性
 * @param {number} props.count - 骨架屏数量，默认为4
 * @returns {JSX.Element} 骨架屏组件
 */
interface ArticleCardSkeletonProps {
  count?: number
}

export function ArticleCardSkeleton({ count = 4 }: ArticleCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-xf-bg/60 animate-pulse"
        >
          {/* 标题骨架 */}
          <div className="h-6 bg-xf-bg/60 rounded-lg mb-4 w-3/4" />
          {/* 摘要骨架 */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-xf-bg/40 rounded w-full" />
            <div className="h-4 bg-xf-bg/40 rounded w-5/6" />
            <div className="h-4 bg-xf-bg/40 rounded w-4/6" />
          </div>
          {/* 底部信息骨架 */}
          <div className="flex items-center justify-between pt-4 border-t border-xf-bg/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-xf-bg/50 rounded-full" />
              <div className="h-3 bg-xf-bg/40 rounded w-20" />
            </div>
            <div className="h-3 bg-xf-bg/40 rounded w-16" />
          </div>
        </div>
      ))}
    </>
  )
}
