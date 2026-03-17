/**
 * 用户页面布局
 * 用于所有用户相关页面的布局（个人主页、设置、收益中心等）
 */

import { Sidebar } from '@/components/ui/Sidebar'
import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
import '@/styles/domains/user.css'
import '@/styles/domains/feedback.css'
import '@/styles/domains/inbox.css'

/**
 * User布局 - 用户相关页面共享布局
 * 
 * @description 用户中心页面的共享布局
 * 使用getCurrentUserWithProfile()获取包含profiles表数据的用户信息
 * 确保侧边栏头像与编辑个人资料页面保持一致
 * 
 * 性能优化：
 * - 只调用一次getCurrentUserWithProfile()，避免重复查询
 * - 从profile构建user对象，减少数据库往返
 */
export default async function UserLayout({
  children
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentUserWithProfile()

  if (!profile) {
    redirect('/login')
  }

  const user = {
    id: profile.id,
    email: profile.email,
  } as const

  return (
    <div className="flex h-screen bg-xf-light">
      <Sidebar user={user} profile={profile} />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  )
}
