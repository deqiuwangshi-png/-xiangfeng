'use client';

/**
 * 登录表单组件
 * @module components/auth/LoginForm
 * @description 登录表单逻辑和交互
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login } from '@/lib/auth/client';
import { PasswordInput } from '@/components/auth/ui/PasswordInput';
import { OAuthButtons } from '@/components/auth/ui/OAuthButtons';

/**
 * 登录表单组件
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/home';
  
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    if (isLoading) return;

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !email.includes('@')) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    if (!password || password.length < 8) {
      toast.error('密码至少需要8位');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('登录中...');

    try {
      formData.set('redirectTo', redirectTo);
      const result = await login(formData);
      toast.dismiss(toastId);

      if (!result.success) {
        toast.error(result.error || '登录失败，请重试');
        return;
      }

      router.push(result.redirectTo || redirectTo);
      router.refresh();
    } catch {
      toast.dismiss(toastId);
      toast.error('登录失败，请重试');
    } finally {
      setIsLoading(false);
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
          required
          disabled={isLoading}
          minLength={8}
        />

        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-xf-info hover:text-xf-accent transition font-medium">
            忘记密码?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-xf-primary hover:bg-xf-accent disabled:bg-xf-primary/50 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg text-lg tracking-wide disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          立即注册
        </Link>
      </div>
    </>
  );
}
