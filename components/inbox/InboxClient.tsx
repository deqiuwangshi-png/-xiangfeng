'use client'

import { useState, useMemo } from 'react'
import { InboxHeader } from './InboxHeader'
import { FilterTabs } from './FilterTabs'
import { NotificationList } from './NotificationList'
import { InboxEmptyState } from './InboxEmptyState'
import { NotificationCardSkeleton } from './NotificationCardSkeleton'
import { Heart, MessageCircle, UserPlus, Bell, AtSign, Award } from 'lucide-react'

/**
 * 通知类型
 */
type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'achievement'

/**
 * 通知数据接口
 */
interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  user: string
  time: string
  unread: boolean
}

/**
 * 通知分组接口
 */
interface NotificationGroup {
  id: string
  title: string
  notifications: NotificationData[]
}

/**
 * 图标映射表
 */
const iconMap: Record<NotificationType, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
  system: Bell,
  achievement: Award,
}

/**
 * 模拟通知数据
 */
const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'like',
    title: '赞了你的文章',
    message: '《注意力经济时代的认知对抗》',
    user: '认知探索者',
    time: '2分钟前',
    unread: true,
  },
  {
    id: '2',
    type: 'comment',
    title: '评论了你的文章',
    message: '"非常赞同关于信息茧房的观点..."',
    user: '极简主义者',
    time: '35分钟前',
    unread: true,
  },
  {
    id: '3',
    type: 'follow',
    title: '关注了你',
    message: '',
    user: '哲学漫步',
    time: '2小时前',
    unread: false,
  },
  {
    id: '4',
    type: 'system',
    title: '你的文章被加入「深度思考」精选',
    message: '',
    user: '系统通知',
    time: '昨天 14:23',
    unread: false,
  },
  {
    id: '5',
    type: 'mention',
    title: '在社群中提及了你',
    message: '',
    user: 'Sarah',
    time: '昨天 09:47',
    unread: true,
  },
  {
    id: '6',
    type: 'achievement',
    title: '获得「灵感爆发」成就徽章',
    message: '',
    user: '恭喜！',
    time: '12月18日',
    unread: false,
  }
]

/**
 * 为通知数据添加图标组件
 */
function enrichNotificationsWithIcons(notifications: NotificationData[]) {
  return notifications.map(notification => ({
    ...notification,
    icon: iconMap[notification.type],
  }))
}

/**
 * 消息页客户端组件
 * @description 处理所有客户端交互逻辑
 * @returns {JSX.Element} 消息页JSX
 */
export function InboxClient() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'mentions' | 'system'>('all')
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 按时间分组的通知
   */
  const groupedNotifications: NotificationGroup[] = useMemo(() => {
    let filtered = notifications

    // 应用筛选
    if (activeFilter === 'unread') {
      filtered = notifications.filter(n => n.unread)
    } else if (activeFilter === 'mentions') {
      filtered = notifications.filter(n => n.type === 'mention')
    } else if (activeFilter === 'system') {
      filtered = notifications.filter(n => n.type === 'system')
    }

    // 按时间分组
    const groups: NotificationGroup[] = [
      {
        id: 'today',
        title: '今天',
        notifications: filtered.filter(n => n.time.includes('分钟') || n.time.includes('小时'))
      },
      {
        id: 'yesterday',
        title: '昨天',
        notifications: filtered.filter(n => n.time.includes('昨天'))
      },
      {
        id: 'earlier',
        title: '更早',
        notifications: filtered.filter(n => n.time.includes('月') || n.time.includes('年'))
      }
    ].filter(group => group.notifications.length > 0)

    return groups
  }, [notifications, activeFilter])

  /**
   * 处理筛选变化
   */
  const handleFilterChange = (filter: 'all' | 'unread' | 'mentions' | 'system') => {
    setActiveFilter(filter)
  }

  /**
   * 标记所有为已读
   */
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  /**
   * 标记单个为已读
   */
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ))
  }

  /**
   * 加载更多
   */
  const handleLoadMore = () => {
    setIsLoading(true)
    // 模拟加载延迟
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  /**
   * 打开设置
   */
  const handleSettings = () => {
    console.log('打开设置')
  }

  // 转换通知数据，为分组和通知添加图标
  const enrichedGroups = groupedNotifications.map(group => ({
    ...group,
    icon: Bell, // 为分组添加图标
    notifications: enrichNotificationsWithIcons(group.notifications),
  }))

  return (
    <div className="max-w-3xl mx-auto px-8 pt-8 pb-20">
      {/* LCP关键区域：页面头部 */}
      <InboxHeader
        onMarkAllAsRead={handleMarkAllAsRead}
        onSettings={handleSettings}
      />

      {/* 筛选标签 */}
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* 通知列表 */}
      {isLoading ? (
        <NotificationCardSkeleton count={5} />
      ) : enrichedGroups.length > 0 ? (
        <NotificationList
          groupedNotifications={enrichedGroups}
          onMarkAsRead={handleMarkAsRead}
          onLoadMore={handleLoadMore}
        />
      ) : (
        <InboxEmptyState
          title="暂无通知"
          description="当有新消息时，会显示在这里"
        />
      )}
    </div>
  )
}
