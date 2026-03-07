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

/**
 * Supabase通知原始数据接口
 * @interface SupabaseNotification
 */
interface SupabaseNotification {
  id: string
  type: 'article_liked' | 'comment_liked' | 'article_commented' | 'comment_replied' | 'article_favorited' | 'followed' | 'mention' | 'system' | 'announcement'
  title: string
  message: string | null
  sender_name: string | null
  is_read: boolean
  created_at: string
}

/**
 * 从Supabase通知数据转换为前端格式
 * @param raw - Supabase返回的原始数据
 * @returns 前端NotificationData格式
 */
function formatNotification(raw: SupabaseNotification): NotificationData & { createdAt: string } {
  return {
    id: raw.id,
    type: raw.type,
    title: raw.title,
    message: raw.message || '',
    user: raw.sender_name || '未知用户',
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
 * @returns {Object} 通知状态和方法
 */
export function useInbox() {
  const supabase = createClient()
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
   * 获取通知列表
   * @param isLoadMore - 是否为加载更多
   */
  const fetchNotifications = useCallback(async (isLoadMore = false) => {
    setIsLoading(true)

    const currentPage = isLoadMore ? page + 1 : 1
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('获取通知失败:', error)
      setIsLoading(false)
      return
    }

    const formatted = (data as SupabaseNotification[]).map(formatNotification)

    if (isLoadMore) {
      setNotifications(prev => [...prev, ...formatted])
      setPage(currentPage)
    } else {
      setNotifications(formatted)
      setPage(1)
      setUnreadCount(formatted.filter(n => n.unread).length)
    }

    setHasMore(formatted.length === PAGE_SIZE)
    setIsLoading(false)
  }, [supabase, page])

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

  /**
   * 实时订阅新通知
   */
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = formatNotification(payload.new as SupabaseNotification)
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  /**
   * 筛选后的通知列表
   */
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications
    if (activeFilter === 'unread') return notifications.filter(n => n.unread)
    if (activeFilter === 'mention') return notifications.filter(n => n.type === 'reply')
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
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) return

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false)

    if (error) {
      console.error('标记已读失败:', error)
      return
    }

    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    setUnreadCount(0)
  }, [supabase])

  /**
   * 标记单个为已读
   * @param id - 通知ID
   */
  const markAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      console.error('标记已读失败:', error)
      return
    }

    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [supabase])

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
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除消息失败:', error)
      return
    }

    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [supabase])

  /**
   * 批量删除消息
   */
  const batchDeleteNotifications = useCallback(async () => {
    if (selectedIds.size === 0) return

    const ids = Array.from(selectedIds)
    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('批量删除消息失败:', error)
      return
    }

    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)))
    setSelectedIds(new Set())
    setIsBatchMode(false)
  }, [supabase, selectedIds])

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
