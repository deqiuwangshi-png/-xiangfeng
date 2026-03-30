/**
 * 缓存的 Server Actions
 * @module lib/utils/cachedActions
 * @description 使用 React cache 缓存服务端数据获取
 */

import { cache } from 'react'
import { getShopItems as originalGetShopItems } from '@/lib/rewards/shop'
import { getUserPointsOverview as originalGetUserPointsOverview } from '@/lib/rewards/points'
import { getUserTaskProgress as originalGetUserTaskProgress } from '@/lib/rewards/tasks'
import type { ShopItem, ShopItemCategory } from '@/types/rewards'
import type { UserPointsOverview } from '@/types/rewards'
import type { TaskProgressResponse, TaskCategory } from '@/types/rewards'

/**
 * 缓存的商品列表获取
 * @description 在单个请求周期内缓存结果，避免重复查询
 */
export const getCachedShopItems = cache(
  async (category?: ShopItemCategory): Promise<ShopItem[]> => {
    return originalGetShopItems({ category })
  }
)

/**
 * 缓存的用户积分获取
 * @description 在单个请求周期内缓存结果
 */
export const getCachedUserPoints = cache(
  async (): Promise<UserPointsOverview | null> => {
    return originalGetUserPointsOverview()
  }
)

/**
 * 缓存的任务数据获取
 * @description 在单个请求周期内缓存结果，避免重复查询
 */
export const getCachedUserTaskProgress = cache(
  async (category?: TaskCategory): Promise<TaskProgressResponse[]> => {
    return originalGetUserTaskProgress(category)
  }
)

/**
 * 带重试的数据获取
 * @param {Function} fn - 数据获取函数
 * @param {number} retries - 重试次数
 * @param {number} delay - 重试延迟
 * @returns {Promise<T>} 获取结果
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

/**
 * 带超时的数据获取
 * @param {Function} fn - 数据获取函数
 * @param {number} timeout - 超时时间(ms)
 * @returns {Promise<T>} 获取结果
 */
export async function fetchWithTimeout<T>(
  fn: () => Promise<T>,
  timeout = 5000
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ])
}
