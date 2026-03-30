import { HelpCircle } from '@/components/icons';
import { FeedbackClient } from '@/components/feedback/FeedbackClient';

/**
 * 反馈页面 (Server Component)
 * @module app/(main)/feedback/page
 * @description 产品反馈页面，需要登录才能访问
 *
 * @统一认证 2026-03-30
 * - 认证检查已移至 (main)/layout.tsx
 * - 此页面不再需要单独检查登录状态
 */

/**
 * 反馈页面
 * @returns {JSX.Element} 反馈页面
 */
export default async function FeedbackPage() {

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 pt-4 sm:pt-6 pb-20">
      {/* 页面标题 - Server Component渲染 */}
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-xf-accent font-bold mb-1">
            反馈帮助
          </h1>
          <p className="text-sm sm:text-base text-xf-primary">
            帮助我们一起打磨产品
          </p>
        </div>
        <a
          href="#faq"
          className="text-xs sm:text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          反馈前搜索
        </a>
      </div>

      {/* 客户端交互区域 */}
      <FeedbackClient />
    </div>
  );
}
