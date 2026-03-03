'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';

/**
 * 获取客户端标识符（IP或指纹）
 * 注意：客户端无法获取真实IP，使用浏览器指纹作为替代
 */
function getClientIdentifier(): string {
  if (typeof window === 'undefined') return 'server';
  
  // 使用 localStorage 中的设备ID或生成临时ID
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<number>(0);
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const redirectPath = searchParams.get('redirect') || '/home';

  // 检查速率限制状态
  useEffect(() => {
    const identifier = getClientIdentifier();
    const result = checkRateLimit(identifier);
    
    if (!result.allowed) {
      setIsRateLimited(true);
      setRateLimitReset(result.resetTime);
    }
  }, []);

  // 倒计时显示
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

  /**
   * 处理登录表单提交
   */
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // 🔐 安全加固：检查速率限制
    const identifier = getClientIdentifier();
    const rateLimitResult = checkRateLimit(identifier);
    
    if (!rateLimitResult.allowed) {
      const remainingMinutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000);
      setError(`登录尝试次数过多，请 ${remainingMinutes} 分钟后再试`);
      setIsRateLimited(true);
      setRateLimitReset(rateLimitResult.resetTime);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // 🔐 登录成功：重置速率限制
      const { resetRateLimit } = await import('@/lib/security/rateLimit');
      resetRateLimit(identifier);

      // 登录成功，先刷新再跳转
      router.refresh();
      router.push(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      
      // 🔐 安全加固：记录失败次数
      const newResult = checkRateLimit(identifier);
      
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        if (errorMessage.includes('Invalid login credentials')) {
          const remaining = newResult.remaining;
          setError(`邮箱或密码错误，请检查后重试。剩余尝试次数：${remaining}`);
        } else if (errorMessage.includes('Email not confirmed')) {
          setError('邮箱未验证，请检查邮箱并点击验证链接。');
        } else if (errorMessage.includes('User not found')) {
          setError('该账号不存在，请先注册。');
        } else if (errorMessage.includes('Too many requests')) {
          setError('请求过于频繁，请稍后再试。');
        } else {
          setError('登录失败：' + errorMessage);
        }
      } else {
        setError('登录失败，请检查邮箱和密码');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 格式化剩余时间
  const formatRemainingTime = () => {
    if (rateLimitReset === 0) return '';
    const remaining = Math.ceil((rateLimitReset - Date.now()) / 60000);
    return remaining > 0 ? `${remaining} 分钟` : '即将';
  };

  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      {/* 左侧品牌区域（桌面端） */}
      <BrandSection />

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* 移动端品牌标题 */}
          <MobileBrandTitle />

          {/* 表单卡片 */}
          <FormCard title="欢迎回来">
            {/* 🔐 速率限制警告 */}
            {isRateLimited && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm">
                <p className="font-medium">登录尝试次数过多</p>
                <p>请 {formatRemainingTime()} 后再试</p>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* 账号输入 */}
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

              {/* 密码输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">密码</label>
                <input
                  type="password"
                  name="password"
                  id="login-password"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="•••••••"
                  required
                  disabled={isLoading || isRateLimited}
                  minLength={8}
                />
              </div>

              {/* 记住我和忘记密码 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" disabled={isLoading} />
                  <span>记住我</span>
                </label>
                <Link href="/forgot-password" className="text-xf-info hover:text-xf-accent transition font-medium">
                  忘记密码?
                </Link>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading || isRateLimited}
                className="w-full bg-xf-primary hover:bg-xf-accent disabled:bg-xf-primary/50 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:cursor-not-allowed"
              >
                {isLoading ? <span className="loading-dots">登录中</span> : '登 录'}
              </button>
            </form>

            {/* 切换到注册 */}
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
