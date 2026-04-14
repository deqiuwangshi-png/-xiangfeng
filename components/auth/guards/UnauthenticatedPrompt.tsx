'use client';

/**
 * 未认证提示组件（纯文案版）
 * @module components/auth/UnauthenticatedPrompt
 * @description 针对未登录用户的文案提示组件，用于需要登录才能使用的功能页面
 */

import { Lightbulb } from 'lucide-react';

interface UnauthenticatedPromptProps {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 自定义图标（可选，默认使用 Lightbulb） */
  icon?: React.ReactNode;
  /** 自定义提示文案（可选） */
  promptText?: string;
}

export function UnauthenticatedPrompt({
  title,
  description,
  icon,
  promptText = '登录后使用此功能',
}: UnauthenticatedPromptProps) {
  return (
    <div className="flex-1 flex items-start justify-center p-4 sm:p-6 md:p-8" style={{ paddingTop: '40vh' }}>
      <div className="w-full max-w-md text-center" style={{ transform: 'translateY(-50%)' }}>
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
        <p className="text-sm text-xf-primary font-medium">
          {promptText}
        </p>
      </div>
    </div>
  );
}

export default UnauthenticatedPrompt;
