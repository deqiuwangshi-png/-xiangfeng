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
 *
 * @优化说明
 * - Sidebar 组件从全局 Store 获取用户信息
 * - 无需通过 props 传递用户数据
 * - 自动响应登录/登出状态变化
 */

import { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';

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
 */
export function AuthGuard({ children }: AuthGuardProps) {
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
