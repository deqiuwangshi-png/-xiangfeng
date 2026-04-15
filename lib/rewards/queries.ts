import { createClient } from '@/lib/supabase/server'

export interface SubscriptionPlan {
  code: string
  name: string
  dailyPoints: number
  priceMonthly: number
  sortOrder: number
}

export interface UserSubscriptionInfo {
  planCode: string
  status: string
  lastDailyGrantDate: string | null
}

export interface PointsOverview {
  currentPoints: number
  totalEarned: number
  totalSpent: number
}

export interface PointTransactionItem {
  id: string
  type: 'earn' | 'spend' | 'expire' | 'refund'
  amount: number
  balanceAfter: number
  source: string
  description: string | null
  createdAt: string
}

export interface DailyGrantResult {
  success: boolean
  alreadyGranted: boolean
  planCode: string | null
  grantedPoints: number
  currentPoints: number
  error?: string
}

function parseDailyGrant(payload: unknown): DailyGrantResult {
  const data = (payload ?? {}) as Record<string, unknown>
  return {
    success: Boolean(data.success),
    alreadyGranted: Boolean(data.already_granted),
    planCode: typeof data.plan_code === 'string' ? data.plan_code : null,
    grantedPoints: Number(data.granted_points ?? 0),
    currentPoints: Number(data.current_points ?? 0),
    error: typeof data.error === 'string' ? data.error : undefined,
  }
}

export async function grantDailySubscriptionPoints(userId: string): Promise<DailyGrantResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('safe_grant_daily_subscription_points', {
    p_user_id: userId,
  })

  if (error) {
    return {
      success: false,
      alreadyGranted: false,
      planCode: null,
      grantedPoints: 0,
      currentPoints: 0,
      error: '每日积分发放失败',
    }
  }

  return parseDailyGrant(data)
}

export async function getActivePlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscription_plans')
    .select('code, name, daily_points, price_monthly, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (!data || data.length === 0) return []

  return data.map((row) => ({
    code: row.code,
    name: row.name,
    dailyPoints: row.daily_points,
    priceMonthly: row.price_monthly,
    sortOrder: row.sort_order,
  }))
}

export async function getActiveSubscription(userId: string): Promise<UserSubscriptionInfo | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_subscriptions')
    .select('plan_code, status, last_daily_grant_date, started_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null

  return {
    planCode: data.plan_code,
    status: data.status,
    lastDailyGrantDate: data.last_daily_grant_date,
  }
}

export async function getPointsOverview(userId: string): Promise<PointsOverview> {
  const supabase = await createClient()
  const { data: pointsRow } = await supabase
    .from('user_points')
    .select('current_points, total_earned, total_spent')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  return {
    currentPoints: pointsRow?.current_points ?? 0,
    totalEarned: pointsRow?.total_earned ?? 0,
    totalSpent: pointsRow?.total_spent ?? 0,
  }
}

export async function getPointTransactions(userId: string, limit = 20): Promise<PointTransactionItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('point_transactions')
    .select('id, type, amount, balance_after, source, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!data || data.length === 0) return []

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    amount: row.amount,
    balanceAfter: row.balance_after,
    source: row.source,
    description: row.description,
    createdAt: row.created_at,
  }))
}

