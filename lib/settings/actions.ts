'use server'

/**
 * 用户设置相关 Server Actions
 * @module lib/settings/actions
 * @description 集中处理所有用户设置相关的 Server Actions
 */

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  ContentSettingsResult,
  UpdateSettingInput,
  UpdateSettingResult,
  SettingCategory,
} from '@/types/settings'

/**
 * 设置更新数据验证模式
 */
const updateSettingSchema = z.object({
  category: z.enum(['privacy', 'notifications', 'appearance', 'content', 'advanced']),
  key: z.string(),
  value: z.any(),
})

/**
 * 获取用户内容设置
 * @returns 内容设置结果
 */
export async function getContentSettings(): Promise<ContentSettingsResult> {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    // 查询用户设置
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
      return { success: false, error: '获取设置失败' }
    }

    return {
      success: true,
      content_language: data?.content_language || 'zh-CN',
    }
  } catch (err) {
    console.error('获取内容设置时出错:', err)
    return { success: false, error: '获取设置失败，请稍后重试' }
  }
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
    return { success: false, error: '无效的语言代码' }
  }

  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    // 更新或插入设置记录
    const { error } = await supabase.from('user_settings').upsert(
      {
        user_id: user.id,
        content_language: language,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    )

    if (error) {
      console.error('更新内容语言失败:', error)
      return { success: false, error: '保存失败，请稍后重试' }
    }

    return {
      success: true,
      content_language: language,
    }
  } catch (err) {
    console.error('更新内容语言时出错:', err)
    return { success: false, error: '保存失败，请稍后重试' }
  }
}

/**
 * 更新设置 Server Action
 *
 * @param settingData 设置数据
 * @returns 更新结果
 */
export async function updateSetting(settingData: UpdateSettingInput): Promise<UpdateSettingResult> {
  try {
    // 仅做校验（schema.parse 会抛错），不需要单独使用结果
    updateSettingSchema.parse(settingData)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: '用户未登录',
      }
    }

    revalidatePath('/settings')

    return {
      success: true,
      message: '设置更新成功',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '数据验证失败',
        details: error.issues,
      }
    }

    console.error('更新设置失败:', error)
    return {
      success: false,
      error: '更新失败，请稍后重试',
    }
  }
}

/**
 * 创建通用设置更新函数
 *
 * @param category 设置分类
 * @returns 该分类的设置更新函数
 */
function createSettingUpdater(category: SettingCategory) {
  return async function (formData: FormData): Promise<UpdateSettingResult> {
    const key = formData.get('key') as string
    const value = formData.get('value')

    if (!key || value === null) {
      return {
        success: false,
        error: '参数不完整',
      }
    }

    const booleanValue = value === 'true'

    return updateSetting({
      category,
      key,
      value: booleanValue,
    })
  }
}

/**
 * 更新隐私设置
 *
 * @param formData 表单数据
 * @returns 更新结果
 */
export const updatePrivacySettings = createSettingUpdater('privacy')

/**
 * 更新通知设置
 *
 * @param formData 表单数据
 * @returns 更新结果
 */
export const updateNotificationSettings = createSettingUpdater('notifications')

/**
 * 更新外观设置
 *
 * @param formData 表单数据
 * @returns 更新结果
 */
export const updateAppearanceSettings = createSettingUpdater('appearance')

/**
 * 更新内容设置
 *
 * @param formData 表单数据
 * @returns 更新结果
 */
export const updateContentSettings = createSettingUpdater('content')

/**
 * 更新高级设置
 *
 * @param formData 表单数据
 * @returns 更新结果
 */
export const updateAdvancedSettings = createSettingUpdater('advanced')
