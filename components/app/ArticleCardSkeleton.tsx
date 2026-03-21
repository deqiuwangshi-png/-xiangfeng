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
          className="bg-white rounded-xl p-4 sm:p-5 border border-xf-bg/60 animate-pulse"
        >
          {/* 标题骨架 */}
          <div className="h-6 bg-xf-bg/60 rounded-lg mb-3 w-3/4" />
          {/* 摘要骨架 - 3行 */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-xf-bg/40 rounded w-full" />
            <div className="h-4 bg-xf-bg/40 rounded w-5/6" />
            <div className="h-4 bg-xf-bg/40 rounded w-4/6" />
          </div>
          {/* 底部信息骨架：作者 + 阅读数据 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-xf-bg/50 rounded-full" />
              <div className="h-3 bg-xf-bg/40 rounded w-16" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 bg-xf-bg/40 rounded w-12" />
              <div className="h-3 bg-xf-bg/40 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
