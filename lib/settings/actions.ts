'use server'

/**
 * 用户设置相关 Server Actions
 * @module lib/settings/actions
 * @description 处理用户内容偏好等设置
 */

import { createClient } from '@/lib/supabase/server'

/**
 * 内容设置结果接口
 */
export interface ContentSettingsResult {
  success: boolean
  content_language?: string
  error?: string
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
