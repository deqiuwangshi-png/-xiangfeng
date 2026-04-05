import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUserWithProfile } from '@/lib/auth/server'
import { AuthGuard } from '@/components/auth/guards/AuthGuard'
import { AuthProvider } from '@/components/providers'
import '@/styles/app.css'
import '@/styles/user.css'
import '@/styles/feedback.css'
import '@/styles/inbox.css'
import '@/styles/publish.css'

/**
 * 需要登录才能访问的路由列表
 */
const REQUIRE_AUTH_ROUTES = [
  '/publish',
  '/drafts',
  '/inbox',
  '/settings',
  '/feedback',
  '/updates',
  '/rewards',
  '/profile',
]

/**
 * 检查路径是否需要登录
 */
function requiresAuth(pathname: string): boolean {
  return REQUIRE_AUTH_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

/**
 * Main布局 - 应用主布局（共享）
 *
 * @description 合并原(app)和(user)的共享布局
 * 包括首页、发布、草稿、个人资料、设置等所有需要侧边栏的页面
 * 使用统一入口 getCurrentUserWithProfile() 获取用户信息
 *
 * @统一认证 2026-03-30
 * - 恢复Layout层权限拦截机制，确保未登录用户无法访问受保护路由
 * - 未登录用户访问受保护路由时显示登录提示
 * - 已登录用户正常显示布局和内容
 * - 中间件仅保持会话同步，不做路由拦截
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  {/* 只查询一次，同时获取用户和资料信息 - 使用统一入口 */}
  const profile = await getCurrentUserWithProfile()

  {/* 获取当前路径 */}
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('next-url') || ''

  {/* 检查当前路径是否需要登录 */}
  const isAuthRequired = requiresAuth(pathname)

  {/* 未登录且需要登录的路由：重定向到首页 */}
  if (isAuthRequired && !profile) {
    redirect('/')
  }

  {/* 构建用户对象 */}
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
