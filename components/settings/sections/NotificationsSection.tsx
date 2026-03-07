'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { ToggleSwitch } from '../_ui/ToggleSwitch'
import { updateNotificationSettings } from '@/lib/settings/actions'
import { NotificationSettingConfig } from '@/types/settings'

/**
 * 通知设置配置列表
 * @description 与消息页面 NotificationType 对齐
 * @see components/inbox/InboxClient.tsx
 */
const notificationSettings: NotificationSettingConfig[] = [
  {
    label: '邮件通知',
    description: '接收邮件通知',
    settingKey: 'email',
    defaultChecked: true,
  },
  {
    label: '新关注者通知',
    description: '当有人关注你时通知',
    settingKey: 'newFollowers',
    defaultChecked: true,
  },
  {
    label: '评论',
    description: '当有人评论你的内容时通知',
    settingKey: 'comments',
    defaultChecked: true,
  },
  {
    label: '点赞',
    description: '当有人喜欢你的内容时通知',
    settingKey: 'likes',
    defaultChecked: true,
  },
  {
    label: '提及',
    description: '当有人在内容中提及你时通知',
    settingKey: 'mentions',
    defaultChecked: true,
  },
  {
    label: '系统通知',
    description: '接收平台系统通知',
    settingKey: 'system',
    defaultChecked: true,
  },
  {
    label: '成就',
    description: '当获得新成就时通知',
    settingKey: 'achievements',
    defaultChecked: true,
  },
]

/**
 * 通知设置区块（Client Component）
 * 
 * 作用: 显示通知设置相关选项
 * 
 * @returns {JSX.Element} 通知设置区块
 * 
 * 使用说明:
 *   显示通知设置选项
 *   处理通知设置交互
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 *   - 数据驱动渲染，配置与视图分离
 * 更新时间: 2026-02-22
 */
export function NotificationsSection() {
  return (
    <SettingsSection id="settings-notifications-section" title="通知设置">
      <div className="space-y-8">
        {notificationSettings.map((setting) => (
          <SettingItem
            key={setting.settingKey}
            label={setting.label}
            description={setting.description}
            control={
              <ToggleSwitch
                checked={setting.defaultChecked}
                settingKey={setting.settingKey}
                onServerAction={updateNotificationSettings}
              />
            }
          />
        ))}
      </div>
    </SettingsSection>
  )
}
