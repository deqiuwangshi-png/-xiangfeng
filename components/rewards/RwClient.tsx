'use client'

/**
 * 福利中心客户端组件集合
 * @module components/rewards/RwClient
 * @description 福利中心客户端组件，管理状态和交互
 * @优化说明 将RwClient拆分为独立组件，支持Server/Client混合架构
 */

import { useEffect } from 'react'
import { SignCard } from './signin/SignCard'
import { MyRw } from './my/MyRw'
import { useSignIn } from '@/hooks'
import { useExchangeRecords } from '@/hooks/rewards/useExchangeRecords'

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
    handleSignIn,
    signResult,
  } = useSignIn()

  const { refreshRecords } = useExchangeRecords()

  /**
   * 监听签到结果，成功后刷新兑换记录
   */
  useEffect(() => {
    if (signResult?.success) {
      refreshRecords()
    }
  }, [signResult, refreshRecords])

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
 * @deprecated 使用服务端组件 TaskBoardServer 代替
 */
export function TaskBoardSection({ }: { userPoints: number }) {
  return null
}

/**
 * 兑换商城区域组件
 * @param {Object} props - 组件属性
 * @param {number} props.userPoints - 用户当前积分
 * @returns {JSX.Element} 兑换商城区域
 * @deprecated 使用服务端组件 ShopGridServer 代替
 */
export function ShopGridSection({ userPoints }: { userPoints: number }) {
  return null
}

/**
 * 我的兑换区域组件
 * @returns {JSX.Element} 我的兑换区域
 */
export function MyRwSection() {
  return <MyRw />
}
