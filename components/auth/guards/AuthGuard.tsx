'use client';

/**
 * 认证守卫组件
 * @module components/auth/AuthGuard
 * @description 统一处理认证状态，控制布局和内容的显示
 *
 * @特性
 * - 已登录：显示完整布局和内容
 * - 未登录：显示布局框架，内容区由子组件控制
 * - 保持侧边栏和导航可见
 * - 支持全局认证状态管理（Zustand）
 * - 拦截浏览器返回按钮，防止未登录用户回到认证页面
 *
 * @优化说明
 * - Sidebar 组件从全局 Store 获取用户信息
 * - 无需通过 props 传递用户数据
 * - 自动响应登录/登出状态变化
 * - 监听 popstate 事件，拦截浏览器返回操作
 */

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { useIsAuthenticated } from '@/hooks/auth/useAuth';

/**
 * 认证守卫组件属性
 * @interface AuthGuardProps
 */
interface AuthGuardProps {
  /** 子内容 */
  children: ReactNode;
}

/**
 * 认证守卫组件
 *
 * @param {AuthGuardProps} props - 组件属性
 * @returns {JSX.Element} 根据认证状态渲染的布局
 *
 * @优化说明
 * - 使用 useUserId Hook 获取用户 ID
 * - Sidebar 组件内部从全局 Store 获取完整用户信息
 * - 布局自动响应认证状态变化
 * - 监听 popstate 事件，拦截浏览器返回操作
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // 监听 popstate 事件，拦截浏览器返回操作
    const handlePopState = (e: PopStateEvent) => {
      // 未登录状态下，拦截返回操作并重定向到首页
      if (!isAuthenticated) {
        e.preventDefault();
        // 确保当前页面是首页
        if (window.location.pathname !== '/') {
          router.replace('/');
        }
        // 重置历史记录，防止再次返回
        window.history.replaceState(null, '', '/');
      }
    };

    // 添加事件监听器
    window.addEventListener('popstate', handlePopState);

    // 清理事件监听器
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, router]);

  return (
    <>
      {/* 桌面端：侧边栏布局 */}
      <div className="hidden lg:flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
      </div>

      {/* 移动端：底部导航布局 */}
      <div className="lg:hidden flex flex-col h-dvh bg-xf-light">
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </>
  );
}
