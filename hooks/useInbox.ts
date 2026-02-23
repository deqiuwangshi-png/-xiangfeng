'use client'

import { useState, useMemo } from 'react'
import { Heart, MessageCircle, UserPlus, Bell, AtSign, Award, Clock, Calendar, Archive } from 'lucide-react'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'achievement'
  title: string
  message: string
  user: string
  time: string
  unread: boolean
  icon: React.ElementType
}

interface NotificationGroup {
  id: string
  title: string
  icon: React.ElementType
  notifications: Notification[]
}

type FilterType = 'all' | 'unread' | 'mentions' | 'system'

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: '赞了你的文章',
    message: '《注意力经济时代的认知对抗》',
    user: '认知探索者',
    time: '2分钟前',
    unread: true,
    icon: Heart
  },
  {
    id: '2',
    type: 'comment',
    title: '评论了你的文章',
    message: '“非常赞同关于信息茧房的观点...”',
    user: '极简主义者',
    time: '35分钟前',
    unread: true,
    icon: MessageCircle
  },
  {
    id: '3',
    type: 'follow',
    title: '关注了你',
    message: '',
    user: '哲学漫步',
    time: '2小时前',
    unread: false,
    icon: UserPlus
  },
  {
    id: '4',
    type: 'system',
    title: '你的文章被加入「深度思考」精选',
    message: '',
    user: '系统通知',
    time: '昨天 14:23',
    unread: false,
    icon: Bell
  },
  {
    id: '5',
    type: 'mention',
    title: '在社群中提及了你',
    message: '',
    user: 'Sarah',
    time: '昨天 09:47',
    unread: true,
    icon: AtSign
  },
  {
    id: '6',
    type: 'achievement',
    title: '获得「灵感爆发」成就徽章',
    message: '',
    user: '恭喜！',
    time: '12月18日',
    unread: false,
    icon: Award
  }
]

export function useInbox() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })))
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ))
  }

  const handleLoadMore = () => {
    console.log('加载更多通知')
  }

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(notification => notification.unread)
      case 'mentions':
        return notifications.filter(notification => notification.type === 'mention')
      case 'system':
        return notifications.filter(notification => notification.type === 'system')
      default:
        return notifications
    }
  }, [activeFilter, notifications])

  const groupedNotifications: NotificationGroup[] = [
    {
      id: 'today',
      title: '今天',
      icon: Clock,
      notifications: filteredNotifications.filter((_, index) => index < 3)
    },
    {
      id: 'yesterday',
      title: '昨天',
      icon: Calendar,
      notifications: filteredNotifications.filter((_, index) => index >= 3 && index < 5)
    },
    {
      id: 'earlier',
      title: '更早',
      icon: Archive,
      notifications: filteredNotifications.filter((_, index) => index >= 5)
    }
  ].filter(group => group.notifications.length > 0)

  return {
    activeFilter,
    notifications,
    filteredNotifications,
    groupedNotifications,
    handleFilterClick,
    handleMarkAllAsRead,
    handleMarkAsRead,
    handleLoadMore,
  }
}
