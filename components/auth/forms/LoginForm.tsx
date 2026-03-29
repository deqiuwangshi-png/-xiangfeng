'use client';

/**
 * 登录表单组件
 * @module components/auth/LoginForm
 * @description 登录表单逻辑和交互
 * @性能优化 P1: 从 page.tsx 分离，使页面主体支持 SSR
 *
 * @安全修复 S-06: 登录响应篡改防护
 * - 跳转前进行二次 Session 验证
 * - 防止 Burp Suite 等工具篡改响应包绕过登录
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthToast } from '@/hooks/auth/useAuthToast';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { login } from '@/lib/auth';
import { sanitizeRedirect } from '@/lib/auth/redir';
import { createClient } from '@/lib/supabase/client';
import { PasswordInput } from '@/components/auth/ui/PasswordInput';
import { OAuthButtons } from '@/components/auth/ui/OAuthButtons';

/**
 * 获取客户端标识符
 * @returns {string} 客户端唯一标识
 */
function getClientId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', id);
  }
  return id;
}

/**
 * 登录表单组件
 * @function LoginForm
 * @returns {JSX.Element} 登录表单
 * @description
 * 包含表单状态管理、限流控制、提交处理
 * 作为 Client Component 独立出来，使页面主体可 SSR
 */
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const { showError, showLoading, dismiss } = useAuthToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get('redirect'), '/home');

  /**
   * 邮箱输入框引用 - 用于错误时聚焦
   */
  const emailInputRef = useRef<HTMLInputElement>(null);

  /**
   * 密码输入框引用 - 用于错误时聚焦
   */
  const passwordInputRef = useRef<HTMLInputElement>(null);

  /**
   * 限流倒计时 - 按分钟粒度更新
   * @性能优化 P-05: 从每秒更新改为每分钟更新，减少重渲染
   */
  useEffect(() => {
    if (!isRateLimited || rateLimitReset === 0) return;

    const updateRemainingTime = () => {
      const now = Date.now();
      const minutes = Math.ceil((rateLimitReset - now) / 60000);
      setRemainingTime(minutes > 0 ? `${minutes} 分钟` : '稍后');

      if (now >= rateLimitReset) {
        setIsRateLimited(false);
        return false;
      }
      return true;
    };

    // 立即更新一次
    updateRemainingTime();

    /**
     * @性能优化 P-05: 使用 60 秒间隔替代 1 秒
     * - 显示粒度是分钟，无需每秒更新
     * - 减少不必要的重渲染和 CPU 消耗
     */
    const interval = setInterval(() => {
      if (!updateRemainingTime()) {
        clearInterval(interval);
      }
    }, 60000); // 60 秒更新一次

    return () => clearInterval(interval);
  }, [isRateLimited, rateLimitReset]);

  /**
   * 处理表单提交
   * @param {FormData} formData - 表单数据
   * @安全说明
   * - 使用 isLoading 状态防止重复提交
   * - 客户端限流检查防止暴力破解
   * - 服务端限流在 Server Action 中执行
   */
  async function handleSubmit(formData: FormData) {
    {/* 防重复提交检查 */}
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    {/* 客户端限流检查 - 仅在提交时检查 */}
    const clientLimit = checkRateLimit(getClientId());
    if (!clientLimit.allowed) {
      setIsRateLimited(true);
      setRateLimitReset(clientLimit.resetTime);
      showError('尝试次数过多，请稍后再试', 'rateLimit');
      setIsLoading(false);
      return;
    }

    {/* 显示加载中 */}
    const toastId = showLoading('登录中...');

    try {
      const result = await login(formData);

      if (!result.success) {
        dismiss(toastId);
        showError(result.error || '登录失败');
        setIsLoading(false);
        return;
      }

      {/* 登录成功，重置客户端限流 */}
      const { resetRateLimit } = await import('@/lib/security/rateLimit');
      resetRateLimit(getClientId());

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        dismiss(toastId);
        showError('登录验证失败，请重试');
        setIsLoading(false);
        return;
      }

      {/* 登录成功 - 登录页无toast，直接跳转 */}
      dismiss(toastId);
      router.push(result.redirectTo || '/home');
    } catch (err) {
      dismiss(toastId);
      showError(err instanceof Error ? err.message : '登录失败');
      setIsLoading(false);
    }
  }

  return (
    <>
      {isRateLimited && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm">
          <p className="font-medium">登录尝试次数过多</p>
          <p>请 {remainingTime} 后再试</p>
        </div>
      )}

      <OAuthButtons disabled={isLoading || isRateLimited} dividerText="或使用邮箱登录" />

      <form action={handleSubmit} className="space-y-6">
        <div>
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            autoComplete="email"
            aria-label="邮箱地址"
            className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
            placeholder="账号"
            required
            disabled={isLoading || isRateLimited}
          />
        </div>

        <PasswordInput
          ref={passwordInputRef}
          name="password"
          placeholder="密码"
          autoComplete="current-password"
          aria-label="密码"
          required
          disabled={isLoading || isRateLimited}
          minLength={8}
        />

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-xf-info hover:text-xf-accent transition font-medium">
            忘记密码?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading || isRateLimited}
          aria-busy={isLoading}
          aria-label={isLoading ? '登录中，请稍候' : '登录'}
          className="w-full bg-xf-primary hover:bg-xf-accent disabled:bg-xf-primary/50 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>登录中...</span>
            </>
          ) : (
            '登 录'
          )}
        </button>
      </form>

      <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
        <span className="text-xf-primary">新用户?</span>
        <Link href="/register" className="hover:text-xf-accent transition font-medium text-xf-info">
          注册新账号 →
        </Link>
      </div>
    </>
  );
}
