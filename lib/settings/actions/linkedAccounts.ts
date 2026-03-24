'use server'

/**
 * 关联账号管理 Server Actions
 * @module lib/settings/actions/linkedAccounts
 * @description 处理第三方账号的绑定、解绑和查询
 */

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type {
  OAuthProvider,
  GetLinkedAccountsResult,
  LinkAccountResult,
  LinkedAccountItem,
} from '@/types/settings'

/**
 * 支持的OAuth提供商配置
 */
const PROVIDER_CONFIG: Record<
  OAuthProvider,
  { name: string; enabled: boolean; supabaseProvider: string }
> = {
  github: { name: 'GitHub', enabled: true, supabaseProvider: 'github' },
  google: { name: 'Google', enabled: false, supabaseProvider: 'google' },
  wechat: { name: '微信', enabled: false, supabaseProvider: 'wechat' },
  qq: { name: 'QQ', enabled: false, supabaseProvider: 'qq' },
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
      return { success: false, error: '未登录或登录已过期' }
    }

    // 从数据库查询已关联的账号
    const { data: identities, error: queryError } = await supabase
      .from('user_identities')
      .select('provider, email, display_name, status')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (queryError) {
      console.error('查询关联账号失败:', queryError)
      return { success: false, error: '获取关联账号失败' }
    }

    // 构建账号列表（包含所有支持的提供商）
    const accounts: LinkedAccountItem[] = (
      Object.keys(PROVIDER_CONFIG) as OAuthProvider[]
    ).map((provider) => {
      const config = PROVIDER_CONFIG[provider]
      const linkedIdentity = identities?.find(
        (item) => item.provider === provider
      )

      return {
        id: provider,
        name: config.name,
        connected: !!linkedIdentity && linkedIdentity.status === 'active',
        email: linkedIdentity?.email,
      }
    })

    return { success: true, accounts }
  } catch (err) {
    console.error('获取关联账号时出错:', err)
    return { success: false, error: '获取关联账号失败，请稍后重试' }
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
      error: `${config?.name || provider} 绑定暂未开通`,
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
      return { success: false, error: '未登录或登录已过期' }
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
      return { success: false, error: '检查绑定状态失败' }
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
        error: '绑定请求失败，请稍后重试',
      }
    }

    if (!data?.url) {
      return {
        success: false,
        error: '获取授权链接失败',
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
      error: '系统错误，请稍后重试',
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
      return { success: false, error: '未登录或登录已过期' }
    }

    // 查询要解绑的身份
    const { data: identity, error: queryError } = await supabase
      .from('user_identities')
      .select('id, provider_user_id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('status', 'active')
      .maybeSingle()

    if (queryError) {
      console.error('查询身份失败:', queryError)
      return { success: false, error: '查询绑定信息失败' }
    }

    if (!identity) {
      return { success: false, error: '该账号未绑定' }
    }

    // 检查是否是唯一的登录方式
    const { data: identities, error: countError } = await supabase
      .from('user_identities')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (countError) {
      console.error('查询身份列表失败:', countError)
      return { success: false, error: '检查登录方式失败' }
    }

    // 获取用户的登录方式（密码或第三方）
    const { data: userData } = await supabase.auth.getUser()
    const hasPassword = userData?.user?.app_metadata?.provider === 'email'

    // 如果没有密码且只有一个第三方登录方式，禁止解绑
    if (!hasPassword && identities.length <= 1) {
      return {
        success: false,
        error: '无法解绑：您需要至少保留一种登录方式',
      }
    }

    // 方式1：使用Supabase unlinkIdentity（推荐）
    // 注意：需要identity对象，包含provider和id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: unlinkError } = await (supabase.auth as any).unlinkIdentity({
      provider: provider as 'github' | 'google',
      identity: {
        provider: provider as 'github' | 'google',
        id: identity.provider_user_id,
      },
    })

    if (unlinkError) {
      console.error('Supabase解绑失败:', unlinkError)
      // 降级到方式2：直接更新数据库状态
      const { error: updateError } = await supabase
        .from('user_identities')
        .update({
          status: 'revoked',
          updated_at: new Date().toISOString(),
        })
        .eq('id', identity.id)

      if (updateError) {
        console.error('数据库解绑失败:', updateError)
        return { success: false, error: '解绑失败，请稍后重试' }
      }
    }

    return {
      success: true,
      message: '解绑成功',
    }
  } catch (err) {
    console.error('解绑账号时出错:', err)
    return {
      success: false,
      error: '系统错误，请稍后重试',
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
