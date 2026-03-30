import { HelpCircle } from '@/components/icons';
import { FeedbackClient } from '@/components/feedback/FeedbackClient';
import { AuthRequiredContent } from '@/components/auth/guards/AuthRequiredContent';
import { getCurrentUser } from '@/lib/auth/user';

/**
 * 反馈页面 (Server Component)
 * @module app/(main)/feedback/page
 * @description 产品反馈页面，需要登录才能访问
 * @统一认证 添加认证检查，与其他页面保持一致
 */

/**
 * 反馈页面
 * @returns {JSX.Element} 反馈页面
 */
export default async function FeedbackPage() {
  // 获取当前登录用户 - 使用统一入口
  const user = await getCurrentUser()

  // 未登录状态：显示登录引导
  if (!user) {
    return (
      <AuthRequiredContent
        title="产品反馈"
        description="登录后提交反馈，帮助我们改进产品"
      />
    )
  }

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
