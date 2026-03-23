import { Sidebar } from '@/components/ui/Sidebar'
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav'
import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
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
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  {/* 只查询一次，同时获取用户和资料信息 */}
  const profile = await getCurrentUserWithProfile()

  {/* 如果未登录，重定向到登录页 */}
  if (!profile) {
    redirect('/login')
  }

  {/* 从profile构建user对象，避免重复查询 */}
  const user = {
    id: profile.id,
    email: profile.email,
  } as const

  return (
    <>
      {/* 桌面端：侧边栏布局 */}
      <div className="hidden lg:flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
        <Sidebar user={user} profile={profile} />
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
      </div>

      {/* 移动端：底部导航布局 - 使用 h-dvh 适配移动端视口 */}
      <div className="lg:hidden flex flex-col h-dvh bg-xf-light">
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
        <MobileBottomNav userId={user.id} />
      </div>
    </>
  )
}
