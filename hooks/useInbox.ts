'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
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
  batchDeleteNotifications as batchDeleteNotificationsAction,
  deleteNotification as deleteNotificationAction,
  fetchNotificationsPage,
  fetchUnreadCount as fetchUnreadCountAction,
  markAllAsRead as markAllAsReadAction,
  markAsRead as markAsReadAction,
  type NotificationRow,
} from '@/lib/notifications/actions'

/**
 * Supabase通知原始数据接口
 * @interface SupabaseNotification
 * @description 对应数据库 notifications 表结构
 */
type SupabaseNotification = NotificationRow

/**
 * 从Supabase通知数据转换为前端格式
 * @param raw - Supabase返回的原始数据
 * @returns 前端NotificationData格式
 */
function formatNotification(raw: SupabaseNotification): NotificationData & { createdAt: string } {
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
 * 消息页面状态管理 Hook
 * @description 管理通知数据、筛选状态和操作逻辑，支持Supabase实时订阅
 * @param {string} userId - 当前用户ID（从服务端传入）
 * @returns {Object} 通知状态和方法
 */
export function useInbox(userId: string) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const isInitialMount = useRef(true)
  const PAGE_SIZE = 20

  /**
   * 获取未读消息数量
   * @param uid - 用户ID
   */
  const fetchUnreadCount = useCallback(async (uid: string) => {
    try {
      const count = await fetchUnreadCountAction({ userId: uid })
      setUnreadCount(count)
    } catch (err) {
      console.error('获取未读数失败:', err)
    }
  }, [])

  /**
   * 获取通知列表
   * @param isLoadMore - 是否为加载更多
   */
  const fetchNotifications = useCallback(async (isLoadMore = false) => {
    setIsLoading(true)

    if (!userId) {
      setIsLoading(false)
      return
    }

    const currentPage = isLoadMore ? page + 1 : 1

    let rows: SupabaseNotification[] = []
    try {
      rows = await fetchNotificationsPage({
        userId,
        page: currentPage,
        pageSize: PAGE_SIZE,
      })
    } catch (err) {
      console.error('获取通知失败:', err)
      setIsLoading(false)
      return
    }

    const formatted = rows.map(formatNotification)

    if (isLoadMore) {
      setNotifications(prev => [...prev, ...formatted])
      setPage(currentPage)
    } else {
      setNotifications(formatted)
      setPage(1)
      await fetchUnreadCount(userId)
    }

    setHasMore(formatted.length === PAGE_SIZE)
    setIsLoading(false)
  }, [page, fetchUnreadCount, userId])

  /**
   * 初始加载数据
   * @description 使用 IIFE 避免 React 级联渲染警告
   */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      ;(async () => {
        await fetchNotifications()
      })()
    }
  }, [fetchNotifications])

  const refreshSilently = useCallback(async () => {
    if (!userId) return

    try {
      const [rows, unread] = await Promise.all([
        fetchNotificationsPage({ userId, page: 1, pageSize: PAGE_SIZE }),
        fetchUnreadCountAction({ userId }),
      ])

      const formatted = rows.map(formatNotification)
      setNotifications(formatted)
      setUnreadCount(unread)
      setHasMore(formatted.length === PAGE_SIZE)
      setPage(1)
    } catch (err) {
      console.error('刷新通知失败:', err)
    }
  }, [userId])

  /**
   * Realtime 优先：客户端有 session 则订阅 postgres_changes。
   * 否则降级为轮询（例如仅使用服务端会话、客户端无 JWT 时）。
   */
  useEffect(() => {
    if (!userId) return

    let channel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null
    let pollId: number | null = null
    let cancelled = false

    const supabase = createClient()

    const startPolling = () => {
      // 首次进入：放到微任务中执行，避免在 effect body 同步触发 setState 警告
      queueMicrotask(() => {
        void refreshSilently()
      })

      pollId = window.setInterval(() => {
        if (!isLoading && !isBatchMode) {
          void refreshSilently()
        }
      }, 15000)
    }

    const setup = async () => {
      const { data } = await supabase.auth.getSession()
      const hasSession = Boolean(data.session)

      if (!hasSession) {
        startPolling()
        return
      }

      channel = supabase
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
            if (!cancelled) void refreshSilently()
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
            if (!cancelled) void refreshSilently()
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            // Realtime 失败就降级轮询，保证功能可用
            if (!cancelled) startPolling()
          }
        })
    }

    void setup()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void refreshSilently()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      if (pollId) window.clearInterval(pollId)
      if (channel) supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [userId, refreshSilently, isLoading, isBatchMode])

  /**
   * 筛选后的通知列表
   */
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications
    if (activeFilter === 'unread') return notifications.filter(n => n.unread)
    if (activeFilter === 'mention') return notifications.filter(n => n.type === 'mention')
    if (activeFilter === 'system') return notifications.filter(n => n.type === 'system' || n.type === 'announcement')
    return notifications
  }, [notifications, activeFilter])

  /**
   * 按时间分组的通知 - 单次遍历优化
   */
  const groupedNotifications: NotificationGroup[] = useMemo(() => {
    const today: NotificationWithIcon[] = []
    const yesterday: NotificationWithIcon[] = []
    const earlier: NotificationWithIcon[] = []

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart.getTime() - 86400000)

    for (const n of filteredNotifications) {
      const item = { ...n, icon: notificationIconMap[n.type] }
      const created = new Date((n as NotificationData & { createdAt: string }).createdAt)

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
  }, [filteredNotifications])

  /**
   * 标记所有为已读
   */
  const markAllAsRead = useCallback(async () => {
    if (!userId) return

    try {
      await markAllAsReadAction({ userId })
    } catch (err) {
      console.error('标记已读失败:', err)
      return
    }

    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    setUnreadCount(0)
  }, [userId])

  /**
   * 标记单个为已读
   * @param id - 通知ID
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      await markAsReadAction({ id })
    } catch (err) {
      console.error('标记已读失败:', err)
      return
    }

    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  /**
   * 加载更多（分页）
   */
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchNotifications(true)
    }
  }, [isLoading, hasMore, fetchNotifications])

  /**
   * 切换批量模式
   */
  const toggleBatchMode = useCallback(() => {
    setIsBatchMode(prev => !prev)
    setSelectedIds(new Set())
  }, [])

  /**
   * 取消批量模式
   */
  const cancelBatchMode = useCallback(() => {
    setIsBatchMode(false)
    setSelectedIds(new Set())
  }, [])

  /**
   * 选择/取消选择消息
   * @param id - 消息ID
   * @param selected - 是否选中
   */
  const selectNotification = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])

  /**
   * 删除单条消息
   * @param id - 消息ID
   */
  const deleteNotification = useCallback(async (id: string) => {
    const notification = notifications.find(n => n.id === id)

    try {
      await deleteNotificationAction({ id })
    } catch (err) {
      console.error('删除消息失败:', err)
      return
    }

    setNotifications(prev => prev.filter(n => n.id !== id))

    if (notification?.unread) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }, [notifications])

  /**
   * 批量删除消息
   */
  const batchDeleteNotifications = useCallback(async () => {
    if (selectedIds.size === 0) return

    const ids = Array.from(selectedIds)
    const unreadDeletedCount = notifications.filter(
      n => selectedIds.has(n.id) && n.unread
    ).length

    try {
      await batchDeleteNotificationsAction({ ids })
    } catch (err) {
      console.error('批量删除消息失败:', err)
      return
    }

    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)))
    setUnreadCount(prev => Math.max(0, prev - unreadDeletedCount))
    setSelectedIds(new Set())
    setIsBatchMode(false)
  }, [selectedIds, notifications])

  return {
    activeFilter,
    setActiveFilter,
    groupedNotifications,
    isLoading,
    hasMore,
    unreadCount,
    isBatchMode,
    selectedIds,
    selectedCount: selectedIds.size,
    markAllAsRead,
    markAsRead,
    loadMore,
    toggleBatchMode,
    cancelBatchMode,
    selectNotification,
    deleteNotification,
    batchDeleteNotifications,
  }
}
