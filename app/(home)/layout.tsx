import { AuthGuard } from '@/components/auth/guards/AuthGuard'
import { AuthProvider } from '@/components/providers'
import { getCurrentUserWithProfile } from '@/lib/auth/server'
import '@/styles/app.css'
import '@/styles/user.css'

/**
 * Home布局 - 首页专用布局（公开访问）
 *
 * @description 首页支持匿名用户访问，不需要强制登录
 * 但已登录用户仍能看到侧边栏和底部导航
 * @统一认证 使用与 (main)/layout.tsx 相同的 AuthProvider + AuthGuard 模式
 */
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  {/* 获取用户信息（可选）- 使用统一入口 */}
  const profile = await getCurrentUserWithProfile()

  {/* 构建用户对象传递给 AuthProvider */}
  const user = profile ? {
    id: profile.id,
    email: profile.email || '',
    user_metadata: {
      username: profile.username,
      avatar_url: profile.avatar_url,
    },
  } : null

  return (
    <AuthProvider initialUser={user} initialProfile={profile}>
      <AuthGuard>
        {children}
      </AuthGuard>
    </AuthProvider>
  )
}
