'use client'

import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'
import { ToggleSwitch } from '../ToggleSwitch'
import { updateNotificationSettings } from '@/app/(user)/settings/actions'

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
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-22
 */

export function NotificationsSection() {
  return (
    <SettingsSection id="settings-notifications-section" title="通知设置">
      <div className="space-y-8">
        <SettingItem
          label="邮件通知"
          description="接收邮件通知"
          control={
            <ToggleSwitch 
              checked={true} 
              settingKey="email"
              onServerAction={updateNotificationSettings}
            />
          }
        />

        <SettingItem
          label="新关注者通知"
          description="当有人关注你时通知"
          control={
            <ToggleSwitch 
              checked={true} 
              settingKey="newFollowers"
              onServerAction={updateNotificationSettings}
            />
          }
        />

        <SettingItem
          label="评论和回复"
          description="当有人评论或回复你的内容时通知"
          control={
            <ToggleSwitch 
              checked={true} 
              settingKey="comments"
              onServerAction={updateNotificationSettings}
            />
          }
        />

        <SettingItem
          label="点赞和收藏"
          description="当有人喜欢或收藏你的内容时通知"
          control={
            <ToggleSwitch 
              checked={true} 
              settingKey="likes"
              onServerAction={updateNotificationSettings}
            />
          }
        />
      </div>
    </SettingsSection>
  )
}
