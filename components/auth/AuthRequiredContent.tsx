'use client';

/**
 * 需要认证内容组件
 * @module components/auth/AuthRequiredContent
 * @description 通用未登录占位组件，居中显示登录引导
 *
 * @特性
 * - 简洁设计，居中显示
 * - 显示锁定图标和登录提示
 * - 提供登录和注册按钮
 * - 保留当前页面URL，登录后可返回
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, LogIn, UserPlus } from 'lucide-react';

/**
 * 需要认证内容组件属性
 * @interface AuthRequiredContentProps
 */
interface AuthRequiredContentProps {
  /** 自定义标题 */
  title?: string;
  /** 自定义描述 */
  description?: string;
}

/**
 * 需要认证内容组件
 *
 * @param {AuthRequiredContentProps} props - 组件属性
 * @returns {JSX.Element} 未登录引导界面
 */
export function AuthRequiredContent({
  title = '需要登录',
  description = '登录后即可访问此页面',
}: AuthRequiredContentProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  return (
    <div className="flex-1 flex items-center justify-center p-4 pt-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* 图标 */}
        <div className="w-16 h-16 bg-xf-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-xf-primary" />
        </div>

        {/* 标题 */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>

        {/* 描述 */}
        <p className="text-gray-500 mb-8">
          {description}
        </p>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <Link
            href={`/login?redirect=${redirectUrl}`}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-primary/90 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            立即登录
          </Link>

          <Link
            href={`/register?redirect=${redirectUrl}`}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            注册账号
          </Link>
        </div>
      </div>
    </div>
  );
}
