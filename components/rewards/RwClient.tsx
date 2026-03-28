'use client'

/**
 * 福利中心客户端组件集合
 * @module components/rewards/RwClient
 * @description 福利中心客户端组件，管理状态和交互
 * @优化说明 将RwClient拆分为独立组件，支持Server/Client混合架构
 */

import { useEffect } from 'react'
import { SignCard } from './signin/SignCard'
import { TaskBoard } from './tasks/TaskBoard'
import { ShopGrid } from './shop/ShopGrid'
import { MyRw } from './my/MyRw'
import { useSignIn, usePoints } from './hooks'

/**
 * 签到卡片区域组件
 * @returns {JSX.Element} 签到卡片区域
 */
export function SignCardSection() {
  const {
    isSigned,
    consecutiveDays,
    rewardsConfig,
    isSigning,
    signResult,
    handleSignIn,
  } = useSignIn()

  const { refreshPoints } = usePoints()

  /**
   * 处理签到成功后的积分刷新
   */
  useEffect(() => {
    if (signResult?.success) {
      refreshPoints()
    }
  }, [signResult, refreshPoints])

  return (
    <SignCard
      isSigned={isSigned}
      signDays={consecutiveDays}
      rewardsConfig={rewardsConfig}
      isSigning={isSigning}
      onSign={handleSignIn}
    />
  )
}

/**
 * 任务中心区域组件
 * @param {Object} props - 组件属性
 * @param {number} props.userPoints - 用户当前积分
 * @returns {JSX.Element} 任务中心区域
 */
export function TaskBoardSection({ }: { userPoints: number }) {
  return <TaskBoard />
}

/**
 * 兑换商城区域组件
 * @param {Object} props - 组件属性
 * @param {number} props.userPoints - 用户当前积分
 * @returns {JSX.Element} 兑换商城区域
 */
export function ShopGridSection({ userPoints }: { userPoints: number }) {
  return <ShopGrid userPoints={userPoints} />
}

/**
 * 我的兑换区域组件
 * @returns {JSX.Element} 我的兑换区域
 */
export function MyRwSection() {
  return <MyRw />
}
