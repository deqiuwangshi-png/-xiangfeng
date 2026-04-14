'use server';

/**
 * OAuth 第三方登录操作
 * @module lib/auth/actions/oauth
 * @description GitHub、Google 等第三方登录认证
 */

import { createClient } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/seo';
import { LOGIN_MESSAGES, COMMON_ERRORS } from '@/lib/messages';
import type { OAuthProvider, OAuthLoginResult } from '@/types/auth/oauth';
import { OAUTH_PROVIDER_CONFIG } from '@/config/navigation';

/**
 * 使用 OAuth 登录
 * @param provider OAuth 提供商
 * @param redirectTo 登录成功后重定向地址
 * @returns 登录结果，包含授权 URL
 *
 * @example
 * ```ts
 * const result = await oauthLogin('github', '/home');
 * if (result.success && result.url) {
 *   window.location.href = result.url;
 * }
 * ```
 */
export async function oauthLogin(
  provider: OAuthProvider,
  redirectTo: string = '/home'
): Promise<OAuthLoginResult> {
  const config = OAUTH_PROVIDER_CONFIG[provider];

  if (!config || !config.enabled) {
    return {
      success: false,
      error: LOGIN_MESSAGES.OAUTH_NOT_ENABLED.replace('{provider}', config?.name || provider),
    };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      console.error('OAuth login error:', error);
      return {
        success: false,
        error: LOGIN_MESSAGES.OAUTH_ERROR,
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: LOGIN_MESSAGES.OAUTH_URL_ERROR,
      };
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (err) {
    console.error('OAuth login exception:', err);
    return {
      success: false,
      error: COMMON_ERRORS.UNKNOWN_ERROR,
    };
  }
}

/**
 * 获取 OAuth 提供商状态
 * @returns 各提供商的启用状态
 */
export async function getOAuthProvidersStatus(): Promise<
  Record<OAuthProvider, { name: string; enabled: boolean }>
> {
  return { ...OAUTH_PROVIDER_CONFIG };
}
