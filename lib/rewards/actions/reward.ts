'use server'

/**
 * 文章打赏 Server Actions
 * @module lib/rewards/actions/reward
 * @description 处理文章积分打赏功能
 */

import { createClient } from '@/lib/supabase/server'
import { genNonce, verNonce } from '@/lib/security/nonce'

/**
 * 打赏结果
 * @interface RewardResult
 */
interface RewardResult {
  success: boolean
  points?: number
  remainingPoints?: number
  error?: string
}

/**
 * 获取打赏令牌（防重放）
 * @returns {Promise<{nonce: string | null}>} 令牌
 */
export async function getRewardNonce(): Promise<{ nonce: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { nonce: null }
  
  const nonce = await genNonce('reward', user.id)
  return { nonce }
}

/**
 * 打赏文章
 * @param {Object} params - 打赏参数
 * @param {string} params.articleId - 文章ID
 * @param {string} params.authorId - 作者ID
 * @param {number} params.points - 打赏积分
 * @param {string} params.nonce - 防重放令牌
 * @param {string} [params.message] - 留言
 * @returns {Promise<RewardResult>} 打赏结果
 */
export async function rewardArticle({
  articleId,
  authorId,
  points,
  nonce,
  message,
}: {
  articleId: string
  authorId: string
  points: number
  nonce: string
  message?: string
}): Promise<RewardResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '请先登录' }
  }

  // 验证令牌
  const valid = await verNonce(nonce)
  if (!valid) {
    return { success: false, error: '请求已过期或重复提交' }
  }

  // 参数校验
  if (points < 1 || points > 500) {
    return { success: false, error: '打赏金额必须在1-500积分之间' }
  }

  if (user.id === authorId) {
    return { success: false, error: '不能打赏给自己' }
  }

  // 调用安全打赏函数
  const { data, error } = await supabase.rpc('safe_reward_article', {
    p_donor_id: user.id,
    p_recipient_id: authorId,
    p_article_id: articleId,
    p_points: points,
    p_message: message || null,
  })

  if (error) {
    console.error('[rewardArticle] 打赏失败:', error)
    return { success: false, error: error.message }
  }

  const result = data as { success: boolean; points?: number; remaining_points?: number; error?: string }
  
  if (!result.success) {
    return { success: false, error: result.error || '打赏失败' }
  }

  return {
    success: true,
    points: result.points,
    remainingPoints: result.remaining_points,
  }
}

/**
 * 获取文章打赏统计
 * @param {string} articleId - 文章ID
 * @returns {Promise<{totalPoints: number; rewardCount: number}>} 打赏统计
 */
export async function getArticleRewardStats(articleId: string): Promise<{
  totalPoints: number
  rewardCount: number
}> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_article_reward_stats', {
    p_article_id: articleId,
  })

  if (error) {
    console.error('[getArticleRewardStats] 获取失败:', error)
    return { totalPoints: 0, rewardCount: 0 }
  }

  return {
    totalPoints: data?.total_points || 0,
    rewardCount: data?.reward_count || 0,
  }
}

/**
 * 获取文章打赏列表
 * @param {string} articleId - 文章ID
 * @param {Object} params - 分页参数
 * @returns {Promise<Array>} 打赏列表
 */
export async function getArticleRewards(
  articleId: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<Array<{
  id: string
  donorName: string
  pointsAmount: number
  message: string | null
  createdAt: string
}>> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_article_rewards', {
    p_article_id: articleId,
    p_limit: limit,
    p_offset: offset,
  })

  if (error) {
    console.error('[getArticleRewards] 获取失败:', error)
    return []
  }

  return (data || []).map((item: {
    id: string
    donor_name: string
    points_amount: number
    message: string
    created_at: string
  }) => ({
    id: item.id,
    donorName: item.donor_name || '匿名用户',
    pointsAmount: item.points_amount,
    message: item.message,
    createdAt: item.created_at,
  }))
}
