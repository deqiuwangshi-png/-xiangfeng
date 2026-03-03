'use client';

/**
 * 忘记密码页面
 * @module app/(auth)/forgot-password/page
 * @description 用户忘记密码时发送重置邮件
 */

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuthError } from '@/lib/auth/useAuthError';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { error, handleSupabaseError, clearError } = useAuthError();

  async function handleForgotPassword(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setIsSuccess(true);
    } catch (err) {
      handleSupabaseError(err, 'forgot-password');
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackToLogin() {
    window.location.href = '/login';
  }

  function handleResend() {
    setIsSuccess(false);
    setEmail('');
    clearError();
  }

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      <BrandSection />
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md">
          <MobileBrandTitle />
          <FormCard title={isSuccess ? '邮件已发送' : '重置密码'}>
            {!isSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="text-center text-xf-medium text-sm mb-4">
                  请输入您的邮箱地址，我们将向您发送重置密码的链接。
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">邮箱</label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <span className="loading-dots">发送中</span> : '发送重置链接'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-xf-primary font-medium">
                    重置密码的链接已发送至
                  </p>
                  <p className="text-xf-accent font-semibold text-lg">
                    {email}
                  </p>
                  <p className="text-xf-medium text-sm">
                    请检查您的邮箱（包括垃圾邮件文件夹），点击链接即可重置密码。
                  </p>
                  <p className="text-xf-medium text-sm">
                    链接将在 30 分钟后失效。
                  </p>
                </div>

                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide"
                >
                  返回登录
                </button>

                <div className="text-center text-sm">
                  <button
                    onClick={handleResend}
                    className="text-xf-info hover:text-xf-accent transition font-medium"
                  >
                    重新发送
                  </button>
                </div>
              </div>
            )}

            {!isSuccess && (
              <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
                <span className="text-xf-primary">想起密码了?</span>
                <Link href="/login" className="hover:text-xf-accent transition font-medium text-xf-info">
                  返回登录 →
                </Link>
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </section>
  );
}
