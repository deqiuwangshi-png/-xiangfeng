'use server'

/**
 * 用户设置相关 Server Actions
 * @module lib/settings/actions
 * @description 集中处理所有用户设置相关的 Server Actions
 */

import { cache } from 'react'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  ContentSettingsResult,
  UpdateSettingInput,
  UpdateSettingResult,
  SettingCategory,
} from '@/types/settings'
import { LOGIN_MESSAGES, COMMON_ERRORS } from '@/lib/messages'
import type { UserStats } from '@/types'

/**
 * 设置更新数据验证模式
 */
const updateSettingSchema = z.object({
  category: z.enum(['privacy', 'notifications', 'appearance', 'content', 'advanced']),
  key: z.string(),
  value: z.any(),
})

/**
 * 允许的设置字段白名单
 * @安全增强 P2: 防止任意字段写入
 */
const ALLOWED_SETTING_KEYS: Record<string, string[]> = {
  privacy: ['profile_visible', 'show_email', 'allow_follow'],
  notifications: ['email_notify', 'push_notify', 'comment_notify'],
  appearance: ['theme', 'font_size', 'compact_mode'],
  content: ['language', 'default_sort', 'items_per_page'],
  advanced: ['auto_save', 'keyboard_shortcuts', 'beta_features'],
}

/**
 * 验证设置 key 是否在白名单中
 * @param category - 设置分类
 * @param key - 设置键名
 * @returns 是否合法
 */
function isValidSettingKey(category: string, key: string): boolean {
  const allowedKeys = ALLOWED_SETTING_KEYS[category]
  if (!allowedKeys) return false
  return allowedKeys.includes(key)
}

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
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
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
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return {
      success: true,
      content_language: data?.content_language || 'zh-CN',
    }
  } catch (err) {
    console.error('获取内容设置时出错:', err)
    return { success: false, error: COMMON_ERRORS.DEFAULT }
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
    return { success: false, error: COMMON_ERRORS.INVALID_PARAMS }
  }

  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
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
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return {
      success: true,
      content_language: language,
    }
  } catch (err) {
    console.error('更新内容语言时出错:', err)
    return { success: false, error: COMMON_ERRORS.DEFAULT }
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

    /**
     * @安全增强 P2: 白名单校验
     * - 防止通过构造恶意 key 写入任意字段
     * - 只允许预定义的设置项
     */
    if (!isValidSettingKey(settingData.category, settingData.key)) {
      return {
        success: false,
        error: '无效的设置项',
      }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: '用户未登录',
      }
    }

    // 构建更新数据对象
    const updateData: Record<string, unknown> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }

    // 根据分类和key构建字段名（已通过白名单校验，安全）
    const fieldName = `${settingData.category}_${settingData.key}`
    updateData[fieldName] = settingData.value

    // 使用upsert更新或创建设置记录
    const { error } = await supabase
      .from('user_settings')
      .upsert(updateData, {
        onConflict: 'user_id',
      })

    if (error) {
      console.error('更新设置失败:', error)
      return {
        success: false,
        error: '保存失败，请稍后重试',
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

// UserStats 类型从 @/types 导入，保持类型统一
// 如需修改，请更新 types/user.ts 文件

/**
 * 获取用户统计数据（缓存版本）
 * @returns 用户统计数据
 * @性能优化 P1: 使用 profiles 表缓存字段，单次查询获取所有统计
 * @缓存策略 同一请求内多次调用会复用缓存结果
 * @说明 所有统计字段由数据库触发器自动维护
 * @依赖 SQL: 20260323_add_profile_stats_cache.sql
 */
export const getUserStats = cache(async (): Promise<{ success: boolean; data?: UserStats; error?: string }> => {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    /**
     * 使用 profiles 表缓存字段获取所有统计
     * @性能优化 单次查询替代多次并行查询，减少数据库往返
     * @说明 articles_count, followers_count, total_likes, nodes_count
     *       均由数据库触发器自动维护
     */
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('articles_count, followers_count, total_likes, nodes_count')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('获取用户统计失败:', JSON.stringify(profileError))
      return { success: false, error: '获取统计数据失败' }
    }

    return {
      success: true,
      data: {
        articles: profile?.articles_count || 0,
        followers: profile?.followers_count || 0,
        likes: profile?.total_likes || 0,
        nodes: profile?.nodes_count || 0,
      },
    }
  } catch (err) {
    console.error('获取用户统计数据失败:', err instanceof Error ? err.message : JSON.stringify(err))
    return { success: false, error: '获取统计数据失败' }
  }
})
