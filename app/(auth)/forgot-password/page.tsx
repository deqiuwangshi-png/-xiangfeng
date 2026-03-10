'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/auth';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';

/**
 * 忘记密码页面
 * @returns 忘记密码页面组件
 */
export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 Toast 显示错误
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
      });
      setError(null);
    }
  }, [error]);

  /**
   * 处理表单提交
   * @param formData 表单数据
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await forgotPassword(formData);

    if (!result.success) {
      setError(result.error || '发送失败');
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  }

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      <BrandSection />
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md">
          <MobileBrandTitle />
          <FormCard title={isSuccess ? '邮件已发送' : '重置密码'}>
            {!isSuccess ? (
              <form action={handleSubmit} className="space-y-6">
                <div className="text-center text-xf-medium text-sm mb-4">
                  请输入您的邮箱地址，我们将向您发送重置密码的链接。
                </div>

                <div>
                  <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">邮箱</label>
                  <input
                    type="email"
                    name="email"
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
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-xf-medium">
                  重置密码链接已发送到您的邮箱，请查收。
                </p>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
                >
                  返回登录
                </button>
              </div>
            )}

            <div className="mt-8 text-center text-sm">
              <Link href="/login" className="text-xf-info hover:text-xf-accent transition font-medium">
                ← 返回登录
              </Link>
            </div>
          </FormCard>
        </div>
      </div>
    </section>
  );
}
