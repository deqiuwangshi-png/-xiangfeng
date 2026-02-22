'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * 处理登录表单提交
   * @param event - 表单提交事件
   */
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 跳转到home页面（模拟测试）
    router.push('/home');
  }

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
            <form onSubmit={handleLogin} className="space-y-6">
              {/* 账号输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">账号</label>
                <input
                  type="email"
                  id="login-email"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">密码</label>
                <input
                  type="password"
                  id="login-password"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="•••••••"
                  required
                />
              </div>

              {/* 记住我和忘记密码 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span>记住我</span>
                </label>
                <Link href="/forgot-password" className="text-xf-info hover:text-xf-accent transition font-medium">
                  忘记密码?
                </Link>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-xf-primary hover:bg-xf-accent text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
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
