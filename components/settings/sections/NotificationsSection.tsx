'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { ToggleSwitch } from '../_ui/ToggleSwitch'
import { updateNotificationSettings, getNotificationSettings } from '@/lib/settings/actions'
import { useState, useEffect, useCallback } from 'react'
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
 *   - 组件挂载时从服务端获取真实设置
 *   - 本地状态优先响应，异步保存到服务端
 *   - 保存失败时回滚状态
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据获取和修改
 *   - 数据驱动渲染，配置与视图分离
 * 更新时间: 2026-03-27
 */

export function NotificationsSection() {
  // 使用对象存储所有通知设置状态
  const [settings, setSettings] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 组件挂载时从服务端获取通知设置
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const result = await getNotificationSettings()

        if (result.success && result.settings) {
          setSettings(result.settings)
        } else {
          // 使用默认设置
          const defaults: Record<string, boolean> = {}
          NOTIFICATION_CONFIG.forEach((config) => {
            defaults[config.key] = true
          })
          setSettings(defaults)
        }
      } catch {
        setError('加载通知设置失败')
        // 使用默认设置
        const defaults: Record<string, boolean> = {}
        NOTIFICATION_CONFIG.forEach((config) => {
          defaults[config.key] = true
        })
        setSettings(defaults)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

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

  if (isLoading) {
    return (
      <SettingsSection id="settings-notifications-section" title="通知设置">
        <div className="space-y-8">
          {NOTIFICATION_CONFIG.map((config) => (
            <div key={config.key} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </SettingsSection>
    )
  }

  return (
    <SettingsSection id="settings-notifications-section" title="通知设置">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
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
