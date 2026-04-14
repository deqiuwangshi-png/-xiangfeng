/**
 * 通知设置 Hook
 * @module hooks/settings/useNotificationSettings
 * @description 提供通知设置的统一封装，使用乐观更新
 *
 * @特性
 * - 统一的乐观更新机制
 * - 自动错误处理和回滚
 * - 支持批量更新
 * - 防止重复提交
 */

'use client'

import { useCallback, useState } from 'react'
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation'
import { NOTIFICATIONS } from '@/lib/cache/keys'
import { updateNotificationSettings } from '@/lib/settings/actions/notifications'

/**
 * 通知设置数据结构
 */
export interface NotificationSettings {
  email: boolean
  newFollowers: boolean
  comments: boolean
  likes: boolean
  mentions: boolean
  system: boolean
  achievements: boolean
}

/**
 * 通知设置更新参数
 */
interface UpdateNotificationParams {
  key: keyof NotificationSettings
  value: boolean
}

/**
 * useNotificationSettings Hook 参数
 */
interface UseNotificationSettingsOptions {
  /** 初始设置 */
  initialSettings: NotificationSettings
}

/**
 * useNotificationSettings Hook 返回值
 */
interface UseNotificationSettingsReturn {
  /** 当前设置 */
  settings: NotificationSettings
  /** 是否正在保存 */
  isSaving: boolean
  /** 更新单个设置 */
  updateSetting: (key: keyof NotificationSettings, value: boolean) => Promise<void>
  /** 批量更新设置 */
  updateSettings: (updates: Partial<NotificationSettings>) => Promise<void>
}

/**
 * 通知设置 Hook
 * 
 * @param options - 配置选项
 * @returns 通知设置方法
 * 
 * @example
 * ```typescript
 * const { settings, isSaving, updateSetting } = useNotificationSettings({
 *   initialSettings: {
 *     email: true,
 *     newFollowers: true,
 *     // ...
 *   }
 * })
 * 
 * // 更新单个设置
 * await updateSetting('email', false)
 * ```
 */
export function useNotificationSettings({
  initialSettings,
}: UseNotificationSettingsOptions): UseNotificationSettingsReturn {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings)

  const {
    mutate,
    isMutating: isSaving,
  } = useOptimisticMutation<NotificationSettings, UpdateNotificationParams>({
    cacheKey: NOTIFICATIONS,
    mutationFn: async ({ key, value }) => {
      const formData = new FormData()
      formData.append('key', key)
      formData.append('value', String(value))

      const result = await updateNotificationSettings(formData)

      if (!result.success) {
        throw new Error(result.error || '保存失败')
      }

      return {
        ...settings,
        [key]: value,
      }
    },
    optimisticUpdater: (current, { key, value }) => {
      const baseSettings = current || initialSettings
      return {
        ...baseSettings,
        [key]: value,
      }
    },
    onSuccess: (data) => {
      setSettings(data)
    },
    errorMessage: '保存失败，请稍后重试',
  })

  /**
   * 更新单个设置
   */
  const updateSetting = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      await mutate({ key, value })
    },
    [mutate]
  )

  /**
   * 批量更新设置
   */
  const updateSettings = useCallback(
    async (updates: Partial<NotificationSettings>) => {
      for (const [key, value] of Object.entries(updates)) {
        await mutate({ key: key as keyof NotificationSettings, value })
      }
    },
    [mutate]
  )

  return {
    settings,
    isSaving,
    updateSetting,
    updateSettings,
  }
}

export default useNotificationSettings
