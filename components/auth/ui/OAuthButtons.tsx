'use client';

/**
 * 第三方登录按钮组组件
 * @module components/auth/OAuthButtons
 * @description 展示 GitHub、Google、微信、QQ 第三方登录图标按钮，支持 GitHub OAuth 登录
 *
 * @安全修复 S-07: OAuth 回调劫持防护
 * - 使用环境变量硬编码域名，替代动态的 window.location.origin
 * - 防止 X-Forwarded-Host 伪造和子域名接管攻击
 * - 确保 Auth Code 始终发送到受信任的域名
 */

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * 获取站点 URL
 * @安全说明
 * - 优先使用环境变量 NEXT_PUBLIC_SITE_URL（硬编码）
 * - 回退到 window.location.origin（仅开发环境）
 * - 生产环境必须配置环境变量，禁止依赖动态 origin
 */
const getSiteUrl = (): string => {
  // 优先使用环境变量（硬编码，不可被篡改）
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 开发环境回退（仅本地开发）
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 生产环境必须有环境变量
  throw new Error(
    '[安全错误] 未配置 NEXT_PUBLIC_SITE_URL 环境变量，OAuth 登录存在安全风险'
  );
};

/**
 * OAuth 提供商类型（UI 展示用）
 * 仅支持Supabase原生支持的Provider
 */
type OAuthProvider = 'github' | 'google';

/**
 * Supabase 支持的 Provider 类型
 */
type SupabaseProvider = 'github' | 'google' | 'azure' | 'bitbucket' | 'discord' | 'facebook' | 'figma' | 'gitlab' | 'keycloak' | 'linkedin' | 'notion' | 'slack' | 'spotify' | 'twitch' | 'twitter' | 'workos' | 'zoom';

/**
 * 提供商配置
 */
const PROVIDER_CONFIG: Record<OAuthProvider, { name: string; enabled: boolean; supabaseProvider?: SupabaseProvider }> = {
  github: { name: 'GitHub', enabled: true, supabaseProvider: 'github' },
  google: { name: 'Google', enabled: false, supabaseProvider: 'google' },
};

/**
 * OAuth 按钮组属性接口
 * @interface OAuthButtonsProps
 */
interface OAuthButtonsProps {
  /** 是否禁用按钮 */
  disabled?: boolean;
  /** 分隔线文字 */
  dividerText?: string;
  /** 登录成功后重定向地址 */
  redirectTo?: string;
}

/**
 * 第三方登录按钮组
 * @function OAuthButtons
 * @param {OAuthButtonsProps} props - 组件属性
 * @returns {JSX.Element} 4列图标按钮组
 *
 * @example
 * ```tsx
 * <OAuthButtons disabled={isLoading} dividerText="或使用邮箱登录" redirectTo="/home" />
 * ```
 */
export function OAuthButtons({
  disabled = false,
  dividerText = '或使用邮箱登录',
  redirectTo = '/home',
}: OAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<OAuthProvider | null>(null);

  /**
   * 处理 OAuth 登录点击
   * @param provider OAuth 提供商
   */
  const handleOAuthLogin = async (provider: OAuthProvider) => {
    const config = PROVIDER_CONFIG[provider];

    if (!config.enabled) {
      alert(`${config.name} 登录暂未开通`);
      return;
    }

    if (disabled || isLoading) return;

    setIsLoading(provider);

    try {
      const supabase = createClient();

      /**
       * @安全修复 S-07: 使用硬编码域名构建回调 URL
       * - 替代 window.location.origin 防止回调劫持
       * - 确保回调始终指向受信任的域名
       */
      const siteUrl = getSiteUrl();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: config.supabaseProvider as SupabaseProvider,
        options: {
          redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        alert('登录请求失败，请稍后重试');
      } else if (data.url) {
        {/* 使用 window.location.assign 进行完整页面跳转，避免 iframe 问题 */}
        window.location.assign(data.url);
      }
    } catch (err) {
      console.error('OAuth exception:', err);
      alert('系统错误，请稍后重试');
    } finally {
      setIsLoading(null);
    }
  };

  const isButtonDisabled = (_provider: OAuthProvider) => {
    return disabled || isLoading !== null;
  };

  return (
    <div className="mb-6">
      {/* 2列图标按钮 */}
      <div className="grid grid-cols-2 gap-3">
        {/* GitHub - 已启用 */}
        <button
          type="button"
          disabled={isButtonDisabled('github')}
          onClick={() => handleOAuthLogin('github')}
          className="flex items-center justify-center p-3
                     bg-white border border-xf-bg/80 rounded-xl
                     text-xf-dark
                     hover:border-xf-primary/40 hover:bg-xf-light/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all"
          title="GitHub"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </button>

        {/* Google - 未启用 */}
        <button
          type="button"
          disabled={isButtonDisabled('google')}
          onClick={() => handleOAuthLogin('google')}
          className="flex items-center justify-center p-3
                     bg-white border border-xf-bg/80 rounded-xl
                     text-xf-dark
                     hover:border-xf-primary/40 hover:bg-xf-light/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all"
          title="Google"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>
      </div>

      {/* 分隔线 */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-xf-bg/80" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-xf-medium">{dividerText}</span>
        </div>
      </div>
    </div>
  );
}
