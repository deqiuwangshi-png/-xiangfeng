import { createAuthMetadata } from '@/lib/seo';
import '@/styles/auth.css';

/**
 * 认证页面Metadata
 * @description 使用统一SEO配置
 */
export const metadata = createAuthMetadata('登录注册');

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}
