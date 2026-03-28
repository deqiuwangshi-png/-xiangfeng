'use server'

/**
 * 积分系统 Server Actions
 * @module lib/rewards/actions/points
 * @description 处理积分查询、积分流水等操作
 */

import { createClient } from '@/lib/supabase/server'
import type {
  UserPointsOverview,
  PointTransaction,
  PointSourceType,
} from '@/types/rewards'

/**
 * 获取用户积分总览
 * @returns {Promise<UserPointsOverview | null>} 用户积分总览
 */
export async function getUserPointsOverview(): Promise<UserPointsOverview | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from('user_points_overview')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('[getUserPointsOverview] 获取积分总览失败:', error)
    return null
  }

  return data as UserPointsOverview
}

/**
 * 获取用户积分流水
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 限制数量
 * @param {number} params.offset - 偏移量
 * @returns {Promise<PointTransaction[]>} 积分流水列表
 */
export async function getPointTransactions(
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<PointTransaction[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('[getPointTransactions] 获取积分流水失败:', error)
    return []
  }

  return data as PointTransaction[]
}

/**
 * 获取即将过期积分
 * @returns {Promise<number>} 即将过期积分数量
 */
export async function getExpiringPoints(): Promise<number> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { data, error } = await supabase
    .from('point_expiration')
    .select('remaining')
    .eq('user_id', user.id)
    .gt('remaining', 0)
    .eq('is_fully_consumed', false)
    .lte('expires_at', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())

  if (error) {
    console.error('[getExpiringPoints] 获取即将过期积分失败:', error)
    return 0
  }

  return data?.reduce((sum, item) => sum + item.remaining, 0) || 0
}

/**
 * 给用户增加积分（内部使用）
 * @param {string} userId - 用户ID
 * @param {number} amount - 积分数量
 * @param {PointSourceType} source - 来源
 * @param {string} description - 描述
 * @param {string} [sourceId] - 关联记录ID
 * @returns {Promise<boolean>} 是否成功
 */
export async function addPoints(
  userId: string,
  amount: number,
  source: PointSourceType,
  description: string,
  sourceId?: string
): Promise<boolean> {
  const supabase = await createClient()

  // 使用RPC调用数据库函数确保原子性
  const { error } = await supabase.rpc('add_user_points', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
    p_description: description,
    p_source_id: sourceId,
  })

  if (error) {
    console.error('[addPoints] 增加积分失败:', error)
    return false
  }

  return true
}

/**
 * 扣除用户积分（内部使用）
 * @param {string} userId - 用户ID
 * @param {number} amount - 积分数量
 * @param {PointSourceType} source - 来源
 * @param {string} description - 描述
 * @param {string} [sourceId] - 关联记录ID
 * @returns {Promise<boolean>} 是否成功
 */
export async function deductPoints(
  userId: string,
  amount: number,
  source: PointSourceType,
  description: string,
  sourceId?: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('deduct_user_points', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
    p_description: description,
    p_source_id: sourceId,
  })

  if (error) {
    console.error('[deductPoints] 扣除积分失败:', error)
    return false
  }

  return true
}
