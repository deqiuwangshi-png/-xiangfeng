'use server'

/**
 * 外观设置相关 Server Actions
 * @module lib/settings/actions/appearance
 * @description 处理外观与主题设置
 * @更新 2026-03-28 将主题颜色改为使用 theme_background 字段
 */

import { revalidatePath } from 'next/cache'
import { withAuth } from '../utils/auth'
import { APPEARANCE_FIELD_MAP } from '../constants/field-maps'
import { COMMON_ERRORS } from '@/lib/messages'
import type { UpdateSettingResult } from '@/types/user/settings'

/**
 * 外观设置结果类型
 */
export interface AppearanceSettingsResult {
  success: boolean
  settings?: {
    theme: string
    theme_background: string
  }
  error?: string
}

/**
 * 获取外观设置
 * @returns 外观设置结果
 */
export async function getAppearanceSettings(): Promise<AppearanceSettingsResult> {
  return withAuth(async (user, supabase) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('theme_mode, theme_background')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, settings: { theme: 'auto', theme_background: 'default' } }
      }
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return {
      success: true,
      settings: {
        theme: data?.theme_mode || 'auto',
        theme_background: data?.theme_background || 'default',
      },
    }
  }) as Promise<AppearanceSettingsResult>
}

/**
 * 更新外观设置
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateAppearanceSettings(formData: FormData): Promise<UpdateSettingResult> {
  const key = formData.get('key') as string
  const value = formData.get('value')

  if (!key || value === null) {
    return { success: false, error: '参数不完整' }
  }

  const dbField = APPEARANCE_FIELD_MAP[key]
  if (!dbField) {
    return { success: false, error: '无效的外观设置项' }
  }

  return withAuth(async (user, supabase) => {
    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          [dbField]: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('更新外观设置失败:', error)
      return { success: false, error: '保存失败，请稍后重试' }
    }

    revalidatePath('/settings')
    return { success: true, message: '设置更新成功' }
  }) as Promise<UpdateSettingResult>
}
