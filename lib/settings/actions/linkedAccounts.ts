'use server'

/**
 * 关联账号管理 Server Actions
 * @module lib/settings/actions/linkedAccounts
 * @description 处理第三方账号的绑定、解绑和查询
 */

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { LOGIN_MESSAGES, COMMON_ERRORS, SUCCESS_MESSAGES } from '@/lib/messages'
import type {
  OAuthProvider,
  GetLinkedAccountsResult,
  LinkAccountResult,
  LinkedAccountItem,
} from '@/types/settings'

/**
 * 支持的OAuth提供商配置
 * 仅支持Supabase原生支持的Provider
 */
const PROVIDER_CONFIG: Record<
  OAuthProvider,
  { name: string; enabled: boolean; supabaseProvider: string }
> = {
  github: { name: 'GitHub', enabled: true, supabaseProvider: 'github' },
  google: { name: 'Google', enabled: false, supabaseProvider: 'google' },
}

/**
 * 获取用户已关联的第三方账号列表
 *
 * @returns 关联账号列表结果
 *
 * @example
 * ```ts
 * const result = await getLinkedAccounts()
 * if (result.success && result.accounts) {
 *   console.log(result.accounts)
 * }
 * ```
 */
export async function getLinkedAccounts(): Promise<GetLinkedAccountsResult> {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
    }

    // 从数据库查询已关联的账号
    const { data: dbIdentities, error: queryError } = await supabase
      .from('user_identities')
      .select('provider, email, display_name, status')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (queryError) {
      console.error('查询关联账号失败:', queryError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    // 同时从 Supabase Auth 获取 identities（作为备用）
    const { data: authIdentitiesData, error: authIdentitiesError } =
      await supabase.auth.getUserIdentities()

    if (authIdentitiesError) {
      console.error('获取 Auth identities 失败:', authIdentitiesError)
    }

    // 构建账号列表（包含所有支持的提供商）
    const accounts: LinkedAccountItem[] = (
      Object.keys(PROVIDER_CONFIG) as OAuthProvider[]
    ).map((provider) => {
      const config = PROVIDER_CONFIG[provider]

      // 优先从数据库查询
      const dbIdentity = dbIdentities?.find(
        (item) => item.provider === provider
      )

      // 如果数据库中没有，从 Supabase Auth 获取
      const authIdentity = authIdentitiesData?.identities?.find(
        (item) => item.provider === provider
      )

      // 合并状态：数据库或 Auth 中有任一存在即视为已绑定
      const isConnected =
        (!!dbIdentity && dbIdentity.status === 'active') || !!authIdentity

      // 优先使用数据库中的邮箱，否则使用 Auth 中的
      const email =
        dbIdentity?.email || authIdentity?.identity_data?.email

      return {
        id: provider,
        name: config.name,
        connected: isConnected,
        email: email,
      }
    })

    return { success: true, accounts }
  } catch (err) {
    console.error('获取关联账号时出错:', err)
    return { success: false, error: COMMON_ERRORS.DEFAULT }
  }
}

/**
 * 绑定第三方账号
 *
 * 流程说明：
 * 1. 检查提供商是否启用
 * 2. 检查是否已绑定
 * 3. 调用Supabase linkIdentity获取授权URL
 * 4. 用户跳转授权后，在callback中完成绑定
 *
 * @param provider OAuth提供商
 * @returns 绑定结果，包含授权URL
 *
 * @example
 * ```ts
 * const result = await linkAccount('github')
 * if (result.success && result.url) {
 *   window.location.href = result.url
 * }
 * ```
 */
export async function linkAccount(
  provider: OAuthProvider
): Promise<LinkAccountResult> {
  const config = PROVIDER_CONFIG[provider]

  if (!config || !config.enabled) {
    return {
      success: false,
      error: LOGIN_MESSAGES.OAUTH_NOT_ENABLED.replace('{provider}', config?.name || provider),
    }
  }

  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
    }

    // 检查是否已绑定
    const { data: existingIdentity, error: checkError } = await supabase
      .from('user_identities')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('status', 'active')
      .maybeSingle()

    if (checkError) {
      console.error('检查绑定状态失败:', checkError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    if (existingIdentity) {
      return { success: false, error: '该账号已绑定' }
    }

    // 获取当前origin用于回调
    const headersList = await headers()
    const origin = headersList.get('origin') || 'http://localhost:3000'

    // 调用Supabase linkIdentity
    const { data, error } = await supabase.auth.linkIdentity({
      provider: config.supabaseProvider as 'github' | 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/settings&linked=true`,
      },
    })

    if (error) {
      console.error('绑定账号失败:', error)
      return {
        success: false,
        error: LOGIN_MESSAGES.OAUTH_ERROR,
      }
    }

    if (!data?.url) {
      return {
        success: false,
        error: LOGIN_MESSAGES.OAUTH_URL_ERROR,
      }
    }

    return {
      success: true,
      url: data.url,
    }
  } catch (err) {
    console.error('绑定账号时出错:', err)
    return {
      success: false,
      error: COMMON_ERRORS.UNKNOWN_ERROR,
    }
  }
}

/**
 * 解绑第三方账号
 *
 * @param provider OAuth提供商
 * @returns 解绑结果
 *
 * @example
 * ```ts
 * const result = await unlinkAccount('github')
 * if (result.success) {
 *   console.log('解绑成功')
 * }
 * ```
 */
export async function unlinkAccount(
  provider: OAuthProvider
): Promise<LinkAccountResult> {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: LOGIN_MESSAGES.NOT_AUTHENTICATED }
    }

    // 从 Supabase Auth 获取 identities（作为权威来源）
    const { data: authIdentitiesData, error: authIdentitiesError } =
      await supabase.auth.getUserIdentities()

    if (authIdentitiesError) {
      console.error('获取 Auth identities 失败:', authIdentitiesError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    // 查找要解绑的 Auth identity
    const authIdentity = authIdentitiesData?.identities?.find(
      (item) => item.provider === provider
    )

    // 同时查询数据库中的记录
    const { data: dbIdentity, error: queryError } = await supabase
      .from('user_identities')
      .select('id, provider_user_id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('status', 'active')
      .maybeSingle()

    if (queryError) {
      console.error('查询身份失败:', queryError)
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    // 如果 Auth 和数据库中都没有，说明未绑定
    if (!authIdentity && !dbIdentity) {
      return { success: false, error: '该账号未绑定' }
    }

    // 检查是否是唯一的登录方式
    const authIdentitiesCount = authIdentitiesData?.identities?.length || 0
    const hasPassword = user?.app_metadata?.provider === 'email'

    // 如果没有密码且只有一个第三方登录方式，禁止解绑
    if (!hasPassword && authIdentitiesCount <= 1) {
      return {
        success: false,
        error: '无法解绑：您需要至少保留一种登录方式',
      }
    }

    // 使用 Supabase Auth 中的 identity ID
    const identityId = authIdentity?.id || dbIdentity?.provider_user_id

    if (!identityId) {
      return { success: false, error: COMMON_ERRORS.DEFAULT }
    }

    // 方式1：使用Supabase unlinkIdentity（推荐）
    // 注意：需要identity对象，包含provider和id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: unlinkError } = await (supabase.auth as any).unlinkIdentity({
      provider: provider as 'github' | 'google',
      identity: {
        provider: provider as 'github' | 'google',
        id: identityId,
      },
    })

    if (unlinkError) {
      console.error('Supabase解绑失败:', unlinkError)
    }

    // 无论 Auth 解绑是否成功，都更新数据库状态
    if (dbIdentity?.id) {
      const { error: updateError } = await supabase
        .from('user_identities')
        .update({
          status: 'revoked',
          updated_at: new Date().toISOString(),
        })
        .eq('id', dbIdentity.id)

      if (updateError) {
        console.error('数据库解绑失败:', updateError)
      }
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.DEFAULT,
    }
  } catch (err) {
    console.error('解绑账号时出错:', err)
    return {
      success: false,
      error: COMMON_ERRORS.UNKNOWN_ERROR,
    }
  }
}

/**
 * 同步Supabase Auth身份到user_identities表
 *
 * 在OAuth回调后调用，将Supabase Auth中的身份信息同步到应用数据库
 *
 * @returns 同步结果
 */
export async function syncIdentitiesToDatabase(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: '未登录' }
    }

    // 获取用户的所有身份
    const { data: identities, error: identitiesError } =
      await supabase.auth.getUserIdentities()

    if (identitiesError) {
      console.error('获取身份信息失败:', identitiesError)
      return { success: false, error: '获取身份信息失败' }
    }

    // 同步每个身份到user_identities表
    for (const identity of identities?.identities || []) {
      const provider = identity.provider as OAuthProvider
      const providerUserId = identity.identity_data?.sub || identity.id
      const email = identity.identity_data?.email
      const displayName =
        identity.identity_data?.name || identity.identity_data?.user_name
      const avatarUrl = identity.identity_data?.avatar_url

      // 检查是否已存在
      const { data: existing } = await supabase
        .from('user_identities')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .maybeSingle()

      if (existing) {
        // 更新现有记录
        await supabase
          .from('user_identities')
          .update({
            email,
            display_name: displayName,
            avatar_url: avatarUrl,
            last_used_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      } else {
        // 插入新记录
        await supabase.from('user_identities').insert({
          user_id: user.id,
          provider,
          provider_user_id: providerUserId,
          email,
          display_name: displayName,
          avatar_url: avatarUrl,
          status: 'active',
          last_used_at: new Date().toISOString(),
        })
      }
    }

    return { success: true }
  } catch (err) {
    console.error('同步身份信息时出错:', err)
    return { success: false, error: '同步失败' }
  }
}
