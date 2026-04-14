'use client';

/**
 * 忘记密码表单组件
 * @module components/auth/ForgotPasswordForm
 */

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/auth/client';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const toastId = toast.loading('发送中...');

    const email = formData.get('email') as string;

    try {
      const payload = new FormData();
      payload.set('email', email);
      const result = await forgotPassword(payload);
      toast.dismiss(toastId);

      if (!result.success) {
        toast.error(result.error || '发送失败，请重试');
        setIsLoading(false);
        return;
      }

      toast.success(result.message || '重置密码邮件已发送，请检查邮箱');
      setIsSuccess(true);
    } catch {
      toast.dismiss(toastId);
      toast.error('发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-center text-xf-medium">
            重置链接已发送到你的邮箱，请在网页端邮箱查收
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all"
          >
            返回登录
          </button>
        </div>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-xf-info hover:text-xf-accent transition font-medium">
            ← 返回登录
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
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
          {isLoading ? '发送中...' : '发送重置链接'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="text-xf-info hover:text-xf-accent transition font-medium">
          ← 返回登录
        </Link>
      </div>
    </>
  );
}
