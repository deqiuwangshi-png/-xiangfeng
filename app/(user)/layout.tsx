/**
 * 用户页面布局
 * 用于所有用户相关页面的布局
 */

import { Sidebar } from '@/components/ui/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import '@/styles/domains/user.css'
import '@/styles/domains/earnings.css'
import '@/styles/domains/feedback.css'
import '@/styles/domains/inbox.css'

export default async function UserLayout({
  children
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
    <div className="flex h-screen bg-xf-light">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  )
}
