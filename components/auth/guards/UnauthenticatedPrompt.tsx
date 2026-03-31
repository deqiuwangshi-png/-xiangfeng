'use client';

/**
 * 未认证提示组件
 * @module components/auth/UnauthenticatedPrompt
 * @description 针对未登录用户的友好提示组件，用于需要登录才能使用的功能页面
 *
 * @设计原则
 * - 使用洞察图标（Lightbulb）配合文案引导
 * - 显示页面标题和描述，让用户知道该功能的价值
 * - 提供醒目的登录按钮
 * - 保留当前页面URL，登录后可返回
 * - 保持与页面风格一致的设计
 *
 * @使用场景
 * - 发布页 (publish)
 * - 文章管理页 (drafts)
 * - 消息通知页 (inbox)
 * - 福利中心页 (rewards)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, LogIn } from 'lucide-react';

/**
 * 未认证提示组件属性
 * @interface UnauthenticatedPromptProps
 */
interface UnauthenticatedPromptProps {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 自定义图标（可选，默认使用 Lightbulb） */
  icon?: React.ReactNode;
  /** 自定义提示文案（可选，默认使用"登录后管理你的文章"） */
  promptText?: string;
}

/**
 * 未认证提示组件
 *
 * @param {UnauthenticatedPromptProps} props - 组件属性
 * @returns {JSX.Element} 未登录引导界面
 */
export function UnauthenticatedPrompt({
  title,
  description,
  icon,
  promptText = '登录后管理你的文章',
}: UnauthenticatedPromptProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  return (
    <div className="flex-1 flex items-start justify-center p-4 sm:p-6 md:p-8" style={{ paddingTop: '45vh' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center" style={{ transform: 'translateY(-50%)' }}>
        {/* 洞察图标 */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-xf-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          {icon || (
            <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-xf-primary" />
          )}
        </div>

        {/* 页面标题 */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>

        {/* 页面描述 */}
        <p className="text-gray-500 mb-3">
          {description}
        </p>

        {/* 提示文案 */}
        <p className="text-sm text-xf-primary font-medium mb-8">
          {promptText}
        </p>

        {/* 登录按钮 */}
        <Link
          href={`/login?redirect=${redirectUrl}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          <LogIn className="w-5 h-5" />
          立即登录
        </Link>
      </div>
    </div>
  );
}

export default UnauthenticatedPrompt;
