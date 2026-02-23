'use client'

/**
 * 消息页面组件
 * @returns {JSX.Element} 消息页面组件
 * 功能说明:
 *   - 显示用户通知消息
 *   - 支持消息筛选（全部、未读、提及、系统）
 *   - 按时间分组展示消息（今天、昨天、更早）
 *   - 支持批量标记已读
 *   - 显示消息状态（已读/未读）
 * 更新时间: 2026-02-23
 */

import { Bell, CheckCheck, Settings, Heart, MessageCircle, UserPlus, AtSign, Award, Loader, Clock, Calendar, Archive, MoreVertical } from 'lucide-react'
import { useState, useMemo } from 'react'

/**
 * 通知类型定义
 * 
 * @interface Notification
 * @property {string} id - 通知唯一标识
 * @property {string} type - 通知类型（like, comment, follow, mention, system, achievement）
 * @property {string} title - 通知标题
 * @property {string} message - 通知内容
 * @property {string} user - 发送用户
 * @property {string} time - 发送时间
 * @property {boolean} unread - 是否已读
 * @property {string} icon - 通知图标
 */
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

/**
 * 消息分组定义
 * 
 * @interface NotificationGroup
 * @property {string} id - 分组唯一标识
 * @property {string} title - 分组标题
 * @property {React.ElementType} icon - 分组图标
 * @property {Notification[]} notifications - 分组内通知列表
 */
interface NotificationGroup {
  id: string
  title: string
  icon: React.ElementType
  notifications: Notification[]
}

/**
 * 模拟通知数据
 * 
 * @constant mockNotifications
 * @description 模拟不同类型的通知消息
 */
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

/**
 * 筛选类型定义
 */
type FilterType = 'all' | 'unread' | 'mentions' | 'system'

/**
 * 消息页面组件
 * 
 * @function InboxPage
 * @returns {JSX.Element} 消息页面组件
 * 
 * @description
 * 实现消息通知页面，包括：
 * - 页面标题和操作按钮
 * - 消息筛选标签
 * - 按时间分组的通知列表
 * - 通知卡片（已读/未读状态）
 * - 加载更多功能
 * 
 * @state
 * - activeFilter: 当前激活的筛选类型
 * - notifications: 通知数据列表
 * 
 * @effects
 * - 根据筛选类型过滤通知
 * - 按时间分组通知
 */
export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  /**
   * 处理筛选标签点击
   * 
   * @function handleFilterClick
   * @param {FilterType} filter - 筛选类型
   * @returns {void}
   * 
   * @description
   * 更新当前激活的筛选类型
   */
  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  /**
   * 处理标记全部已读
   * 
   * @function handleMarkAllAsRead
   * @returns {void}
   * 
   * @description
   * 将所有通知标记为已读
   */
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })))
  }

  /**
   * 处理单个通知标记已读
   * 
   * @function handleMarkAsRead
   * @param {string} id - 通知ID
   * @returns {void}
   * 
   * @description
   * 将指定通知标记为已读
   */
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ))
  }

  /**
   * 处理加载更多
   * 
   * @function handleLoadMore
   * @returns {void}
   * 
   * @description
   * 模拟加载更多通知
   */
  const handleLoadMore = () => {
    // 实际项目中这里会调用API加载更多通知
    console.log('加载更多通知')
  }

  /**
   * 根据筛选类型过滤通知
   * 
   * @constant filteredNotifications
   * @description 根据当前激活的筛选类型过滤通知列表
   */
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

  /**
   * 按时间分组通知
   * 
   * @constant groupedNotifications
   * @description 将过滤后的通知按时间分组
   */
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

  /**
   * 渲染通知卡片
   * 
   * @function renderNotification
   * @param {Notification} notification - 通知对象
   * @returns {JSX.Element} 通知卡片组件
   * 
   * @description
   * 根据通知状态渲染不同样式的通知卡片
   */
  const renderNotification = (notification: Notification) => {
    const Icon = notification.icon
    
    return (
      <div 
        key={notification.id}
        className={`flex items-start gap-4 bg-white p-4 rounded-xl border-gray-100 hover:shadow-sm transition ${notification.unread ? 'border-l-4 border-xf-primary' : ''}`}
        onClick={() => notification.unread && handleMarkAsRead(notification.id)}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800">
            <span className="font-medium">{notification.user}</span> {notification.title}
            {notification.message && (
              <span className="text-xf-primary"> {notification.message}</span>
            )}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="text-gray-400">{notification.time}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className={notification.unread ? 'text-xf-primary' : 'text-gray-400'}>
              {notification.unread ? '未读' : '已读'}
            </span>
          </div>
        </div>
        <button className="hover:bg-gray-100 p-1 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-8 pt-8 pb-20">
      {/* 头部：标题 + 操作 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-serif text-xf-dark font-medium flex items-center gap-2">
          <Bell className="w-6 h-6 text-xf-primary" />
          消息通知
        </h1>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition flex items-center gap-1"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="w-4 h-4" />
            全部已读
          </button>
          <button className="p-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="flex gap-1 mb-8 border-b border-gray-200 pb-1">
        <span 
          className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'all' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => handleFilterClick('all')}
        >
          全部
        </span>
        <span 
          className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'unread' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => handleFilterClick('unread')}
        >
          未读
        </span>
        <span 
          className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'mentions' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => handleFilterClick('mentions')}
        >
          提及
        </span>
        <span 
          className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${activeFilter === 'system' ? 'bg-xf-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => handleFilterClick('system')}
        >
          系统
        </span>
      </div>

      {/* 通知列表 */}
      <div className="space-y-6">
        {groupedNotifications.map(group => (
          <div key={group.id}>
            <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <group.icon className="w-4 h-4" />
              {group.title}
            </h2>
            <div className="space-y-2">
              {group.notifications.map(renderNotification)}
            </div>
          </div>
        ))}

        {/* 空状态 */}
        {groupedNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">暂无通知</p>
            <p className="text-gray-400 text-sm">当有新消息时，会显示在这里</p>
          </div>
        )}

        {/* 加载更多 */}
        {groupedNotifications.length > 0 && (
          <div className="flex justify-center pt-4">
            <button 
              className="text-sm text-gray-400 hover:text-xf-primary transition flex items-center gap-1"
              onClick={handleLoadMore}
            >
              <Loader className="w-4 h-4" />
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
