'use client'

/**
 * 福利中心客户端组件
 * @module components/rewards/RwClient
 * @description 福利中心主客户端组件，管理状态和交互
 */

import { useEffect, useMemo } from 'react'
import { PtOverview } from './overview/PtOverview'
import { SignCard } from './signin/SignCard'
import { PtLevel } from './overview/PtLevel'
import { TaskBoard } from './tasks/TaskBoard'
import { ShopGrid } from './shop/ShopGrid'
import { MyRw } from './my/MyRw'
import { useSignIn, usePoints } from './hooks'

/**
 * 福利中心客户端组件
 * @returns {JSX.Element} 福利中心客户端组件
 */
export function RwClient() {
  const {
    isSigned,
    consecutiveDays,
    rewardsConfig,
    isSigning,
    signResult,
    handleSignIn,
  } = useSignIn()

  const {
    overview,
    isValidating: isPointsValidating,
    refreshPoints,
  } = usePoints()

  /**
   * 处理签到成功后的积分刷新
   * 监听 signResult 变化，签到成功后立即刷新积分
   */
  useEffect(() => {
    if (signResult?.success) {
      refreshPoints()
    }
  }, [signResult, refreshPoints])

  // 使用 useMemo 缓存积分数据，避免每次渲染创建新对象导致子组件重渲染
  const pointsData = useMemo(() => ({
    current: overview?.current_points || 0,
    earned: overview?.total_earned || 0,
    spent: overview?.total_spent || 0,
  }), [overview])

  return (
    <div className="max-w-6xl mx-auto fade-in-up px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-12">
      {/* 页头 + 积分总览 */}
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
          isValidating={isPointsValidating}
        />
      </div>

      {/* 签到卡片 & 积分等级 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <SignCard
          isSigned={isSigned}
          signDays={consecutiveDays}
          rewardsConfig={rewardsConfig}
          isSigning={isSigning}
          onSign={handleSignIn}
        />
        <PtLevel
          totalEarned={pointsData.earned}
        />
      </div>

      {/* 任务中心 & 兑换商城 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <TaskBoard />
        <ShopGrid userPoints={pointsData.current} />
      </div>

      {/* 我的兑换 */}
      <MyRw />
    </div>
  )
}
