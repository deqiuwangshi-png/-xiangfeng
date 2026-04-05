import { getCurrentUserWithProfile } from '@/lib/auth/server'
import { getUserPointsOverview } from '@/lib/rewards/points'
import {
  PtOverview,
  PtLevel,
  SignCardSection,
  MyRwSection,
  TaskBoardServer,
  ShopServerGrid,
} from '@/components/rewards'
import {
  UnauthenticatedPrompt,
} from '@/components/auth'
import { Gift } from 'lucide-react'

/**
 * 福利中心页面
 * @module app/(main)/rewards/page
 * @description 福利中心主页面
 * @优化说明 PtOverview和PtLevel改为Server Component，减少客户端JS体积
 *
 * @统一认证 2026-03-30
 * - 页面自行处理未登录状态，显示友好的登录引导
 * - 使用 UnauthenticatedPrompt 组件展示洞察图标和登录按钮
 */

export default async function RewardsPage() {
  const profile = await getCurrentUserWithProfile()

  // 未登录用户：显示登录引导
  if (!profile) {
    return (
      <UnauthenticatedPrompt
        title="福利中心"
        description="签到领积分、完成任务、兑换好礼"
        icon={<Gift className="w-8 h-8 sm:w-10 sm:h-10 text-xf-primary" />}
        promptText="登录后领取你的专属福利"
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
        <TaskBoardServer />
        <ShopServerGrid userPoints={pointsData.current} />
      </div>

      {/* 我的兑换 */}
      <MyRwSection />
    </div>
  )
}
