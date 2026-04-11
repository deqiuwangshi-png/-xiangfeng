'use server'

/**
 * 内容设置相关 Server Actions
 * @module lib/settings/actions/content
 * @description 处理内容偏好设置（语言等）
 */

import { revalidatePath } from 'next/cache'
import { withAuthSession } from '@/lib/auth/server'
import { CONTENT_FIELD_MAP } from '../constants/field-maps'
import { COMMON_ERRORS } from '@/lib/messages'
import type { ContentSettingsResult, UpdateSettingResult } from '@/types/user/settings'

/**
 * 获取用户内容设置
 * @returns 内容设置结果
 */
export async function getContentSettings(): Promise<ContentSettingsResult> {
  return withAuthSession(async (user, supabase) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('content_language')
      .eq('user_id', user.id)
      .single()

    if (error) {
      // 如果没有记录，返回默认值
      if (error.code === 'PGRST116') {
        return { success: true, content_language: 'zh-CN' }
      }
      console.error('获取内容设置失败:', error)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return {
      success: true,
      content_language: data?.content_language || 'zh-CN',
    }
  }) as Promise<ContentSettingsResult>
}

/**
 * 更新内容语言设置
 * @param language 语言代码
 * @returns 更新结果
 */
export async function updateContentLanguage(
  language: string
): Promise<ContentSettingsResult> {
  // 验证语言代码
  const validLanguages = ['zh-CN', 'zh-TW', 'en', 'ja']
  if (!validLanguages.includes(language)) {
    return { success: false, error: COMMON_ERRORS.INVALID_PARAMS }
  }

  return withAuthSession(async (user, supabase) => {
    const { error } = await supabase.from('user_settings').upsert(
      {
        user_id: user.id,
        content_language: language,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

    if (error) {
      console.error('更新内容语言失败:', error)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return { success: true, content_language: language }
  }) as Promise<ContentSettingsResult>
}

/**
 * 更新内容设置（通用接口）
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateContentSettings(formData: FormData): Promise<UpdateSettingResult> {
  const key = formData.get('key') as string
  const value = formData.get('value')

  if (!key || value === null) {
    return { success: false, error: '参数不完整' }
  }

  const dbField = CONTENT_FIELD_MAP[key]
  if (!dbField) {
    return { success: false, error: '无效的内容设置项' }
  }

  return withAuthSession(async (user, supabase) => {
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
      console.error('更新内容设置失败:', error)
      return { success: false, error: '保存失败，请稍后重试' }
    }

    revalidatePath('/settings')
    return { success: true, message: '设置更新成功' }
  }) as Promise<UpdateSettingResult>
}
