'use server'

/**
 * 修复用户头像一致性
 * @module lib/user/actions/fixAvatars
 * @description 修复现有用户的头像，确保使用 user.id 作为 seed
 *
 * 使用场景：
 * 1. 首次部署修复脚本时运行
 * 2. 数据迁移后统一修复头像
 * 3. 定期检查确保头像一致性
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAvtUrl } from '@/lib/utils/getAvtUrl'

/**
 * 修复单个用户的头像
 *
 * @param userId - 用户ID
 * @param avatarUrl - 新的头像URL
 * @returns 修复结果
 */
async function fixUserAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  try {
    // 1. 更新 profiles 表
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (profileError) {
      console.error(`更新用户 ${userId} 的 profiles 表失败:`, profileError)
      return { success: false, error: profileError.message }
    }

    // 2. 更新 user_metadata（需要 admin 权限）
    const adminClient = createAdminClient()
    const { error: metadataError } = await adminClient.auth.admin.updateUserById(
      userId,
      { user_metadata: { avatar_url: avatarUrl } }
    )

    if (metadataError) {
      console.error(`更新用户 ${userId} 的 user_metadata 失败:`, metadataError)
      // 不影响主流程，profiles 表已更新成功
    }

    return { success: true }
  } catch (error) {
    console.error(`修复用户 ${userId} 头像时出错:`, error)
    return { success: false, error: String(error) }
  }
}

/**
 * 修复所有用户的头像
 *
 * @description
 * 遍历所有用户，检查并修复头像：
 * 1. 如果头像为空，使用 user.id 生成新头像
 * 2. 如果头像 seed 不一致，更新为使用 user.id 的头像
 *
 * @returns 修复结果统计
 */
export async function fixAllUserAvatars(): Promise<{
  success: boolean
  total: number
  fixed: number
  failed: number
  errors: string[]
}> {
  const supabase = await createClient()
  const errors: string[] = []
  let fixed = 0
  let failed = 0

  try {
    // 获取所有用户
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, avatar_url')

    if (error) {
      return {
        success: false,
        total: 0,
        fixed: 0,
        failed: 0,
        errors: [`获取用户列表失败: ${error.message}`],
      }
    }

    const total = profiles?.length || 0

    if (!profiles || profiles.length === 0) {
      return {
        success: true,
        total: 0,
        fixed: 0,
        failed: 0,
        errors: [],
      }
    }

    // 遍历修复每个用户的头像
    for (const profile of profiles) {
      const userId = profile.id
      const currentAvatarUrl = profile.avatar_url

      // 生成正确的头像URL（使用 user.id 作为 seed）
      const correctAvatarUrl = getAvtUrl(userId)

      // 检查是否需要修复
      const needsFix = !currentAvatarUrl ||
        (currentAvatarUrl && !currentAvatarUrl.includes(userId) && !currentAvatarUrl.includes('dicebear.com'))

      if (needsFix) {
        const result = await fixUserAvatar(userId, correctAvatarUrl)
        if (result.success) {
          fixed++
        } else {
          failed++
          errors.push(`用户 ${userId}: ${result.error}`)
        }
      }
    }

    return {
      success: failed === 0,
      total,
      fixed,
      failed,
      errors,
    }
  } catch (error) {
    console.error('修复头像时出错:', error)
    return {
      success: false,
      total: 0,
      fixed: 0,
      failed: 0,
      errors: [`执行修复时出错: ${String(error)}`],
    }
  }
}

/**
 * 检查头像一致性
 *
 * @description
 * 检查所有用户的头像是否一致（使用 user.id 作为 seed）
 * 不执行修复，只返回检查结果
 *
 * @returns 检查结果
 */
export async function checkAvatarConsistency(): Promise<{
  success: boolean
  total: number
  consistent: number
  inconsistent: number
  details: Array<{
    userId: string
    currentUrl: string | null
    expectedUrl: string
    isConsistent: boolean
  }>
}> {
  const supabase = await createClient()

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, avatar_url')

    if (error) {
      return {
        success: false,
        total: 0,
        consistent: 0,
        inconsistent: 0,
        details: [],
      }
    }

    const total = profiles?.length || 0
    const details: Array<{
      userId: string
      currentUrl: string | null
      expectedUrl: string
      isConsistent: boolean
    }> = []

    let consistent = 0
    let inconsistent = 0

    for (const profile of profiles) {
      const userId = profile.id
      const currentUrl = profile.avatar_url
      const expectedUrl = getAvtUrl(userId)

      // 检查是否一致：当前URL为空，或者包含用户ID（正确的seed）
      const isConsistent = !!currentUrl &&
        (currentUrl.includes(userId) || !currentUrl.includes('dicebear.com'))

      if (isConsistent) {
        consistent++
      } else {
        inconsistent++
      }

      details.push({
        userId,
        currentUrl,
        expectedUrl,
        isConsistent,
      })
    }

    return {
      success: true,
      total,
      consistent,
      inconsistent,
      details,
    }
  } catch (error) {
    console.error('检查头像一致性时出错:', error)
    return {
      success: false,
      total: 0,
      consistent: 0,
      inconsistent: 0,
      details: [],
    }
  }
}
