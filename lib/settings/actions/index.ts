/**
 * 设置模块统一导出
 * @module lib/settings/actions
 * @description 集中导出所有设置相关的 Server Actions
 *
 * @示例
 * ```typescript
 * import { getContentSettings, updatePrivacySettings } from '@/lib/settings/actions'
 * ```
 */

// 内容设置
export {
  getContentSettings,
  updateContentLanguage,
  updateContentSettings,
} from './content'
export type { ContentSettingsResult } from '@/types/user/settings'

// 隐私设置
export {
  getPrivacySettings,
  updatePrivacySettings,
} from './privacy'
export type { PrivacySettingsResult } from './privacy'

// 通知设置
export {
  getNotificationSettings,
  updateNotificationSettings,
} from './notifications'
export type { NotificationSettingsResult } from './notifications'

// 外观设置
export {
  getAppearanceSettings,
  updateAppearanceSettings,
} from './appearance'
export type { AppearanceSettingsResult } from './appearance'

// 工具（兼容旧名：设置模块历史导入）
export { withAuthSession as withAuth, verifyAuthSession as verifyAuth } from '@/lib/auth/server'
export type { AuthSessionResult as AuthResult, AuthSessionCallback as AuthCallback } from '@/types/auth/auth'

// 常量
export {
  NOTIFICATION_FIELD_MAP,
  APPEARANCE_FIELD_MAP,
  PRIVACY_FIELD_MAP,
  CONTENT_FIELD_MAP,
} from '../constants/field-maps'
