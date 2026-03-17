'use server'

import { createClient } from '@/lib/supabase/server'

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

export async function markAsRead(args: { id: string }) {
  const supabase = await createClient()
  const { id } = args

  // P2-1: 获取当前用户并校验归属
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登录')

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id) // 确保只能标记自己的通知

  if (error) throw error
}

export async function deleteNotification(args: { id: string }) {
  const supabase = await createClient()
  const { id } = args

  // P2-1: 获取当前用户并校验归属
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登录')

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // 确保只能删除自己的通知
  if (error) throw error
}

export async function batchDeleteNotifications(args: { ids: string[] }) {
  const supabase = await createClient()
  const { ids } = args
  if (ids.length === 0) return

  // P2-1: 获取当前用户并校验归属
  const { data: { user } } = await supabase.auth.getUser()
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
export async function fetchNewNotifications(args: {
  userId: string
  after: string
}): Promise<NotificationRow[]> {
  const supabase = await createClient()
  const { userId, after } = args

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

  if (error) throw error
  return (data ?? []) as unknown as NotificationRow[]
}

