import type { Metadata } from 'next';
import '@/styles/auth.css';

export const metadata: Metadata = {
  title: '登录注册 | 相逢',
  description: '相逢 - 深度思考者生态，不止相遇，更是改变',
};

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
