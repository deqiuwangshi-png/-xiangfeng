/**
 * 设置字段映射常量
 * @module lib/settings/constants/field-maps
 * @description 定义前端key与数据库字段名的映射关系
 *
 * @数据库说明
 * 基于 SQL: docs/sql文件/13用户设置表.sql
 * @更新 2026-03-28 将 theme_color 改为 theme_background
 */

/**
 * 通知设置字段映射
 * 前端key -> 数据库字段名
 */
export const NOTIFICATION_FIELD_MAP: Record<string, string> = {
  email: 'email_notifications',
  newFollowers: 'notify_new_follower',
  comments: 'notify_comment',
  likes: 'notify_like',
  mentions: 'notify_mention',
  system: 'notify_system',
  achievements: 'notify_achievement',
} as const

/**
 * 外观设置字段映射
 * 前端key -> 数据库字段名
 */
export const APPEARANCE_FIELD_MAP: Record<string, string> = {
  theme: 'theme_mode',
  theme_background: 'theme_background',
} as const

/**
 * 隐私设置字段映射
 * 前端key -> profiles表字段名
 */
export const PRIVACY_FIELD_MAP: Record<string, string> = {
  profile_visible: 'visibility',
} as const

/**
 * 内容设置字段映射
 * 前端key -> 数据库字段名
 */
export const CONTENT_FIELD_MAP: Record<string, string> = {
  language: 'content_language',
} as const
