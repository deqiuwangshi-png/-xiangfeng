'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { useAuthError } from '@/lib/auth/useAuthError';
import { LOGIN_ERRORS } from '@/lib/auth/errorMessages';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { PasswordInput } from '@/components/auth/PasswordInput';

/**
 * 获取客户端标识符
 */
function getClientIdentifier(): string {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<number>(0);
  const { error, handleSupabaseError, clearError, setError } = useAuthError();
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const redirectPath = searchParams.get('redirect') || '/home';

  useEffect(() => {
    const identifier = getClientIdentifier();
    const result = checkRateLimit(identifier);
    if (!result.allowed) {
      setIsRateLimited(true);
      setRateLimitReset(result.resetTime);
    }
  }, []);

  useEffect(() => {
    if (!isRateLimited || rateLimitReset === 0) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((rateLimitReset - Date.now()) / 1000);
      if (remaining <= 0) {
        setIsRateLimited(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRateLimited, rateLimitReset]);

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const identifier = getClientIdentifier();
    const rateLimitResult = checkRateLimit(identifier);

    if (!rateLimitResult.allowed) {
      const remainingMinutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000);
      setError(LOGIN_ERRORS.RATE_LIMITED.replace('{minutes}', String(remainingMinutes)));
      setIsRateLimited(true);
      setRateLimitReset(rateLimitResult.resetTime);
      return;
    }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        throw signInError;
      }

      const { resetRateLimit } = await import('@/lib/security/rateLimit');
      resetRateLimit(identifier);

      router.refresh();
      router.push(redirectPath);
    } catch (err) {
      handleSupabaseError(err, 'login');
    } finally {
      setIsLoading(false);
    }
  }

  const formatRemainingTime = () => {
    if (rateLimitReset === 0) return '';
    const remaining = Math.ceil((rateLimitReset - Date.now()) / 60000);
    return remaining > 0 ? `${remaining} 分钟` : '即将';
  };

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      <BrandSection />
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md">
          <MobileBrandTitle />
          <FormCard title="欢迎回来">
            {isRateLimited && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm">
                <p className="font-medium">登录尝试次数过多</p>
                <p>请 {formatRemainingTime()} 后再试</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">账号</label>
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading || isRateLimited}
                />
              </div>

              <PasswordInput
                label="密码"
                name="password"
                id="login-password"
                placeholder="•••••••"
                required
                disabled={isLoading || isRateLimited}
                minLength={8}
              />

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
          </FormCard>
        </div>
      </div>
    </section>
  );
}
