'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理注册表单提交
   * @param event - 表单提交事件
   */
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const username = formData.get('username') as string;
    const terms = formData.get('terms') as string;

    // 验证密码一致性
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    // 验证服务条款
    if (!terms) {
      setError('请阅读并同意服务条款');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // 注册成功，跳转到登录页面
      window.location.href = '/login';
    } catch (err) {
      console.error('Register error:', err);
      
      // 优化错误提示
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        if (errorMessage.includes('Email not confirmed')) {
          setError('注册成功，但邮箱未验证。请检查邮箱并点击验证链接。');
        } else if (errorMessage.includes('User already registered')) {
          setError('该邮箱已被注册，请直接登录或使用其他邮箱。');
        } else if (errorMessage.includes('Invalid email')) {
          setError('邮箱地址格式不正确，请检查后重试。');
        } else if (errorMessage.includes('Password')) {
          setError('密码不符合要求，请使用至少6个字符的密码。');
        } else if (errorMessage.includes('is invalid')) {
          setError('注册失败：' + errorMessage);
        } else {
          setError(errorMessage);
        }
      } else {
        setError('注册失败，请稍后重试');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-40 bg-xf-light">
      {/* 左侧品牌区域（桌面端） */}
      <BrandSection />

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* 移动端品牌标题 */}
          <MobileBrandTitle />

          {/* 表单卡片 */}
          <FormCard title="创建账号">
            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* 邮箱输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">邮箱</label>
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 用户名输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">用户名</label>
                <input
                  type="text"
                  name="username"
                  id="register-username"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="选择用户名"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">密码</label>
                <input
                  type="password"
                  name="password"
                  id="register-password"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 确认密码输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">确认密码</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="register-confirm"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 服务条款 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
                  <input type="checkbox" name="terms" className="custom-checkbox" disabled={isLoading} />
                  <span>我已阅读并同意服务条款</span>
                </label>
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <span className="loading-dots">注册中</span> : '注册'}
              </button>
            </form>

            {/* 切换到登录 */}
            <div className="mt-8 flex justify-between text-sm text-xf-medium px-2">
              <span className="text-xf-primary">已有账号?</span>
              <Link href="/login" className="hover:text-xf-accent transition font-medium text-xf-info">
                立即登录 →
              </Link>
            </div>
          </FormCard>
        </div>
      </div>
    </section>
  );
}
