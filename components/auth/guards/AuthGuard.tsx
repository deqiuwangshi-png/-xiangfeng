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
 */

import { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import type { UserProfile } from '@/types/user';

/**
 * 简化用户对象接口
 * @interface SimpleUser
 */
interface SimpleUser {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    avatar_url?: string;
  };
}

/**
 * 认证守卫组件属性
 * @interface AuthGuardProps
 */
interface AuthGuardProps {
  /** 子内容 */
  children: ReactNode;
  /** 当前用户 */
  user: SimpleUser | null;
  /** 用户资料 */
  profile: UserProfile | null;
}

/**
 * 认证守卫组件
 *
 * @param {AuthGuardProps} props - 组件属性
 * @returns {JSX.Element} 根据认证状态渲染的布局
 */
export function AuthGuard({ children, user, profile }: AuthGuardProps) {
  return (
    <>
      {/* 桌面端：侧边栏布局 */}
      <div className="hidden lg:flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
        <Sidebar user={user} profile={profile} />
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
      </div>

      {/* 移动端：底部导航布局 */}
      <div className="lg:hidden flex flex-col h-dvh bg-xf-light">
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
        <MobileBottomNav userId={user?.id} />
      </div>
    </>
  );
}
