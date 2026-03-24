'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { UpdateProfileParams, UpdateProfileResult } from '@/types/settings'

/**
 * 将字符串转换为 PostgreSQL 数组格式
 *
 * @function stringToPostgresArray
 * @param {string} str - 输入字符串，多个值用逗号分隔
 * @returns {string} PostgreSQL 数组格式字符串，如 {前端, 后端}
 *
 * @description
 * 将用户输入的逗号分隔字符串转换为 PostgreSQL 数组文本格式
 * 例如："前端, 后端" -> "{前端, 后端}"
 */
function stringToPostgresArray(str: string | undefined): string | null {
  if (!str || str.trim() === '') return null
  // 分割逗号分隔的值，去除空白，过滤空值
  const values = str
    .split(/[,，]/) // 支持中英文逗号
    .map(v => v.trim())
    .filter(v => v.length > 0)
  if (values.length === 0) return null
  // 转换为 PostgreSQL 数组格式: {value1, value2}
  return `{${values.join(', ')}}`
}

/**
 * 更新用户资料 Server Action
 *
 * @param params - 要更新的资料字段
 * @returns 更新结果
 *
 * @description
 * 同时更新 profiles 表和 user_metadata，确保数据一致性：
 * 1. 更新 profiles 表（应用主要数据源）
 * 2. 更新 user_metadata（Supabase Auth 用户元数据）
 * 3. 刷新相关页面缓存
 */
export async function updateProfile(params: UpdateProfileParams): Promise<UpdateProfileResult> {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    const userId = user.id
    const now = new Date().toISOString()

    // 将 domain 字符串转换为 PostgreSQL 数组格式
    const domainArray = stringToPostgresArray(params.domain)

    // 1. 更新 profiles 表
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username: params.username,
        bio: params.bio,
        location: params.location,
        avatar_url: params.avatar_url,
        domain: domainArray,
        updated_at: now,
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('更新 profiles 表失败:', profileError)
      return { success: false, error: '保存资料失败，请稍后重试' }
    }

    // 2. 更新 user_metadata（用于 Sidebar 等组件）
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        username: params.username,
        bio: params.bio,
        location: params.location,
        avatar_url: params.avatar_url,
        domain: params.domain,
      }
    })

    if (metadataError) {
      console.error('更新 user_metadata 失败:', metadataError)
      // 不影响主流程，因为 profiles 表已更新成功
    }

    // 3. 刷新相关页面缓存
    revalidatePath('/profile')
    revalidatePath('/settings')
    revalidatePath('/home')

    return {
      success: true,
      data: {
        username: params.username || '',
        bio: params.bio || '',
        location: params.location || '',
        avatar_url: params.avatar_url || '',
        domain: params.domain || '',
      }
    }

  } catch (error) {
    console.error('更新用户资料时出错:', error)
    return { success: false, error: '保存失败，请稍后重试' }
  }
}
