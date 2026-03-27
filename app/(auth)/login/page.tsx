import { Suspense } from 'react';
import { BrandSection } from '@/components/auth/BrandSection';
import { MobileBrandTitle } from '@/components/auth/MobileBrandTitle';
import { FormCard } from '@/components/auth/FormCard';
import { LoginForm } from '@/components/auth/LoginForm';

/**
 * 登录页面 - Server Component
 * @function LoginPage
 * @returns {JSX.Element} 登录页面
 */
export default function LoginPage() {
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
          <FormCard title="欢迎回来">
            {/* 表单内容 - Client Component，使用 Suspense 包裹 */}
            <Suspense fallback={
              <div className="space-y-6">
                {/* 骨架屏 */}
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="h-14 w-full bg-gray-300 rounded-2xl animate-pulse" />
              </div>
            }>
              <LoginForm />
            </Suspense>
          </FormCard>
        </div>
      </div>
    </section>
  );
}
