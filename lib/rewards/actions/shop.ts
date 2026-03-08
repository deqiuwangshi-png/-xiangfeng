'use server'

/**
 * 商城系统 Server Actions
 * @module lib/rewards/actions/shop
 * @description 处理商品查询、积分兑换等操作
 */

import { createClient } from '@/lib/supabase/server'
import type {
  ShopItem,
  ExchangeRecord,
  ExchangeRequest,
  ExchangeResponse,
  ShopItemCategory,
} from '@/types/rewards'

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @param {ShopItemCategory} [params.category] - 商品分类筛选
 * @param {boolean} [params.activeOnly=true] - 只显示上架商品
 * @returns {Promise<ShopItem[]>} 商品列表
 */
export async function getShopItems({
  category,
  activeOnly = true,
}: {
  category?: ShopItemCategory
  activeOnly?: boolean
} = {}): Promise<ShopItem[]> {
  const supabase = await createClient()

  let query = supabase.from('shop_items').select('*').order('sort_order')

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('获取商品列表失败:', error)
    return []
  }

  return data as ShopItem[]
}

/**
 * 获取商品详情
 * @param {string} itemId - 商品ID
 * @returns {Promise<ShopItem | null>} 商品详情
 */
export async function getShopItemDetail(itemId: string): Promise<ShopItem | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shop_items')
    .select('*')
    .eq('id', itemId)
    .single()

  if (error) {
    console.error('获取商品详情失败:', error)
    return null
  }

  return data as ShopItem
}

/**
 * 执行积分兑换
 * @param {ExchangeRequest} request - 兑换请求
 * @returns {Promise<ExchangeResponse>} 兑换结果
 */
export async function exchangeItem(request: ExchangeRequest): Promise<ExchangeResponse> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      success: false,
      exchange_id: '',
      points_spent: 0,
      remaining_points: 0,
    }
  }

  const { data, error } = await supabase.rpc('exchange_shop_item', {
    p_user_id: user.id,
    p_item_id: request.item_id,
    p_quantity: request.quantity || 1,
  })

  if (error) {
    console.error('兑换失败:', error)
    return {
      success: false,
      exchange_id: '',
      points_spent: 0,
      remaining_points: 0,
    }
  }

  return data as ExchangeResponse
}

/**
 * 获取用户兑换记录
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 限制数量
 * @param {number} params.offset - 偏移量
 * @returns {Promise<ExchangeRecord[]>} 兑换记录列表
 */
export async function getExchangeRecords({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
} = {}): Promise<ExchangeRecord[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('exchange_records')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('获取兑换记录失败:', error)
    return []
  }

  return data as ExchangeRecord[]
}

/**
 * 获取兑换记录详情
 * @param {string} exchangeId - 兑换记录ID
 * @returns {Promise<ExchangeRecord | null>} 兑换记录详情
 */
export async function getExchangeDetail(exchangeId: string): Promise<ExchangeRecord | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('exchange_records')
    .select('*')
    .eq('id', exchangeId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('获取兑换详情失败:', error)
    return null
  }

  return data as ExchangeRecord
}

/**
 * 使用卡券
 * @param {string} exchangeId - 兑换记录ID
 * @returns {Promise<boolean>} 是否成功
 */
export async function useCoupon(exchangeId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('exchange_records')
    .update({
      status: 'used',
      used_at: new Date().toISOString(),
    })
    .eq('id', exchangeId)
    .eq('user_id', user.id)
    .eq('status', 'issued')

  if (error) {
    console.error('使用卡券失败:', error)
    return false
  }

  return true
}

/**
 * 检查用户是否可以兑换商品
 * @param {string} itemId - 商品ID
 * @param {number} [quantity=1] - 兑换数量
 * @returns {Promise<{canExchange: boolean; reason?: string}>} 检查结果
 */
export async function checkCanExchange(
  itemId: string,
  quantity: number = 1
): Promise<{ canExchange: boolean; reason?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { canExchange: false, reason: '请先登录' }

  // 获取商品信息
  const { data: item } = await supabase
    .from('shop_items')
    .select('*')
    .eq('id', itemId)
    .single()

  if (!item) return { canExchange: false, reason: '商品不存在' }

  if (!item.is_active) return { canExchange: false, reason: '商品已下架' }

  // 获取用户积分
  const { data: points } = await supabase
    .from('user_points')
    .select('current_points')
    .eq('user_id', user.id)
    .single()

  const totalCost = item.points_price * quantity
  if (!points || points.current_points < totalCost) {
    return { canExchange: false, reason: '积分不足' }
  }

  // 检查每日限制
  if (item.daily_limit) {
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('exchange_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .gte('created_at', today)

    if ((count || 0) + quantity > item.daily_limit) {
      return { canExchange: false, reason: '超出今日兑换限制' }
    }
  }

  // 检查用户总限制
  if (item.user_total_limit) {
    const { count } = await supabase
      .from('exchange_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('item_id', itemId)

    if ((count || 0) + quantity > item.user_total_limit) {
      return { canExchange: false, reason: '超出兑换次数限制' }
    }
  }

  return { canExchange: true }
}
