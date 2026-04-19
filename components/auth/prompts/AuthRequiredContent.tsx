'use client';

/**
 * 需要认证内容组件
 * @module components/auth/AuthRequiredContent
 * @description 通用未登录占位组件，居中显示登录引导
 *
 * @特性
 * - 简洁设计，居中显示
 * - 显示锁定图标和登录提示
 * - 提供登录和注册按钮（可配置显示/隐藏）
 * - 保留当前页面URL，登录后可返回
 * - 支持纯文案模式（无按钮）
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, LogIn, UserPlus, Lightbulb } from 'lucide-react';

/**
 * 需要认证内容组件属性
 * @interface AuthRequiredContentProps
 */
interface AuthRequiredContentProps {
  /** 自定义标题 */
  title?: string;
  /** 自定义描述 */
  description?: string;
  /** 自定义图标（可选，默认使用 Lock） */
  icon?: React.ReactNode;
  /** 是否显示操作按钮（默认 true） */
  showActions?: boolean;
  /** 自定义提示文案（纯文案模式下使用） */
  promptText?: string;
  /** 是否使用垂直居中布局（默认 true） */
  centered?: boolean;
}

/**
 * 需要认证内容组件
 */
export function AuthRequiredContent({
  title = '需要登录',
  description = '登录后即可访问此页面',
  icon,
  showActions = true,
  promptText,
  centered = true,
}: AuthRequiredContentProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  // 垂直居中布局（带卡片背景）
  if (centered && showActions) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 pt-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* 图标 */}
          <div className="w-16 h-16 bg-xf-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {icon || <Lock className="w-8 h-8 text-xf-primary" />}
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

  // 纯文案模式（无按钮，无卡片背景）- 兼容 UnauthenticatedPrompt
  return (
    <div className="flex-1 flex items-start justify-center p-4 sm:p-6 md:p-8" style={{ paddingTop: '40vh' }}>
      <div className="w-full max-w-md text-center" style={{ transform: 'translateY(-50%)' }}>
        {/* 图标 */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-xf-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          {icon || (
            <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-xf-primary" />
          )}
        </div>

        {/* 标题 */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>

        {/* 描述 */}
        <p className="text-gray-500 mb-3">
          {description}
        </p>

        {/* 提示文案 */}
        {promptText && (
          <p className="text-sm text-xf-primary font-medium">
            {promptText}
          </p>
        )}

        {/* 可选的操作按钮 */}
        {showActions && (
          <div className="mt-6 space-y-3">
            <Link
              href={`/login?redirect=${redirectUrl}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-primary/90 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              立即登录
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 未认证提示组件（纯文案版）
 * @deprecated 请使用 AuthRequiredContent 组件，设置 showActions={false}
 */
export function UnauthenticatedPrompt({
  title,
  description,
  icon,
  promptText = '登录后使用此功能',
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  promptText?: string;
}) {
  return (
    <AuthRequiredContent
      title={title}
      description={description}
      icon={icon}
      showActions={false}
      promptText={promptText}
      centered={false}
    />
  );
}

export default AuthRequiredContent;
