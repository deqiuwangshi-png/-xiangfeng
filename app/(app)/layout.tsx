import { Sidebar } from '@/components/ui/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import '@/styles/domains/app.css'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 获取当前用户
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
