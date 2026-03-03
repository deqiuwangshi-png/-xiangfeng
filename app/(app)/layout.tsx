import { Sidebar } from '@/components/ui/Sidebar'
import { getCurrentUser } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
import '@/styles/domains/app.css'

/**
 * App布局 - 应用主布局
 * 
 * @description 应用内页面的共享布局，包括首页、发布、草稿等
 * 使用缓存的getCurrentUser()避免重复获取用户数据
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 使用缓存函数获取当前用户（同一请求内多次调用会复用结果）
  const user = await getCurrentUser()

  // 如果未登录，重定向到登录页
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
      <Sidebar user={user} />
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
        {children}
      </main>
    </div>
  )
}
