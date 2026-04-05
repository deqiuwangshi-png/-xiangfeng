import { Heart, MessageCircle, AtSign, Star } from 'lucide-react'

/**
 * 通知类型
 * @description 与数据库 notifications.type 对齐
 * - article_liked: 文章被点赞
 * - comment_liked: 评论被点赞
 * - article_commented: 文章被评论
 * - comment_replied: 评论被回复
 * - article_favorited: 文章被收藏
 * - followed: 被关注
 * - mention: 被提及
 * - system: 系统通知
 * - announcement: 公告
 */
export type NotificationType =
  | 'article_liked'
  | 'comment_liked'
  | 'article_commented'
  | 'comment_replied'
  | 'article_favorited'
  | 'followed'
  | 'mention'
  | 'system'
  | 'announcement'

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
 * @property {string} [articleId] - 关联文章ID（用于跳转）
 * @property {string} [commentId] - 关联评论ID（用于跳转）
 * @property {string} [actorId] - 触发通知的用户ID
 */
export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  user: string
  time: string
  unread: boolean
  articleId?: string
  commentId?: string
  actorId?: string
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
  article_liked: Heart,
  comment_liked: Heart,
  article_commented: MessageCircle,
  comment_replied: AtSign,
  article_favorited: Star,
  followed: AtSign,
  mention: AtSign,
  system: MessageCircle,
  announcement: MessageCircle,
}

/**
 * 通知类型显示名称映射
 * @description 用于UI显示的类型名称
 */
export const notificationTypeLabels: Record<NotificationType, string> = {
  article_liked: '文章点赞',
  comment_liked: '评论点赞',
  article_commented: '文章评论',
  comment_replied: '回复',
  article_favorited: '收藏',
  followed: '关注',
  mention: '提及',
  system: '系统',
  announcement: '公告',
}
