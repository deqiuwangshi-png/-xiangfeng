'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { ToggleSwitch } from '../_ui/ToggleSwitch'
import { updateNotificationSettings } from '@/lib/settings/actions/notifications'
import { useSettings } from '../_layout/SettingsLayout'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'

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
 * 通知设置区块（Client Component）
 *
 * 作用: 显示通知设置相关选项，支持从服务端获取和保存设置
 *
 * @returns {JSX.Element} 通知设置区块
 *
 * 性能优化:
 *   - 从 Context 获取服务端预取的数据，避免重复请求
 *   - 本地状态优先响应，异步保存到服务端
 *   - 保存失败时回滚状态
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 *   - 数据通过 Context 从 Server Component 传递
 * 更新时间: 2026-03-28
 */

export function NotificationsSection() {
  const { userSettings } = useSettings()

  // 使用对象存储所有通知设置状态，从 Context 初始化
  const [settings, setSettings] = useState<Record<string, boolean>>({
    email: userSettings.notifications.email,
    newFollowers: userSettings.notifications.newFollowers,
    comments: userSettings.notifications.comments,
    likes: userSettings.notifications.likes,
    mentions: userSettings.notifications.mentions,
    system: userSettings.notifications.system,
    achievements: userSettings.notifications.achievements,
  })

  /**
   * 处理开关变化
   * @param key - 设置键
   * @param checked - 新状态
   */
  const handleToggle = useCallback(async (key: string, checked: boolean) => {
    // 乐观更新：先更新本地状态
    setSettings((prev) => ({ ...prev, [key]: checked }))

    try {
      const formData = new FormData()
      formData.append('key', key)
      formData.append('value', String(checked))

      const result = await updateNotificationSettings(formData)

      if (!result.success) {
        // 保存失败，回滚状态
        setSettings((prev) => ({ ...prev, [key]: !checked }))
        toast.error('保存失败: ' + (result.error || '未知错误'))
      }
    } catch {
      // 异常时回滚状态
      setSettings((prev) => ({ ...prev, [key]: !checked }))
      toast.error('保存失败，请稍后重试')
    }
  }, [])

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
              />
            }
          />
        ))}
      </div>
    </SettingsSection>
  )
}
