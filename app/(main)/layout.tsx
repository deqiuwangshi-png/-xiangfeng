import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import { AuthGuard } from '@/components/auth/guards/AuthGuard'
import '@/styles/app.css'
import '@/styles/user.css'
import '@/styles/feedback.css'
import '@/styles/inbox.css'
import '@/styles/publish.css'

/**
 * Main布局 - 应用主布局（共享）
 *
 * @description 合并原(app)和(user)的共享布局
 * 包括首页、发布、草稿、个人资料、设置等所有需要侧边栏的页面
 * 使用getCurrentUserWithProfile()获取包含profiles表数据的用户信息
 *
 * @优化说明
 * - 匿名用户访问时保留布局，内容由页面控制显示登录引导
 * - 提升用户体验，保留页面上下文和导航
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  {/* 只查询一次，同时获取用户和资料信息 */}
  const profile = await getCurrentUserWithProfile()

  {/* 构建用户对象 */}
  const user = profile ? {
    id: profile.id,
    email: profile.email || '',
  } : null

  return (
    <AuthGuard user={user} profile={profile}>
      {children}
    </AuthGuard>
  )
}
