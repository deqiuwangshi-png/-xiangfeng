'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * 认证布局组件
 * 提供统一的认证页面布局和样式
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-xf-dark mb-2">欢迎来到香枫</h1>
          <p className="text-xf-medium">开始您的创作之旅</p>
        </div>
        {children}
      </div>
    </div>
  );
}