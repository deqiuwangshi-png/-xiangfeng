'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/server'
import { UpdateProfileParams, UpdateProfileResult } from '@/types/user/settings'
import { validateProfileInput } from '@/lib/security/inputValidator'
import { PROFILE_MESSAGES, COMMON_ERRORS } from '@/lib/messages'


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
/**
 * 更新用户资料 Server Action
 *
 * @param params - 要更新的资料字段
 * @returns 更新结果
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
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

    // 获取当前用户 - 使用统一认证入口
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: COMMON_ERRORS.UNKNOWN_ERROR }
    }

    /**
     * @安全增强 S-01: 输入验证与净化
     * - 使用 Zod Schema 验证所有输入字段
     * - 自动转义 HTML 特殊字符
     * - 过滤 XSS 攻击向量
     * - 拒绝包含危险代码的输入
     */
    const validation = validateProfileInput(params)
    if (!validation.success) {
      return {
        success: false,
        error: PROFILE_MESSAGES.UPDATE_ERROR,
      }
    }

    // 使用验证后的安全数据
    const safeParams = validation.data!
    const userId = user.id
    const now = new Date().toISOString()

    // 1. 更新 profiles 表（使用验证后的安全数据）- 关键路径，必须成功
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username: safeParams.username,
        bio: safeParams.bio,
        location: safeParams.location,
        avatar_url: safeParams.avatar_url,
        updated_at: now,
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('更新 profiles 表失败:', profileError)
      return { success: false, error: PROFILE_MESSAGES.UPDATE_ERROR }
    }

    // 2. 并行执行非关键操作（不阻塞主流程）
    // 这些操作失败不影响核心功能
    Promise.allSettled([
      // 更新 user_metadata（用于 Sidebar 等组件）
      supabase.auth.updateUser({
        data: {
          username: safeParams.username,
          bio: safeParams.bio,
          location: safeParams.location,
          avatar_url: safeParams.avatar_url,
        }
      }),
      // 刷新相关页面缓存
      Promise.resolve().then(() => {
        revalidatePath('/profile')
        revalidatePath('/settings')
        revalidatePath('/home')
      })
    ]).then((results) => {
      const [metadataResult] = results
      if (metadataResult.status === 'rejected') {
        console.error('更新 user_metadata 失败:', metadataResult.reason)
      }
    }).catch(console.error)

    return {
      success: true,
      data: {
        username: safeParams.username || '',
        bio: safeParams.bio || '',
        location: safeParams.location || '',
        avatar_url: safeParams.avatar_url || '',
      }
    }

  } catch (error) {
    console.error('更新用户资料时出错:', error)
    return { success: false, error: COMMON_ERRORS.UNKNOWN_ERROR }
  }
}
