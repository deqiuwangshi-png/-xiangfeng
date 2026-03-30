'use server'

/**
 * 隐私设置相关 Server Actions
 * @module lib/settings/actions/privacy
 * @description 处理隐私与安全设置
 *
 * @注意 隐私设置存储在 profiles 表，而非 user_settings 表
 * @更新 2026-03-28 移除私信功能相关代码
 */

import { revalidatePath } from 'next/cache'
import { withAuth } from '../utils/auth'
import { PRIVACY_FIELD_MAP } from '../constants/field-maps'
import { COMMON_ERRORS } from '@/lib/messages'
import type { UpdateSettingResult } from '@/types/user/settings'

/**
 * 隐私设置结果类型
 */
export interface PrivacySettingsResult {
  success: boolean
  settings?: {
    profileVisibility: string
  }
  error?: string
}

/**
 * 获取隐私设置
 * @description 从 profiles 表获取隐私设置
 * @returns 隐私设置结果
 */
export async function getPrivacySettings(): Promise<PrivacySettingsResult> {
  return withAuth(async (user, supabase) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('visibility')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('获取隐私设置失败:', error)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return {
      success: true,
      settings: {
        profileVisibility: data?.visibility || 'public',
      },
    }
  }) as Promise<PrivacySettingsResult>
}

/**
 * 更新隐私设置
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updatePrivacySettings(formData: FormData): Promise<UpdateSettingResult> {
  const key = formData.get('key') as string
  const value = formData.get('value') as string

  if (!key || value === null) {
    return { success: false, error: '参数不完整' }
  }

  const dbField = PRIVACY_FIELD_MAP[key]
  if (!dbField) {
    return { success: false, error: '无效的设置项' }
  }

  return withAuth(async (user, supabase) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [dbField]: value, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      console.error('更新隐私设置失败:', error)
      return { success: false, error: '保存失败，请稍后重试' }
    }

    revalidatePath('/settings')
    return { success: true, message: '设置更新成功' }
  }) as Promise<UpdateSettingResult>
}
