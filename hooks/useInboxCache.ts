'use client'

/**
 * 消息通知 SWR 全局缓存 Hook
 * @module hooks/useInboxCache
 * @description 实现页面级别缓存，避免重复获取，支持增量更新
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  type NotificationData,
  type NotificationGroup,
  type FilterType,
  notificationIconMap,
  NotificationWithIcon,
} from '@/types/notification'
import {
  fetchNotificationsPage,
  fetchUnreadCount as fetchUnreadCountAction,
  fetchNewNotifications,
  type NotificationRow,
} from '@/lib/notifications/actions'

/** SWR 缓存 Key */
const INBOX_CACHE_KEY = 'inbox/notifications'

/** 分页大小 */
const PAGE_SIZE = 20

/** 轮询间隔（毫秒） */
const POLLING_INTERVAL = 30000

/**
 * 格式化时间为相对时间
 * @param dateString - ISO时间字符串
 * @returns 相对时间文本
 */
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days < 30) return `${days}天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 从 Supabase 通知数据转换为前端格式
 * @param raw - Supabase返回的原始数据
 * @returns 前端 NotificationData 格式
 */
function formatNotification(raw: NotificationRow): NotificationData & { createdAt: string } {
  const actorUsername =
    !raw.actor
      ? null
      : Array.isArray(raw.actor)
        ? raw.actor[0]?.username
        : raw.actor.username

  return {
    id: raw.id,
    type: raw.type,
    title: raw.title,
    message: raw.content || '',
    user: actorUsername || '未知用户',
    time: formatTime(raw.created_at),
    unread: !raw.is_read,
    createdAt: raw.created_at,
  }
}

/**
 * 按时间分组通知
 * @param notifications - 通知列表
 * @returns 分组后的通知
 */
function groupNotificationsByTime(
  notifications: (NotificationData & { createdAt: string })[]
): NotificationGroup[] {
  const today: NotificationWithIcon[] = []
  const yesterday: NotificationWithIcon[] = []
  const earlier: NotificationWithIcon[] = []

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86400000)

  for (const n of notifications) {
    const item = { ...n, icon: notificationIconMap[n.type] }
    const created = new Date(n.createdAt)

    if (created >= todayStart) {
      today.push(item)
    } else if (created >= yesterdayStart) {
      yesterday.push(item)
    } else {
      earlier.push(item)
    }
  }

  const groups: NotificationGroup[] = []
  if (today.length) groups.push({ id: 'today', title: '今天', icon: Bell, notifications: today })
  if (yesterday.length) groups.push({ id: 'yesterday', title: '昨天', icon: Bell, notifications: yesterday })
  if (earlier.length) groups.push({ id: 'earlier', title: '更早', icon: Bell, notifications: earlier })

  return groups
}

/**
 * 获取通知列表（SWR fetcher）
 * @param userId - 用户ID
 * @returns 格式化后的通知列表
 */
async function fetchNotificationsFetcher(userId: string): Promise<(NotificationData & { createdAt: string })[]> {
  if (!userId) return []

  const rows = await fetchNotificationsPage({
    userId,
    page: 1,
    pageSize: PAGE_SIZE,
  })

  return rows.map(formatNotification)
}

/**
 * 获取未读数量（SWR fetcher）
 * @param userId - 用户ID
 * @returns 未读数量
 */
async function fetchUnreadCountFetcher(userId: string): Promise<number> {
  if (!userId) return 0
  return fetchUnreadCountAction({ userId })
}

/**
 * 消息通知缓存 Hook 返回类型
 */
interface UseInboxCacheReturn {
  /** 分组后的通知列表 */
  groupedNotifications: NotificationGroup[]
  /** 所有通知（原始格式） */
  notifications: (NotificationData & { createdAt: string })[]
  /** 是否加载中 */
  isLoading: boolean
  /** 是否验证中（后台更新） */
  isValidating: boolean
  /** 未读数量 */
  unreadCount: number
  /** 是否有更多数据 */
  hasMore: boolean
  /** 当前页码 */
  currentPage: number
  /** 加载更多 */
  loadMore: () => Promise<void>
  /** 刷新数据（增量更新） */
  refresh: () => Promise<void>
  /** 标记所有为已读 */
  markAllAsRead: () => void
  /** 标记单个为已读 */
  markAsRead: (id: string) => void
  /** 删除通知 */
  deleteNotification: (id: string) => void
  /** 批量删除通知 */
  batchDeleteNotifications: (ids: string[]) => void
}

/**
 * 消息通知 SWR 全局缓存 Hook
 * @description 实现页面级别缓存，避免重复获取，支持增量更新
 * @param userId - 当前用户ID
 * @param activeFilter - 当前筛选类型
 * @returns 通知状态和方法
 */
export function useInboxCache(
  userId: string,
  activeFilter: FilterType
): UseInboxCacheReturn {
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // 使用 SWR 缓存通知列表
  const {
    data: notifications = [],
    isLoading,
    isValidating,
    mutate: mutateNotifications,
  } = useSWR(
    userId ? [INBOX_CACHE_KEY, userId] : null,
    () => fetchNotificationsFetcher(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: Infinity, // 页面级别缓存，不重复获取
      keepPreviousData: true,
    }
  )

  // 使用 SWR 缓存未读数量
  const { data: unreadCount = 0, mutate: mutateUnreadCount } = useSWR(
    userId ? [`${INBOX_CACHE_KEY}/unread`, userId] : null,
    () => fetchUnreadCountFetcher(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: POLLING_INTERVAL,
    }
  )

  // 筛选后的通知
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications
    if (activeFilter === 'unread') return notifications.filter(n => n.unread)
    if (activeFilter === 'mention') return notifications.filter(n => n.type === 'mention')
    if (activeFilter === 'system') return notifications.filter(n => n.type === 'system' || n.type === 'announcement')
    return notifications
  }, [notifications, activeFilter])

  // 分组后的通知
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByTime(filteredNotifications)
  }, [filteredNotifications])

  // 加载更多
  const loadMore = useCallback(async () => {
    if (!userId || !hasMore) return

    const nextPage = currentPage + 1

    try {
      const rows = await fetchNotificationsPage({
        userId,
        page: nextPage,
        pageSize: PAGE_SIZE,
      })

      const newNotifications = rows.map(formatNotification)

      if (newNotifications.length < PAGE_SIZE) {
        setHasMore(false)
      }

      // 合并新数据到缓存
      await mutateNotifications(
        (prev = []) => [...prev, ...newNotifications],
        { revalidate: false }
      )

      setCurrentPage(nextPage)
    } catch (err) {
      console.error('加载更多通知失败:', err)
    }
  }, [userId, hasMore, currentPage, mutateNotifications])

  // 刷新数据（增量更新）
  const refresh = useCallback(async () => {
    if (!userId) return

    try {
      // 获取当前缓存中最新通知的时间
      const latestNotification = notifications[0]
      const afterTime = latestNotification?.createdAt || new Date(0).toISOString()

      // 获取新增通知（增量获取）
      const [newRows, newUnreadCount] = await Promise.all([
        fetchNewNotifications({ userId, after: afterTime }),
        fetchUnreadCountAction({ userId }),
      ])

      if (newRows.length === 0) {
        // 没有新通知，只更新未读数量
        await mutateUnreadCount(newUnreadCount, { revalidate: false })
        return
      }

      const newNotifications = newRows.map(formatNotification)

      // 合并新数据：新数据添加到前面
      await mutateNotifications(
        (prev = []) => {
          const existingIds = new Set(prev.map(n => n.id))
          const trulyNew = newNotifications.filter(n => !existingIds.has(n.id))
          return [...trulyNew, ...prev]
        },
        { revalidate: false }
      )

      // 更新未读数量
      await mutateUnreadCount(newUnreadCount, { revalidate: false })
    } catch (err) {
      console.error('刷新通知失败:', err)
    }
  }, [userId, notifications, mutateNotifications, mutateUnreadCount])

  // 标记所有为已读（乐观更新）
  const markAllAsRead = useCallback(() => {
    mutateNotifications(
      (prev = []) => prev.map(n => ({ ...n, unread: false })),
      { revalidate: false }
    )
    mutateUnreadCount(0, { revalidate: false })
  }, [mutateNotifications, mutateUnreadCount])

  // 标记单个为已读（乐观更新）
  const markAsRead = useCallback((id: string) => {
    mutateNotifications(
      (prev = []) => prev.map(n =>
        n.id === id ? { ...n, unread: false } : n
      ),
      { revalidate: false }
    )
    mutateUnreadCount(
      (prev = 0) => Math.max(0, prev - 1),
      { revalidate: false }
    )
  }, [mutateNotifications, mutateUnreadCount])

  // 删除通知（乐观更新）
  const deleteNotification = useCallback((id: string) => {
    const notification = notifications.find(n => n.id === id)

    mutateNotifications(
      (prev = []) => prev.filter(n => n.id !== id),
      { revalidate: false }
    )

    if (notification?.unread) {
      mutateUnreadCount(
        (prev = 0) => Math.max(0, prev - 1),
        { revalidate: false }
      )
    }
  }, [notifications, mutateNotifications, mutateUnreadCount])

  // 批量删除通知（乐观更新）
  const batchDeleteNotifications = useCallback((ids: string[]) => {
    const unreadDeletedCount = notifications.filter(
      n => ids.includes(n.id) && n.unread
    ).length

    mutateNotifications(
      (prev = []) => prev.filter(n => !ids.includes(n.id)),
      { revalidate: false }
    )

    if (unreadDeletedCount > 0) {
      mutateUnreadCount(
        (prev = 0) => Math.max(0, prev - unreadDeletedCount),
        { revalidate: false }
      )
    }
  }, [notifications, mutateNotifications, mutateUnreadCount])

  return {
    groupedNotifications,
    notifications,
    isLoading,
    isValidating,
    unreadCount,
    hasMore,
    currentPage,
    loadMore,
    refresh,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    batchDeleteNotifications,
  }
}

/**
 * 使用 Realtime 订阅通知更新
 * @description 订阅 Supabase Realtime，收到新通知时触发增量更新
 * @param userId - 用户ID
 * @param onNewNotification - 新通知回调
 */
export function useInboxRealtime(
  userId: string,
  onNewNotification: () => void
): void {
  const callbackRef = useRef(onNewNotification)

  // 使用 useEffect 更新 ref，避免在 render 期间更新
  useEffect(() => {
    callbackRef.current = onNewNotification
  }, [onNewNotification])

  useSWR(
    userId ? [`${INBOX_CACHE_KEY}/realtime`, userId] : null,
    async () => {
      const supabase = createClient()

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            callbackRef.current()
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            callbackRef.current()
          }
        )
        .subscribe()

      // 返回清理函数
      return () => {
        supabase.removeChannel(channel)
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: Infinity,
    }
  )
}
