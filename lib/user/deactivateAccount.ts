'use server'

import { createClient } from '@/lib/supabase/server'
import { clearSupabaseSessionCookies } from '@/lib/auth/clearSupabaseSessionCookies'
import { getCurrentUser } from '@/lib/auth/server'
import { LOGIN_MESSAGES, COMMON_ERRORS } from '@/lib/messages'
import type { DeactivateAccountResult } from '@/types'

/**
 * 停用用户账户

 */
export async function deactivateAccount(): Promise<DeactivateAccountResult> {
  try {
    const supabase = await createClient()

    {/* 获取当前用户 - 使用统一认证入口 */}
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
    }

    const userId = user.id

    {/* 更新 profiles 表，标记为停用 */}
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ account_status: 'suspended' })
      .eq('id', userId)

    if (updateError) {
      console.error('停用账户失败:', updateError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    await supabase.auth.signOut({ scope: 'global' })
    await clearSupabaseSessionCookies()

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

 */
export async function activateAccount(userId: string): Promise<DeactivateAccountResult> {
  try {
    const supabase = await createClient()

    {/* 更新 profiles 表，标记为激活 */}
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ account_status: 'active' })
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

 */
export async function checkAccountStatus(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('account_status')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return true
    }

    return data.account_status === 'active'
  } catch {
    return true
  }
}
