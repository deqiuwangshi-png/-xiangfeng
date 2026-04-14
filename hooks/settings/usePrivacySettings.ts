/**
 * 隐私设置 Hook
 * @module hooks/settings/usePrivacySettings
 * @description 提供隐私设置的统一封装，使用乐观更新
 *
 * @特性
 * - 统一的乐观更新机制
 * - 自动错误处理和回滚
 * - 支持多个隐私选项
 */

'use client'

import { useCallback, useState } from 'react'
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation'
import { PRIVACY } from '@/lib/cache/keys'
import { updatePrivacySettings } from '@/lib/settings/actions/privacy'
import type { PrivacyVisibility } from '@/types'

/**
 * 隐私设置数据结构
 */
export interface PrivacySettings {
  profile_visibility: PrivacyVisibility
}

/**
 * 隐私设置更新参数
 */
interface UpdatePrivacyParams {
  key: string
  value: string
}

/**
 * usePrivacySettings Hook 参数
 */
interface UsePrivacySettingsOptions {
  /** 初始隐私设置 */
  initialSettings: PrivacySettings
}

/**
 * usePrivacySettings Hook 返回值
 */
interface UsePrivacySettingsReturn {
  /** 当前隐私设置 */
  settings: PrivacySettings
  /** 是否正在保存 */
  isSaving: boolean
  /** 更新隐私设置 */
  updatePrivacy: (key: string, value: string) => Promise<void>
  /** 更新个人资料可见性 */
  updateProfileVisibility: (visibility: PrivacyVisibility) => Promise<void>
}

/**
 * 隐私设置 Hook
 * 
 * @param options - 配置选项
 * @returns 隐私设置方法
 * 
 * @example
 * ```typescript
 * const { settings, isSaving, updateProfileVisibility } = usePrivacySettings({
 *   initialSettings: {
 *     profile_visibility: 'public',
 *   }
 * })
 * 
 * // 更新个人资料可见性
 * await updateProfileVisibility('private')
 * ```
 */
export function usePrivacySettings({
  initialSettings,
}: UsePrivacySettingsOptions): UsePrivacySettingsReturn {
  const [settings, setSettings] = useState<PrivacySettings>(initialSettings)

  const {
    mutate,
    isMutating: isSaving,
  } = useOptimisticMutation<PrivacySettings, UpdatePrivacyParams>({
    cacheKey: PRIVACY,
    mutationFn: async ({ key, value }) => {
      const formData = new FormData()
      formData.append('key', key)
      formData.append('value', value)

      const result = await updatePrivacySettings(formData)

      if (!result.success) {
        throw new Error(result.error || '保存失败')
      }

      return {
        ...settings,
        [key]: value as PrivacyVisibility,
      }
    },
    optimisticUpdater: (current, { key, value }) => {
      const baseSettings = current || initialSettings
      return {
        ...baseSettings,
        [key]: value as PrivacyVisibility,
      }
    },
    onSuccess: (data) => {
      setSettings(data)
    },
    errorMessage: '保存失败，请稍后重试',
  })

  /**
   * 更新隐私设置
   */
  const updatePrivacy = useCallback(
    async (key: string, value: string) => {
      await mutate({ key, value })
    },
    [mutate]
  )

  /**
   * 更新个人资料可见性
   */
  const updateProfileVisibility = useCallback(
    async (visibility: PrivacyVisibility) => {
      await mutate({ key: 'profile_visible', value: visibility })
    },
    [mutate]
  )

  return {
    settings,
    isSaving,
    updatePrivacy,
    updateProfileVisibility,
  }
}

export default usePrivacySettings
