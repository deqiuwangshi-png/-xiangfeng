'use client'

/**
 * 通知设置区块（Client Component）
 *
 * @module components/settings/NotificationsSection
 * @description 显示通知设置相关选项，支持从服务端获取和保存设置
 * @version 2.0.0
 * @更新说明 使用统一的 useOptimisticMutation 进行乐观更新
 *
 * 性能优化:
 *   - 从 Context 获取服务端预取的数据，避免重复请求
 *   - 使用统一的乐观更新 Hook，自动处理回滚
 *   - 防止重复提交
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 *   - 数据通过 Context 从 Server Component 传递
 */

import {
  SettingsSection,
  SettingItem,
  ToggleSwitch,
  useSettings,
} from '@/components/settings'
import { useNotificationSettings } from '@/hooks/settings/useNotificationSettings'

/**
 * 通知设置项配置
 * @description 与消息页面 NotificationType 对齐
 * @see components/inbox/InboxClient.tsx
 */
const NOTIFICATION_CONFIG = [
  { key: 'email', label: '邮件通知', description: '接收邮件通知' },
  { key: 'newFollowers', label: '新关注者通知', description: '当有人关注你时通知' },
  { key: 'comments', label: '评论', description: '当有人评论你的内容时通知' },
  { key: 'likes', label: '点赞', description: '当有人喜欢你的内容时通知' },
  { key: 'mentions', label: '提及', description: '当有人在内容中提及你时通知' },
  { key: 'system', label: '系统通知', description: '接收平台系统通知' },
  { key: 'achievements', label: '成就', description: '当获得新成就时通知' },
] as const

/**
 * 通知设置区块
 *
 * @returns {JSX.Element} 通知设置区块
 */
export function NotificationsSection() {
  const { userSettings } = useSettings()

  // ==========================================
  // 使用统一的通知设置 Hook
  // ==========================================
  const { settings, isSaving, updateSetting } = useNotificationSettings({
    initialSettings: {
      email: userSettings.notifications.email,
      newFollowers: userSettings.notifications.newFollowers,
      comments: userSettings.notifications.comments,
      likes: userSettings.notifications.likes,
      mentions: userSettings.notifications.mentions,
      system: userSettings.notifications.system,
      achievements: userSettings.notifications.achievements,
    },
  })

  /**
   * 处理开关变化
   * 使用统一的乐观更新 Hook
   */
  const handleToggle = async (key: string, checked: boolean) => {
    await updateSetting(key as keyof typeof settings, checked)
  }

  return (
    <SettingsSection id="settings-notifications-section" title="通知设置">
      <div className="space-y-8">
        {NOTIFICATION_CONFIG.map((config) => (
          <SettingItem
            key={config.key}
            label={config.label}
            description={config.description}
            control={
              <ToggleSwitch
                checked={settings[config.key] ?? true}
                onChange={(checked) => handleToggle(config.key, checked)}
                disabled={isSaving}
              />
            }
          />
        ))}
      </div>
    </SettingsSection>
  )
}
