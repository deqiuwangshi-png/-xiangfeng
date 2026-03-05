/**
 * 用户页面布局
 * 用于所有用户相关页面的布局（个人主页、设置、收益中心等）
 */

import { Sidebar } from '@/components/ui/Sidebar'
import { getCurrentUser, getCurrentUserWithProfile } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
import '@/styles/domains/user.css'
import '@/styles/domains/earnings.css'
import '@/styles/domains/feedback.css'
import '@/styles/domains/inbox.css'

/**
 * User布局 - 用户相关页面共享布局
 * 
 * @description 用户中心页面的共享布局
 * 使用getCurrentUserWithProfile()获取包含profiles表数据的用户信息
 * 确保侧边栏头像与编辑个人资料页面保持一致
 */
export default async function UserLayout({
  children
}: {
  children: React.ReactNode
}) {
  // 获取当前用户及资料信息（包含profiles表数据）
  const user = await getCurrentUser()
  const profile = await getCurrentUserWithProfile()

  // 如果未登录，重定向到登录页
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-xf-light">
      <Sidebar user={user} profile={profile} />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  )
}
