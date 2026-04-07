'use server'

/**
 * 通知模块 Server Actions
 * @module lib/notifications/actions
 * @description 处理通知相关的查询和操作
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/server'

export type NotificationRow = {
  id: string
  type:
    | 'article_liked'
    | 'comment_liked'
    | 'article_commented'
    | 'comment_replied'
    | 'article_favorited'
    | 'followed'
    | 'mention'
    | 'system'
    | 'announcement'
  title: string
  content: string | null
  actor_id: string | null
  article_id: string | null
  comment_id: string | null
  actor?: { username: string } | { username: string }[] | null
  is_read: boolean
  created_at: string
}

export async function fetchNotificationsPage(args: {
  userId: string
  page: number
  pageSize: number
}) {
  const supabase = await createClient()
  const { userId, page, pageSize } = args

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
        id,
        type,
        title,
        content,
        actor_id,
        article_id,
        comment_id,
        is_read,
        created_at,
        actor:profiles!actor_id(username)
      `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return (data ?? []) as unknown as NotificationRow[]
}

export async function fetchUnreadCount(args: { userId: string }) {
  const supabase = await createClient()
  const { userId } = args

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return count ?? 0
}

export async function markAllAsRead(args: { userId: string }) {
  const supabase = await createClient()
  const { userId } = args

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
}

/**
 * 标记通知为已读
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */
export async function markAsRead(args: { id: string }) {
  const supabase = await createClient()
  const { id } = args

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) throw new Error('未登录')

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id) // 确保只能标记自己的通知

  if (error) throw error
}

/**
 * 删除通知
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */
export async function deleteNotification(args: { id: string }) {
  const supabase = await createClient()
  const { id } = args

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) throw new Error('未登录')

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // 确保只能删除自己的通知
  if (error) throw error
}

/**
 * 批量删除通知
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */
export async function batchDeleteNotifications(args: { ids: string[] }) {
  const supabase = await createClient()
  const { ids } = args
  if (ids.length === 0) return

  // 使用统一认证入口获取当前用户
  const user = await getCurrentUser()
  if (!user) throw new Error('未登录')

  const { error } = await supabase
    .from('notifications')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id) // 确保只能删除自己的通知
  if (error) throw error
}

/**
 * 获取增量通知（只获取比指定时间更新的通知）
 * @description 用于 Realtime 触发后的增量更新，避免全量获取
 * @param args - 参数对象
 * @param args.userId - 用户ID
 * @param args.after - 时间戳，只获取此时间之后创建的通知
 * @returns 新增的通知列表
 */
/**
 * 增量获取新通知（带上限限制）
 *
 * @性能优化 P-03: 添加 limit 限制，防止长时间离线后拉取过多数据
 * @param args.userId - 用户ID
 * @param args.after - 时间戳，只获取此时间之后创建的通知
 * @returns 新增的通知列表（最多 100 条）
 */
export async function fetchNewNotifications(args: {
  userId: string
  after: string
}): Promise<NotificationRow[]> {
  const supabase = await createClient()
  const { userId, after } = args

  /**
   * @性能优化 P-03: 添加 limit(100) 限制
   * - 防止长时间离线后一次拉取过多数据
   * - 避免慢查询和前端渲染压力
   * - 100 条足够覆盖正常场景，超出部分下次轮询获取
   */
  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
        id,
        type,
        title,
        content,
        actor_id,
        is_read,
        created_at,
        actor:profiles!actor_id(username)
      `
    )
    .eq('user_id', userId)
    .gt('created_at', after)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return (data ?? []) as unknown as NotificationRow[]
}
