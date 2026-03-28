import { AuthRequiredContent } from '@/components/auth/AuthRequiredContent'
import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import { getUserPointsOverview } from '@/lib/rewards/points'
import { PtOverview } from '@/components/rewards/overview/PtOverview'
import { PtLevel } from '@/components/rewards/overview/PtLevel'
import { SignCardSection } from '@/components/rewards/RwClient'
import { TaskBoardSection } from '@/components/rewards/RwClient'
import { ShopGridSection } from '@/components/rewards/RwClient'
import { MyRwSection } from '@/components/rewards/RwClient'

/**
 * 福利中心页面
 * @module app/(main)/rewards/page
 * @description 福利中心主页面，支持未登录状态显示登录引导
 * @优化说明 PtOverview和PtLevel改为Server Component，减少客户端JS体积
 */

/**
 * 福利中心页面
 * @returns {JSX.Element} 福利中心页面
 */
export default async function RewardsPage() {
  const profile = await getCurrentUserWithProfile()

  {/* 未登录状态：显示登录引导 */}
  if (!profile) {
    return (
      <AuthRequiredContent
        title="福利中心"
        description="登录后领取专属福利"
      />
    )
  }

  // 服务端获取积分数据
  const overview = await getUserPointsOverview()
  const pointsData = {
    current: overview?.current_points || 0,
    earned: overview?.total_earned || 0,
    spent: overview?.total_spent || 0,
  }

  return (
    <div className="max-w-6xl mx-auto fade-in-up px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-12">
      {/* 页头 + 积分总览 (Server Component) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-xf-accent font-bold text-layer-1">
            福利中心
          </h1>
          <p className="text-xf-primary mt-1 text-sm">签到 · 做任务 · 兑好礼</p>
        </div>
        <PtOverview
          points={pointsData.current}
          totalEarned={pointsData.earned}
          totalSpent={pointsData.spent}
        />
      </div>

      {/* 签到卡片 & 积分等级 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <SignCardSection />
        <PtLevel totalEarned={pointsData.earned} />
      </div>

      {/* 任务中心 & 兑换商城 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <TaskBoardSection userPoints={pointsData.current} />
        <ShopGridSection userPoints={pointsData.current} />
      </div>

      {/* 我的兑换 */}
      <MyRwSection />
    </div>
  )
}
