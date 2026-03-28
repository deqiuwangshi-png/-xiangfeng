'use server'

/**
 * 通知设置相关 Server Actions
 * @module lib/settings/actions/notifications
 * @description 处理通知偏好设置
 */

import { revalidatePath } from 'next/cache'
import { withAuth } from '../utils/auth'
import { NOTIFICATION_FIELD_MAP } from '../constants/field-maps'
import { COMMON_ERRORS } from '@/lib/messages'
import type { UpdateSettingResult } from '@/types/settings'

/**
 * 通知设置结果类型
 */
export interface NotificationSettingsResult {
  success: boolean
  settings?: Record<string, boolean>
  error?: string
}

/**
 * 获取通知设置
 * @returns 通知设置结果
 */
export async function getNotificationSettings(): Promise<NotificationSettingsResult> {
  return withAuth(async (user, supabase) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('email_notifications, notify_new_follower, notify_comment, notify_like, notify_mention, notify_system, notify_achievement')
      .eq('user_id', user.id)
      .single()

    if (error) {
      // 如果没有记录，返回默认值
      if (error.code === 'PGRST116') {
        return {
          success: true,
          settings: {
            email: true,
            newFollowers: true,
            comments: true,
            likes: true,
            mentions: true,
            system: true,
            achievements: true,
          },
        }
      }
      console.error('获取通知设置失败:', error)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    // 映射数据库字段到前端格式
    const settings: Record<string, boolean> = {
      email: data?.email_notifications ?? true,
      newFollowers: data?.notify_new_follower ?? true,
      comments: data?.notify_comment ?? true,
      likes: data?.notify_like ?? true,
      mentions: data?.notify_mention ?? true,
      system: data?.notify_system ?? true,
      achievements: data?.notify_achievement ?? true,
    }

    return { success: true, settings }
  }) as Promise<NotificationSettingsResult>
}

/**
 * 更新通知设置
 * @param formData 表单数据
 * @returns 更新结果
 */
export async function updateNotificationSettings(formData: FormData): Promise<UpdateSettingResult> {
  const key = formData.get('key') as string
  const value = formData.get('value')

  if (!key || value === null) {
    return { success: false, error: '参数不完整' }
  }

  const dbField = NOTIFICATION_FIELD_MAP[key]
  if (!dbField) {
    return { success: false, error: '无效的通知设置项' }
  }

  const booleanValue = value === 'true'

  return withAuth(async (user, supabase) => {
    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          [dbField]: booleanValue,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('更新通知设置失败:', error)
      return { success: false, error: '保存失败，请稍后重试' }
    }

    revalidatePath('/settings')
    return { success: true, message: '设置更新成功' }
  }) as Promise<UpdateSettingResult>
}
