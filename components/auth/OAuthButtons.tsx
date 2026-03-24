'use client';

/**
 * 第三方登录按钮组组件
 * @module components/auth/OAuthButtons
 * @description 展示 GitHub、Google、微信、QQ 第三方登录图标按钮，支持 GitHub OAuth 登录
 */

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * OAuth 提供商类型（UI 展示用）
 */
type OAuthProvider = 'github' | 'google' | 'wechat' | 'qq';

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
  wechat: { name: '微信', enabled: false },
  qq: { name: 'QQ', enabled: false },
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: config.supabaseProvider as SupabaseProvider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
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

  const isButtonDisabled = (provider: OAuthProvider) => {
    return disabled || isLoading !== null;
  };

  return (
    <div className="mb-6">
      {/* 4列图标按钮 */}
      <div className="grid grid-cols-4 gap-3">
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

        {/* 微信 - 未启用 */}
        <button
          type="button"
          disabled={isButtonDisabled('wechat')}
          onClick={() => handleOAuthLogin('wechat')}
          className="flex items-center justify-center p-3
                     bg-white border border-xf-bg/80 rounded-xl
                     text-xf-dark
                     hover:border-xf-primary/40 hover:bg-xf-light/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all"
          title="微信"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#07C160">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
          </svg>
        </button>

        {/* QQ - 未启用 */}
        <button
          type="button"
          disabled={isButtonDisabled('qq')}
          onClick={() => handleOAuthLogin('qq')}
          className="flex items-center justify-center p-3
                     bg-white border border-xf-bg/80 rounded-xl
                     text-xf-dark
                     hover:border-xf-primary/40 hover:bg-xf-light/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all"
          title="QQ"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#12B7F5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5c-1.5 1-4.5 1-6 0-.5-.3-.5-1.5 0-1.8 1.5-1 4.5-1 6 0 .5.3.5 1.5 0 1.8zm1.5-5c-.5.5-1.5.8-2.5.8s-2-.3-2.5-.8c-.3-.3-.3-.8 0-1 .5-.5 1.5-.8 2.5-.8s2 .3 2.5.8c.3.3.3.8 0 1zm-7 0c-.5.5-1.5.8-2.5.8s-2-.3-2.5-.8c-.3-.3-.3-.8 0-1 .5-.5 1.5-.8 2.5-.8s2 .3 2.5.8c.3.3.3.8 0 1z" />
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
