import { Sidebar } from '@/components/ui/Sidebar'
import { getCurrentUser, getCurrentUserWithProfile } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
import '@/styles/domains/app.css'

/**
 * App布局 - 应用主布局
 * 
 * @description 应用内页面的共享布局，包括首页、发布、草稿等
 * 使用getCurrentUserWithProfile()获取包含profiles表数据的用户信息
 * 确保侧边栏头像与编辑个人资料页面保持一致
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  // 获取当前用户及资料信息（包含profiles表数据）
  const user = await getCurrentUser()
  const profile = await getCurrentUserWithProfile()

  // 如果未登录，重定向到登录页
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
      <Sidebar user={user} profile={profile} />
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
        {children}
      </main>
    </div>
  )
}
