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
 * @性能优化 P1: 使用并行查询 + React cache，减少LCP时间
 * @缓存策略 同一请求内多次调用会复用缓存结果
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
     * 并行执行所有统计查询
     * @性能优化 将4个串行查询改为并行，理论性能提升约4倍
     */
    const [
      articlesResult,
      followersResult,
      likesResult,
      nodesResult,
    ] = await Promise.all([
      // 获取文章数量
      supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)
        .eq('status', 'published'),

      // 获取关注者数量
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id),

      // 获取获赞总数
      supabase
        .from('articles')
        .select('like_count')
        .eq('author_id', user.id)
        .eq('status', 'published'),

      // 获取节点数量（用户加入的社群/节点）
      supabase
        .from('user_nodes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])

    // 处理错误 - 使用JSON.stringify确保错误对象正确输出
    if (articlesResult.error) {
      console.error('获取文章数量失败:', JSON.stringify(articlesResult.error))
    }
    if (followersResult.error) {
      console.error('获取关注者数量失败:', JSON.stringify(followersResult.error))
    }
    if (likesResult.error) {
      console.error('获取获赞数失败:', JSON.stringify(likesResult.error))
    }
    if (nodesResult.error) {
      console.error('获取节点数量失败:', JSON.stringify(nodesResult.error))
    }

    // 计算获赞总数
    const totalLikes = likesResult.data?.reduce(
      (sum, article) => sum + (article.like_count || 0),
      0
    ) || 0

    return {
      success: true,
      data: {
        articles: articlesResult.count || 0,
        followers: followersResult.count || 0,
        likes: totalLikes,
        nodes: nodesResult.count || 0,
      },
    }
  } catch (err) {
    console.error('获取用户统计数据失败:', err instanceof Error ? err.message : JSON.stringify(err))
    return { success: false, error: '获取统计数据失败' }
  }
})
