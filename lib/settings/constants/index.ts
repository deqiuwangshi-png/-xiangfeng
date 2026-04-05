/**
 * 设置模块常量
 * @module lib/settings/constants
 * @description 设置页面相关的常量定义
 */

import type { UserSettings } from '@/types/user/settings'

/**
 * 默认用户设置
 * 当获取失败时作为降级方案
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  privacy: { profile_visibility: 'public' },
  notifications: {
    email: true,
    newFollowers: true,
    comments: true,
    likes: true,
    mentions: true,
    system: true,
    achievements: true,
  },
  appearance: { theme: 'auto', theme_background: 'default' },
  content: { content_language: 'zh-CN' },
}
