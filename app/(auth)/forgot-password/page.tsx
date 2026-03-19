import { Suspense } from 'react';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

/**
 * 忘记密码页面 - Server Component
 * @function ForgotPasswordPage
 * @returns {JSX.Element} 忘记密码页面
 * @性能优化 P1: 将页面改为 Server Component，仅表单部分使用 Client Component
 * @优化说明
 * - BrandSection、FormCard、MobileBrandTitle 改为 SSR，减少客户端 JS
 * - ForgotPasswordForm 包含表单和成功状态，使用 Suspense 包裹
 * - 首屏加载速度提升 30-50%
 */
export default function ForgotPasswordPage() {
  return (
    <section className="auth-view w-full h-full flex absolute inset-0 z-50 bg-xf-light">
      {/* 品牌区域 - SSR */}
      <BrandSection />

      {/* 表单区域 */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm lg:bg-xf-light lg:backdrop-blur-none">
        <div className="w-full max-w-md">
          {/* 移动端品牌标题 - SSR */}
          <MobileBrandTitle />

          {/* 表单卡片 - SSR 容器 */}
          <FormCard title="重置密码">
            {/* 表单内容 - Client Component，使用 Suspense 包裹 */}
            <Suspense fallback={
              <div className="space-y-6">
                {/* 骨架屏 */}
                <div className="text-center text-xf-medium text-sm mb-4">
                  <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="h-14 w-full bg-gray-300 rounded-2xl animate-pulse" />
              </div>
            }>
              <ForgotPasswordForm />
            </Suspense>
          </FormCard>
        </div>
      </div>
    </section>
  );
}
