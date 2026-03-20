'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAllowedEmail } from '@/lib/auth/utils'
import type { UpdateEmailResult } from '@/types'

export type { UpdateEmailResult } from '@/types'

/**
 * 发起邮箱更换请求
 * 
 * @param newEmail - 新邮箱地址
 * @returns 更新结果
 * 
 * @description
 * 使用 Supabase Auth 的默认邮件验证流程：
 * 1. 检查新邮箱是否已被使用
 * 2. 调用 updateUser({ email: newEmail }) 触发验证邮件
 * 3. Supabase 自动发送确认邮件到新邮箱
 * 4. 用户需要点击邮件中的链接确认
 * 5. 确认后邮箱更换生效，需要重新登录
 */
export async function initiateEmailChange(newEmail: string): Promise<UpdateEmailResult> {
  try {
    const supabase = await createClient()
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    // 检查新邮箱是否与当前邮箱相同
    if (user.email === newEmail) {
      return { success: false, error: '新邮箱不能与当前邮箱相同' }
    }

    // 验证邮箱域名白名单
    if (!isAllowedEmail(newEmail)) {
      return { success: false, error: '暂不支持该邮箱，请使用 QQ邮箱(@qq.com)、Gmail(@gmail.com) 或 139邮箱(@139.com)' }
    }

    // 检查新邮箱是否已被其他用户使用
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', newEmail)
      .maybeSingle()

    if (checkError) {
      console.error('检查邮箱占用状态失败:', checkError)
      return { success: false, error: '暂时无法验证邮箱可用性，请稍后重试' }
    }

    if (existingUser) {
      return { success: false, error: '该邮箱已被其他账号使用' }
    }

    // 调用 Supabase Auth 更新邮箱（会触发确认邮件）
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    }, {
      // 邮件确认后需要重新登录
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    })

    if (updateError) {
      console.error('更新邮箱失败:', updateError)
      return { success: false, error: updateError.message }
    }

    // 刷新相关页面缓存
    revalidatePath('/settings')
    revalidatePath('/home')

    return {
      success: true,
      needsConfirmation: true,
      message: '验证邮件已发送至新邮箱，请查收并点击确认链接完成更换'
    }

  } catch (error) {
    console.error('更换邮箱时出错:', error)
    return { success: false, error: '更换邮箱失败，请稍后重试' }
  }
}

/**
 * 确认邮箱更换（用户点击邮件链接后）
 * 
 * @description
 * 当用户点击邮件中的确认链接后，Supabase 会自动处理验证。
 * 这个方法用于检查当前用户的邮箱是否已更新。
 */
export async function checkEmailUpdateStatus(): Promise<{
  success: boolean
  email?: string
  hasChanged?: boolean
}> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { success: false }
    }

    return {
      success: true,
      email: user.email,
    }

  } catch (error) {
    console.error('检查邮箱状态时出错:', error)
    return { success: false }
  }
}
