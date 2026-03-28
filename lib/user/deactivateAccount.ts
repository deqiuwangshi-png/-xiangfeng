'use server'

import { createClient } from '@/lib/supabase/server'
import { LOGIN_MESSAGES, COMMON_ERRORS } from '@/lib/messages'
import type { DeactivateAccountResult } from '@/types'

export type { DeactivateAccountResult } from '@/types'

/**
 * 停用用户账户
 *
 * @returns 停用结果
 *
 * @description
 * 软删除用户账户：
 * 1. 将 profiles.is_active 设置为 false
 * 2. 退出登录
 * 3. 文章对外不可见（通过查询过滤）
 *
 * 数据保留：所有数据保留，仅标记为停用状态
 * 重新激活：用户重新登录时自动激活
 */
export async function deactivateAccount(): Promise<DeactivateAccountResult> {
  try {
    const supabase = await createClient()

    {/* 获取当前用户 */}
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
    }

    const userId = user.id

    {/* 更新 profiles 表，标记为停用 */}
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId)

    if (updateError) {
      console.error('停用账户失败:', updateError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    {/* 退出登录 */}
    await supabase.auth.signOut()

    return {
      success: true,
      message: '账户已停用，所有数据已保留。重新登录即可激活账户。',
    }
  } catch (error) {
    console.error('停用账户时出错:', error)
    return { success: false, error: COMMON_ERRORS.DEFAULT }
  }
}

/**
 * 激活用户账户（登录时调用）
 *
 * @param userId - 用户ID
 * @returns 激活结果
 *
 * @description
 * 用户重新登录时自动激活账户
 * 将 profiles.is_active 设置为 true
 */
export async function activateAccount(userId: string): Promise<DeactivateAccountResult> {
  try {
    const supabase = await createClient()

    {/* 更新 profiles 表，标记为激活 */}
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', userId)

    if (updateError) {
      console.error('激活账户失败:', updateError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    return {
      success: true,
      message: '账户已重新激活',
    }
  } catch (error) {
    console.error('激活账户时出错:', error)
    return { success: false, error: COMMON_ERRORS.DEFAULT }
  }
}

/**
 * 检查用户账户状态
 *
 * @param userId - 用户ID
 * @returns 是否激活
 *
 * @description
 * 检查用户账户是否处于激活状态
 */
export async function checkAccountStatus(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return true
    }

    return data.is_active !== false
  } catch {
    return true
  }
}
