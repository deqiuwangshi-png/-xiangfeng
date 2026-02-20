'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 处理注册表单提交
   * @param event - 表单提交事件
   */
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    // 跳转到登录页面
    window.location.href = '/login';
    alert('注册成功！请登录。');
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
            <form onSubmit={handleRegister} className="space-y-6">
              {/* 邮箱输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">邮箱</label>
                <input
                  type="email"
                  id="register-email"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* 用户名输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">用户名</label>
                <input
                  type="text"
                  id="register-username"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="选择用户名"
                  required
                />
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">密码</label>
                <input
                  type="password"
                  id="register-password"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="••••••"
                  required
                />
              </div>

              {/* 确认密码输入 */}
              <div>
                <label className="block text-xf-primary text-sm font-medium mb-2 ml-2">确认密码</label>
                <input
                  type="password"
                  id="register-confirm"
                  className="w-full px-6 py-4 rounded-2xl bg-xf-light border border-xf-bg/60 focus:border-xf-primary focus:bg-white focus:ring-2 focus:ring-xf-primary/20 outline-none transition-all text-xf-dark"
                  placeholder="••••••"
                  required
                />
              </div>

              {/* 服务条款 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-xf-medium cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
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
