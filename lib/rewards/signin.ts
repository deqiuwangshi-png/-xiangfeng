'use server'

/**
 * 签到系统 Server Actions
 * @module lib/rewards/actions/signin
 * @description 处理每日签到、连续签到奖励
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/server'
import { genNonce, verNonce } from '@/lib/security/nonce'
import { checkServerRateLimit } from '@/lib/security/rateLimitServer'
import type { SignInResponse, SignInRecord } from '@/types/rewards'

/**
 * 获取今日签到状态
 * @returns {Promise<{hasSigned: boolean; consecutiveDays: number}>} 签到状态
 */
export async function getTodaySignInStatus(): Promise<{
  hasSigned: boolean
  consecutiveDays: number
}> {
  const supabase = await createClient()

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) return { hasSigned: false, consecutiveDays: 0 }

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('sign_in_records')
    .select('consecutive_days')
    .eq('user_id', user.id)
    .eq('sign_date', today)
    .single()

  if (error || !data) {
    // 查询昨日签到获取连续天数
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const { data: yesterdayData } = await supabase
      .from('sign_in_records')
      .select('consecutive_days')
      .eq('user_id', user.id)
      .eq('sign_date', yesterday)
      .single()

    return {
      hasSigned: false,
      consecutiveDays: yesterdayData?.consecutive_days || 0,
    }
  }

  return { hasSigned: true, consecutiveDays: data.consecutive_days }
}

/**
 * 获取签到令牌（防重放）
 * @returns {Promise<{nonce: string | null}>} 令牌
 */
export async function getSignInNonce(): Promise<{ nonce: string | null }> {
  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) return { nonce: null }

  const nonce = await genNonce('signin', user.id)
  return { nonce }
}

/**
 * 执行每日签到
 * @param {string} nonce - 防重放令牌
 * @returns {Promise<SignInResponse>} 签到结果
 */
export async function performSignIn(nonce: string): Promise<SignInResponse> {
  const supabase = await createClient()

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      points_earned: 0,
      consecutive_days: 0,
      is_bonus_day: false,
      current_points: 0,
    }
  }

  // 验证令牌
  const valid = await verNonce(nonce)
  if (!valid) {
    return {
      success: false,
      points_earned: 0,
      consecutive_days: 0,
      is_bonus_day: false,
      current_points: 0,
      error: '请求已过期或重复提交',
    } as SignInResponse
  }

  // 签到频率限制：每小时最多签到1次
  const rateLimit = await checkServerRateLimit(`signin:${user.id}`, {
    maxAttempts: 1,
    windowMs: 60 * 60 * 1000, // 1小时
  });

  if (!rateLimit.allowed) {
    return {
      success: false,
      points_earned: 0,
      consecutive_days: 0,
      is_bonus_day: false,
      current_points: 0,
      error: '签到过于频繁，请稍后再试',
    } as SignInResponse
  }

  // 调用安全签到函数（带并发保护）
  const { data, error } = await supabase.rpc('safe_daily_signin', {
    p_user_id: user.id,
  })

  if (error) {
    console.error('签到失败:', error)
    return {
      success: false,
      points_earned: 0,
      consecutive_days: 0,
      is_bonus_day: false,
      current_points: 0,
    }
  }

  return data as SignInResponse
}

/**
 * 获取签到历史记录
 * @param {number} days - 查询天数
 * @returns {Promise<SignInRecord[]>} 签到记录列表
 */
export async function getSignInHistory(days: number = 30): Promise<SignInRecord[]> {
  const supabase = await createClient()

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) return []

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('sign_in_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('sign_date', startDate)
    .order('sign_date', { ascending: false })

  if (error) {
    console.error('获取签到历史失败:', error)
    return []
  }

  return data as SignInRecord[]
}

/**
 * 获取连续签到奖励配置
 * @returns {Promise<Array<{day: number; points: number; isBonus: boolean}>>} 奖励配置
 */
export async function getSignInRewardsConfig(): Promise<
  Array<{ day: number; points: number; isBonus: boolean; bonusPoints: number }>
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sign_in_rewards')
    .select('day_number, points_reward, is_bonus, bonus_extra_points')
    .eq('is_active', true)
    .order('day_number')

  if (error) {
    console.error('获取签到奖励配置失败:', error)
    return []
  }

  return (
    data?.map((item) => ({
      day: item.day_number,
      points: item.points_reward,
      isBonus: item.is_bonus,
      bonusPoints: item.bonus_extra_points,
    })) || []
  )
}
