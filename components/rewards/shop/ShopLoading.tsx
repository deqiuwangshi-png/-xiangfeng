/**
 * 积分商城加载状态
 * @module components/rewards/shop/ShopLoading
 * @description 积分商城页面的加载骨架屏
 */

export default function ShopLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-8 pb-12">
        {/* 头部骨架 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-full w-24 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-full w-32 animate-pulse" />
          </div>
        </div>

        {/* 分类导航骨架 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-full w-20 animate-pulse"
            />
          ))}
        </div>

        {/* 商品网格骨架 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="card-bg rounded-xl p-4 animate-pulse"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mt-1" />
              <div className="h-8 bg-gray-200 rounded w-full mx-auto mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
