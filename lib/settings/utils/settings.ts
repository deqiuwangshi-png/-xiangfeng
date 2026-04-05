/**
 * 设置数据处理工具
 * @module lib/settings/utils/settings
 * @description 设置数据的组装、转换和验证工具函数
 */

import type { UserSettings } from '@/types/user/settings'
import type {
  PrivacySettingsResult,
  NotificationSettingsResult,
  AppearanceSettingsResult,
  ContentSettingsResult,
} from '@/lib/settings/actions'
import { DEFAULT_USER_SETTINGS } from '@/lib/settings/constants'

/**
 * 设置数据组装结果
 */
export interface AssembledSettings {
  settings: UserSettings
  success: boolean
}

/**
 * 组装用户设置数据
 * 将各个设置项的查询结果合并为统一的 UserSettings 对象
 *
 * @param privacyResult - 隐私设置查询结果
 * @param notificationsResult - 通知设置查询结果
 * @param appearanceResult - 外观设置查询结果
 * @param contentResult - 内容设置查询结果
 * @returns 组装后的设置数据和成功状态
 */
export function assembleUserSettings(
  privacyResult: PrivacySettingsResult,
  notificationsResult: NotificationSettingsResult,
  appearanceResult: AppearanceSettingsResult,
  contentResult: ContentSettingsResult
): AssembledSettings {
  try {
    const settings: UserSettings = {
      privacy: privacyResult.success && privacyResult.settings
        ? { profile_visibility: privacyResult.settings.profileVisibility }
        : DEFAULT_USER_SETTINGS.privacy,
      notifications: notificationsResult.success && notificationsResult.settings
        ? {
            email: notificationsResult.settings.email ?? true,
            newFollowers: notificationsResult.settings.newFollowers ?? true,
            comments: notificationsResult.settings.comments ?? true,
            likes: notificationsResult.settings.likes ?? true,
            mentions: notificationsResult.settings.mentions ?? true,
            system: notificationsResult.settings.system ?? true,
            achievements: notificationsResult.settings.achievements ?? true,
          }
        : DEFAULT_USER_SETTINGS.notifications,
      appearance: appearanceResult.success && appearanceResult.settings
        ? {
            theme: appearanceResult.settings.theme,
            theme_background: appearanceResult.settings.theme_background,
          }
        : DEFAULT_USER_SETTINGS.appearance,
      content: contentResult.success && contentResult.content_language
        ? { content_language: contentResult.content_language }
        : DEFAULT_USER_SETTINGS.content,
    }

    return { settings, success: true }
  } catch (err) {
    console.error('组装用户设置数据失败:', err)
    return { settings: DEFAULT_USER_SETTINGS, success: false }
  }
}

/**
 * 构建用户显示数据
 * 将用户资料和认证信息合并为前端组件需要的格式
 *
 * @param userId - 用户ID
 * @param email - 用户邮箱
 * @param profile - 用户资料数据（可能为 null）
 * @returns 前端组件使用的用户数据对象
 */
export function buildUserData(
  userId: string,
  email: string | undefined,
  profile: { username?: string | null; avatar_url?: string | null; bio?: string | null; location?: string | null } | null
) {
  return {
    id: userId,
    email: email || '',
    username: profile?.username || email?.split('@')[0] || '用户',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
  }
}
