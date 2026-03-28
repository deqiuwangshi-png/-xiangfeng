'use server'

/**
 * 登录历史服务
 * @module lib/auth/loginHistory
 * @description 处理登录历史的记录和查询
 */

import { createClient } from '@/lib/supabase/server'
import { LOGIN_HISTORY_MESSAGES } from '@/lib/messages'
import type { LoginHistoryItem, GetLoginHistoryResult } from '@/types'

export type { LoginHistoryItem, GetLoginHistoryResult } from '@/types'

/**
 * 获取用户登录历史
 *
 * @returns 登录历史列表
 *
 * @description
 * 查询当前用户的最近登录记录，按时间倒序排列
 */
export async function getLoginHistory(): Promise<GetLoginHistoryResult> {
  try {
    const supabase = await createClient()

    {/* 获取当前用户 */}
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: LOGIN_HISTORY_MESSAGES.NOT_AUTHENTICATED }
    }

    {/* 查询登录历史 */}
    const { data, error } = await supabase
      .from('login_history')
      .select('id, user_id, ip_address, login_type, device_type, browser, os, is_success, is_new_device, created_at')
      .eq('user_id', user.id)
      .eq('is_success', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('获取登录历史失败:', error)
      return { success: false, error: LOGIN_HISTORY_MESSAGES.FETCH_ERROR }
    }

    return {
      success: true,
      data: data as LoginHistoryItem[],
    }
  } catch (error) {
    console.error('获取登录历史出错:', error)
    return { success: false, error: LOGIN_HISTORY_MESSAGES.FETCH_ERROR }
  }
}

/**
 * 记录登录历史
 *
 * @param userId - 用户ID
 * @param loginType - 登录类型
 * @param isSuccess - 是否成功
 * @param isNewDevice - 是否新设备
 *
 * @description
 * 在用户登录成功后调用，记录登录信息
 */
export async function recordLoginHistory(
  userId: string,
  loginType: string,
  isSuccess: boolean,
  isNewDevice: boolean
): Promise<void> {
  try {
    const supabase = await createClient()

    await supabase
      .from('login_history')
      .insert({
        user_id: userId,
        login_type: loginType,
        is_success: isSuccess,
        is_new_device: isNewDevice,
      })
  } catch (error) {
    {/* 记录失败不影响登录流程 */}
    console.error('记录登录历史失败:', error)
  }
}
