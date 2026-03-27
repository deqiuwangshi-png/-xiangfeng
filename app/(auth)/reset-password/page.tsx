import { Suspense } from 'react';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

/**
 * 重置密码页面 - Server Component
 * @function ResetPasswordPage
 * @returns {JSX.Element} 重置密码页面
 * @特殊处理
 * - session 检查必须在客户端执行（需要访问浏览器存储）
 * - 添加 isChecking 状态显示骨架屏，避免页面闪烁
 */
export default function ResetPasswordPage() {
  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      {/* 品牌区域 - SSR */}
      <BrandSection />

      {/* 表单区域 */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* 移动端品牌标题 - SSR */}
          <MobileBrandTitle />

          {/* 表单卡片 - SSR 容器 */}
          <FormCard title="设置新密码">
            {/* 表单内容 - Client Component，使用 Suspense 包裹 */}
            <Suspense fallback={
              <div className="space-y-6">
                {/* 骨架屏 */}
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="h-14 w-full bg-gray-300 rounded-2xl animate-pulse" />
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </FormCard>
        </div>
      </div>
    </section>
  );
}
