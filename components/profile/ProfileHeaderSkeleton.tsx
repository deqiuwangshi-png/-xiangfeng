/**
 * 个人资料头部骨架屏组件
 * @module components/profile/ProfileHeaderSkeleton
 * @description 个人资料头部加载状态的骨架屏，优化LCP感知性能
 */

/**
 * 个人资料头部骨架屏组件
 * @function ProfileHeaderSkeleton
 * @returns {JSX.Element} 骨架屏组件
 *
 * @description
 * 提供与 ProfileHeader 相同的布局结构，使用动画骨架效果：
 * - 头像区域圆形骨架
 * - 用户名和元信息行骨架
 * - 关注按钮骨架
 * - 个人简介骨架（可选）
 *
 * @性能优化
 * - 使用 animate-pulse 实现呼吸动画效果
 * - 保持与真实组件相同的尺寸，避免布局偏移
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white border border-xf-bg/60 rounded-xl p-4 sm:p-5 mb-4">
      {/* 横向窄条：头像+用户名+操作按钮 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* 头像骨架 */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-xf-bg animate-pulse" />
            {/* 在线状态指示器骨架 */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-xf-bg rounded-full animate-pulse" />
          </div>

          {/* 用户名和位置信息骨架 */}
          <div className="min-w-0 space-y-2">
            {/* 用户名骨架 */}
            <div className="h-5 w-24 sm:w-32 bg-xf-bg rounded animate-pulse" />
            {/* 位置信息骨架 */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 sm:w-20 bg-xf-bg rounded animate-pulse" />
              <div className="hidden sm:block h-3 w-20 bg-xf-bg rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* 关注按钮骨架 */}
        <div className="shrink-0 h-8 sm:h-9 w-16 sm:w-20 bg-xf-bg rounded-lg animate-pulse" />
      </div>

      {/* 个人简介骨架 */}
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full bg-xf-bg rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-xf-bg rounded animate-pulse" />
      </div>

      {/* 统计信息骨架 */}
      <div className="mt-4 pt-4 border-t border-xf-bg/40">
        <div className="flex items-center justify-around">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-1">
              <div className="h-5 w-8 mx-auto bg-xf-bg rounded animate-pulse" />
              <div className="h-3 w-10 mx-auto bg-xf-bg rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
