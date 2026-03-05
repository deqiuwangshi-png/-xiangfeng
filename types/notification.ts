import { Heart, MessageCircle, UserPlus, Bell, AtSign, Award } from 'lucide-react'

/**
 * 通知类型
 * @description 与数据库 notifications.type 对齐
 * - like: 点赞文章
 * - comment: 评论文章
 * - reply: 回复评论
 */
export type NotificationType = 'like' | 'comment' | 'reply'

/**
 * 筛选类型
 * @description 消息页面筛选标签类型
 */
export type FilterType = 'all' | 'unread' | 'mention' | 'system'

/**
 * 通知数据接口
 * @interface NotificationData
 * @property {string} id - 通知唯一标识
 * @property {NotificationType} type - 通知类型
 * @property {string} title - 通知标题
 * @property {string} message - 通知消息内容
 * @property {string} user - 触发通知的用户名
 * @property {string} time - 时间显示文本
 * @property {boolean} unread - 是否未读
 */
export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  user: string
  time: string
  unread: boolean
}

/**
 * 带图标的通知数据接口
 * @interface NotificationWithIcon
 * @extends NotificationData
 * @property {React.ElementType} icon - Lucide 图标组件
 */
export interface NotificationWithIcon extends NotificationData {
  icon: React.ElementType
}

/**
 * 通知分组接口
 * @interface NotificationGroup
 * @property {string} id - 分组唯一标识
 * @property {string} title - 分组标题
 * @property {React.ElementType} icon - 分组图标
 * @property {NotificationWithIcon[]} notifications - 该分组下的通知列表
 */
export interface NotificationGroup {
  id: string
  title: string
  icon: React.ElementType
  notifications: NotificationWithIcon[]
}

/**
 * 图标映射表
 * @description 将通知类型映射到对应的 Lucide 图标
 */
export const notificationIconMap: Record<NotificationType, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  reply: AtSign,
}

/**
 * 通知类型显示名称映射
 * @description 用于UI显示的类型名称
 */
export const notificationTypeLabels: Record<NotificationType, string> = {
  like: '点赞',
  comment: '评论',
  reply: '回复',
}
