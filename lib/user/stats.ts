'use server'

/**
 * 用户统计相关 Server Actions
 * @module lib/user/stats
 * @description 处理用户统计数据获取
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 *
 * @性能优化
 * - 使用 profiles 表缓存字段，单次查询获取所有统计
 * - 同一请求内多次调用会复用缓存结果
 * - 所有统计字段由数据库触发器自动维护
 */

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/server'
import type { UserStats } from '@/types'

/**
 * 获取用户统计数据（缓存版本）
 * @returns 用户统计数据
 */
export const getUserStats = cache(async (): Promise<{ success: boolean; data?: UserStats; error?: string }> => {
  try {
    const supabase = await createClient()

    // 使用统一认证入口获取当前用户
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    /**
     * 使用 profiles 表缓存字段获取所有统计
     * @性能优化 单次查询替代多次并行查询，减少数据库往返
     * @说明 articles_count, followers_count, total_likes, nodes_count
     *       均由数据库触发器自动维护
     */
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('articles_count, followers_count, total_likes, nodes_count')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('获取用户统计失败:', JSON.stringify(profileError))
      return { success: false, error: '获取统计数据失败' }
    }

    return {
      success: true,
      data: {
        articles: profile?.articles_count || 0,
        followers: profile?.followers_count || 0,
        likes: profile?.total_likes || 0,
        nodes: profile?.nodes_count || 0,
      },
    }
  } catch (err) {
    console.error('获取用户统计数据失败:', err instanceof Error ? err.message : JSON.stringify(err))
    return { success: false, error: '获取统计数据失败' }
  }
})
