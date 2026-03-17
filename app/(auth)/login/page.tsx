'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthToast } from '@/hooks/useAuthToast';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { login } from '@/lib/auth'
import { sanitizeRedirect } from '@/lib/auth/redir'
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { PasswordInput } from '@/components/auth/PasswordInput';

/**
 * 获取客户端标识符
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
 */
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const { showError, showLoading, dismiss } = useAuthToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get('redirect'), '/home');

  {/* 限流倒计时 */}
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

    const interval = setInterval(() => {
      if (!updateRemainingTime()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRateLimited, rateLimitReset]);

  /**
   * 处理表单提交
   * @param formData 表单数据
   */
  async function handleSubmit(formData: FormData) {
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

      {/* 登录成功 - 登录页无toast，直接跳转 */}
      dismiss(toastId);
      router.refresh();
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

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">账号</label>
          <input
            type="email"
            name="email"
            className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
            placeholder="your@email.com"
            required
            disabled={isLoading || isRateLimited}
          />
        </div>

        <PasswordInput
          label="密码"
          name="password"
          placeholder="•••••••"
          required
          disabled={isLoading || isRateLimited}
          minLength={8}
        />

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
            <input type="checkbox" className="custom-checkbox" disabled={isLoading} />
            <span>记住我</span>
          </label>
          <Link href="/forgot-password" className="text-xf-info hover:text-xf-accent transition font-medium">
            忘记密码?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading || isRateLimited}
          className="w-full bg-xf-primary hover:bg-xf-accent disabled:bg-xf-primary/50 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="loading-dots">登录中</span> : '登 录'}
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

/**
 * 登录页面
 * @returns 登录页面组件
 */
export default function LoginPage() {
  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      <BrandSection />
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md">
          <MobileBrandTitle />
          <FormCard title="欢迎回来">
            <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
              <LoginForm />
            </Suspense>
          </FormCard>
        </div>
      </div>
    </section>
  );
}
