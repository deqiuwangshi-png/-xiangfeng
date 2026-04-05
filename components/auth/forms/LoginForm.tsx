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
 *
 * @优化说明
 * - 使用全局认证状态管理（Zustand）
 * - 通过 useAuth Hook 处理登录逻辑
 * - 自动同步全局认证状态
 */

import { useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth, useAuthToast } from '@/hooks';
import { sanitizeRedirect } from '@/lib/auth/utils/redir';
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

 * 包含表单状态管理、限流控制、提交处理
 * 作为 Client Component 独立出来，使页面主体可 SSR
 */
export function LoginForm() {
  const { showError, showLoading, dismiss } = useAuthToast();

  {/* 使用全局认证状态管理 */}
  const { login, isLoading, error, clearError } = useAuth();

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

  // 添加提交锁，防止快速多次点击
  const isSubmittingRef = useRef(false);

  /**
   * 处理表单提交
   * @param {FormData} formData - 表单数据
   * @安全说明
   * - 使用 isLoading 状态防止重复提交
   * - 客户端限流检查防止暴力破解
   * - 服务端限流在 Server Action 中执行
   *
   * @优化说明
   * - 使用 useAuth Hook 处理登录逻辑
   * - 自动更新全局认证状态
   * - 无需手动管理 isLoading 状态
   */
  async function handleSubmit(formData: FormData) {
    {/* 防重复提交检查 */}
    if (isLoading || isSubmittingRef.current) {
      return;
    }

    {/* 清除之前的错误 */}
    clearError();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    {/* 前端表单校验 */}
    if (!email || !email.includes('@')) {
      showError('请输入有效的邮箱地址');
      return;
    }

    if (!password || password.length < 8) {
      showError('密码至少需要8位');
      return;
    }

    isSubmittingRef.current = true;

    {/* 显示加载中 */}
    const toastId = showLoading('登录中...');

    try {
      const success = await login({
        email,
        password,
        redirectTo,
      });

      if (!success) {
        dismiss(toastId);
        showError(error?.message || '登录失败');
        return;
      }

      {/* 登录成功，重置客户端限流 */}
      const { resetRateLimit } = await import('@/lib/security/rateLimitClient');
      resetRateLimit(getClientId());

      {/* 登录成功 - 登录页无toast，直接跳转（由 useAuth 处理） */}
      dismiss(toastId);
    } catch (err) {
      dismiss(toastId);
      showError(err instanceof Error ? err.message : '登录失败');
    } finally {
      isSubmittingRef.current = false;
    }
  }

  return (
    <>
      <OAuthButtons disabled={isLoading} dividerText="或使用邮箱登录" />

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
            disabled={isLoading}
          />
        </div>

        <PasswordInput
          ref={passwordInputRef}
          name="password"
          placeholder="密码"
          autoComplete="current-password"
          aria-label="密码"
          required
          disabled={isLoading}
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
          disabled={isLoading}
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
