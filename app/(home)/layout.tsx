import { Sidebar } from '@/components/ui/Sidebar'
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav'
import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import '@/styles/app.css'
import '@/styles/user.css'

/**
 * Home布局 - 首页专用布局（公开访问）
 *
 * @description 首页支持匿名用户访问，不需要强制登录
 * 但已登录用户仍能看到侧边栏和底部导航
 */
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  {/* 获取用户信息（可选） */}
  const profile = await getCurrentUserWithProfile()

  {/* 从profile构建user对象 */}
  const user = profile ? {
    id: profile.id,
    email: profile.email,
  } : null

  return (
    <>
      {/* 桌面端：侧边栏布局 */}
      <div className="hidden lg:flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
        <Sidebar user={user} profile={profile} />
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
      </div>

      {/* 移动端：底部导航布局 */}
      <div className="lg:hidden flex flex-col h-dvh bg-xf-light">
        <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
          {children}
        </main>
        <MobileBottomNav userId={user?.id} />
      </div>
    </>
  )
}
