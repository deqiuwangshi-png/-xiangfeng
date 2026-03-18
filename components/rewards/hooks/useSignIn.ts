'use client'

/**
 * 签到功能 Hook
 * @module components/rewards/hooks/useSignIn
 * @description 管理签到状态、签到操作和奖励配置，使用 SWR 缓存优化性能
 */

import useSWR, { useSWRConfig } from 'swr'
import { useState, useCallback } from 'react'
import {
  getTodaySignInStatus,
  performSignIn,
  getSignInRewardsConfig,
  getSignInNonce,
} from '@/lib/rewards/actions/signin'
import type { SignInResponse } from '@/types/rewards'

/**
 * 签到奖励配置项
 * @interface SignInRewardItem
 */
interface SignInRewardItem {
  day: number
  points: number
  isBonus: boolean
  bonusPoints: number
}

/**
 * 签到状态数据
 * @interface SignInStatus
 */
interface SignInStatus {
  hasSigned: boolean
  consecutiveDays: number
}

/**
 * useSignIn Hook 返回值
 * @interface UseSignInReturn
 */
interface UseSignInReturn {
  /** 是否已签到 */
  isSigned: boolean
  /** 连续签到天数 */
  consecutiveDays: number
  /** 签到奖励配置 */
  rewardsConfig: SignInRewardItem[]
  /** 是否首次加载中（无缓存数据） */
  isLoading: boolean
  /** 是否在后台验证更新中 */
  isValidating: boolean
  /** 是否正在签到 */
  isSigning: boolean
  /** 签到结果 */
  signResult: SignInResponse | null
  /** 执行签到 */
  handleSignIn: () => Promise<void>
  /** 刷新状态 */
  refreshStatus: () => Promise<void>
}

/**
 * 获取签到状态
 * @returns {Promise<SignInStatus>} 签到状态
 */
const fetchSignInStatus = async (): Promise<SignInStatus> => {
  const status = await getTodaySignInStatus()
  return {
    hasSigned: status.hasSigned,
    consecutiveDays: status.consecutiveDays,
  }
}

/**
 * 获取签到奖励配置
 * @returns {Promise<SignInRewardItem[]>} 奖励配置列表
 */
const fetchRewardsConfig = async (): Promise<SignInRewardItem[]> => {
  return await getSignInRewardsConfig()
}

/**
 * 执行签到操作（带令牌）
 * @returns {Promise<SignInResponse>} 签到结果
 */
const doSignIn = async (): Promise<SignInResponse> => {
  // 先获取令牌
  const { nonce } = await getSignInNonce()
  if (!nonce) {
    return {
      success: false,
      points_earned: 0,
      consecutive_days: 0,
      is_bonus_day: false,
      current_points: 0,
    }
  }
  // 使用令牌执行签到
  return await performSignIn(nonce)
}

/**
 * 签到功能 Hook
 * @returns {UseSignInReturn} 签到状态和操作
 */
export function useSignIn(): UseSignInReturn {
  // 获取 SWR 配置用于刷新其他缓存
  const { mutate: globalMutate } = useSWRConfig()

  // 使用 SWR 获取签到状态 - 10秒去重，挂载时自动获取
  const {
    data: signInStatus,
    isLoading: isStatusLoading,
    isValidating: isStatusValidating,
    mutate: mutateStatus,
  } = useSWR('signin-status', fetchSignInStatus, {
    dedupingInterval: 10000,
    keepPreviousData: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
  })

  // 使用 SWR 获取奖励配置 - 5分钟缓存，保持旧数据，切换页面不重新获取
  const {
    data: rewardsConfig = [],
    isLoading: isConfigLoading,
    isValidating: isConfigValidating,
  } = useSWR('signin-rewards-config', fetchRewardsConfig, {
    dedupingInterval: 300000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
  })

  // 签到操作状态
  const [isSigning, setIsSigning] = useState(false)
  const [signResult, setSignResult] = useState<SignInResponse | null>(null)

  /**
   * 执行签到
   * @returns {Promise<void>}
   */
  const handleSignIn = useCallback(async () => {
    if (signInStatus?.hasSigned || isSigning) return

    setIsSigning(true)
    try {
      const result = await doSignIn()
      setSignResult(result)

      if (result.success) {
        // 乐观更新签到状态缓存
        await mutateStatus(
          {
            hasSigned: true,
            consecutiveDays: result.consecutive_days,
          },
          false
        )

        // 刷新积分数据缓存（签到获得积分）
        await globalMutate('user-points-overview', undefined, { revalidate: true })
      } else {
        // 签到失败时重新验证状态
        await mutateStatus()
      }
    } catch {
      // 签到失败时状态已由mutateStatus处理
    } finally {
      setIsSigning(false)
    }
  }, [signInStatus?.hasSigned, isSigning, mutateStatus, globalMutate])

  /**
   * 刷新签到状态
   * @returns {Promise<void>}
   */
  const refreshStatus = useCallback(async () => {
    await mutateStatus()
  }, [mutateStatus])

  // 错误处理：已在SWR配置中处理

  return {
    isSigned: signInStatus?.hasSigned || false,
    consecutiveDays: signInStatus?.consecutiveDays || 0,
    rewardsConfig,
    isLoading: isStatusLoading || isConfigLoading,
    isValidating: isStatusValidating || isConfigValidating,
    isSigning,
    signResult,
    handleSignIn,
    refreshStatus,
  }
}
