'use client';

/**
 * 忘记密码表单组件
 * @module components/auth/ForgotPasswordForm
 * @description 忘记密码表单逻辑和交互（包含成功状态）
 * @性能优化 P1: 从 page.tsx 分离，使页面主体支持 SSR
 */

import { useState } from 'react';
import Link from 'next/link';
import { useAuthToast } from '@/hooks/auth/useAuthToast';
import { forgotPassword } from '@/lib/auth';

/**
 * 忘记密码表单组件
 * @function ForgotPasswordForm
 * @returns {JSX.Element} 忘记密码表单或成功页面
 * @description
 * 包含表单状态管理、提交处理、成功状态
 * 作为 Client Component 独立出来，使页面主体可 SSR
 */
export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showError, showSuccess, showLoading, dismiss } = useAuthToast();

  /**
   * 处理表单提交
   * @param {FormData} formData - 表单数据
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const toastId = showLoading('发送中...');

    const result = await forgotPassword(formData);

    dismiss(toastId);

    if (!result.success) {
      showError(result.error || '发送失败');
      setIsLoading(false);
      return;
    }

    showSuccess('重置密码邮件已发送，请检查邮箱');
    setIsSuccess(true);
    setIsLoading(false);
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
          {isLoading ? <span className="loading-dots">发送中</span> : '发送重置链接'}
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
