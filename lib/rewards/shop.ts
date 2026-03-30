'use server'

/**
 * 商城系统 Server Actions
 * @module lib/rewards/actions/shop
 * @description 处理商品查询、积分兑换等操作
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/user'
import type {
  ShopItem,
  ExchangeRecord,
  ExchangeRequest,
  ExchangeResponse,
  ShopItemCategory,
  ExchangeRecordWithItem,
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

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      exchange_id: '',
      points_spent: 0,
      remaining_points: 0,
    }
  }

  {/* P0-1: 服务端输入校验 - 验证 item_id 和 quantity */}
  if (!request.item_id || typeof request.item_id !== 'string' || request.item_id.length < 1) {
    console.error('兑换失败: 无效的商品ID')
    return {
      success: false,
      exchange_id: '',
      points_spent: 0,
      remaining_points: 0,
    }
  }

  const quantity = Math.floor(Number(request.quantity) || 1)
  if (quantity < 1 || quantity > 100 || !Number.isFinite(quantity)) {
    console.error('兑换失败: 数量必须在 1-100 之间')
    return {
      success: false,
      exchange_id: '',
      points_spent: 0,
      remaining_points: 0,
    }
  }

  // 调用安全兑换函数（带库存检查和并发保护）
  const { data, error } = await supabase.rpc('safe_exchange_item', {
    p_user_id: user.id,
    p_item_id: request.item_id,
    p_quantity: quantity,
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
 * 获取用户兑换记录（含商品详情）
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 限制数量
 * @param {number} params.offset - 偏移量
 * @returns {Promise<ExchangeRecordWithItem[]>} 兑换记录列表（含商品详情）
 */
export async function getExchangeRecords({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
} = {}): Promise<ExchangeRecordWithItem[]> {
  const supabase = await createClient()

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) return []

  {/* P1-3: 使用外键关联查询，避免客户端二次请求 */}
  const { data, error } = await supabase
    .from('exchange_records')
    .select(`
      *,
      shop_items!inner(name, icon_name, icon_color)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('获取兑换记录失败:', error)
    return []
  }

  {/* 转换为标准格式 */}
  return (data || []).map((record) => ({
    ...record,
    item: record.shop_items ? {
      name: (record.shop_items as { name?: string })?.name || '未知商品',
      icon_name: (record.shop_items as { icon_name?: string })?.icon_name || 'Gift',
      icon_color: (record.shop_items as { icon_color?: string })?.icon_color || '',
    } : null,
  })) as ExchangeRecordWithItem[]
}

/**
 * 获取兑换记录详情
 * @param {string} exchangeId - 兑换记录ID
 * @returns {Promise<ExchangeRecord | null>} 兑换记录详情
 */
export async function getExchangeDetail(exchangeId: string): Promise<ExchangeRecord | null> {
  const supabase = await createClient()

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
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

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) return false

  {/* P0-3: 检查实际更新行数，防止"未更新也返回true" */}
  const { data, error } = await supabase
    .from('exchange_records')
    .update({
      status: 'used',
      used_at: new Date().toISOString(),
    })
    .eq('id', exchangeId)
    .eq('user_id', user.id)
    .eq('status', 'issued')
    .select('id')

  if (error) {
    console.error('使用卡券失败:', error)
    return false
  }

  {/* 检查是否真的有记录被更新 */}
  if (!data || data.length === 0) {
    console.error('使用卡券失败: 未找到符合条件的记录')
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

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
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

  // 检查每日限制 - P0-2: 使用 sum(quantity) 而不是 count
  if (item.daily_limit) {
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyData } = await supabase
      .from('exchange_records')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .gte('created_at', today)

    const dailyTotal = (dailyData || []).reduce((sum, r) => sum + (r.quantity || 1), 0)
    if (dailyTotal + quantity > item.daily_limit) {
      return { canExchange: false, reason: '超出今日兑换限制' }
    }
  }

  // 检查用户总限制 - P0-2: 使用 sum(quantity) 而不是 count
  if (item.user_total_limit) {
    const { data: totalData } = await supabase
      .from('exchange_records')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('item_id', itemId)

    const totalExchanged = (totalData || []).reduce((sum, r) => sum + (r.quantity || 1), 0)
    if (totalExchanged + quantity > item.user_total_limit) {
      return { canExchange: false, reason: '超出兑换次数限制' }
    }
  }

  return { canExchange: true }
}
