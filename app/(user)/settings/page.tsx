import { SettingsLayout } from '@/components/settings/SettingsLayout'
import '@/styles/domains/settings.css'
import { createClient } from '@/lib/supabase/server'

/**
 * 设置页面主入口（Server Component）
 * 
 * 作用: 获取用户设置数据并渲染设置页面
 * 
 * @returns {JSX.Element} 设置页面
 * 
 * 使用说明:
 *   作为设置页面的入口点
 *   获取用户设置数据
 *   将数据传递给客户端组件
 * 
 * 架构说明:
 *   - 不使用'use client'指令
 *   - 直接访问数据库（通过服务层）
 *   - 不使用客户端hooks
 *   - 使用async/await
 *   - 将数据传递给客户端组件
 * 
 * 更新时间: 2026-03-02
 */

export default async function SettingsPage() {
  // 获取当前用户数据
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 从 profiles 表获取用户资料
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // 组装用户数据传递给客户端
  const userData = user ? {
    id: user.id,
    email: user.email || '',
    username: profile?.username || user.email?.split('@')[0] || '用户',
    avatar_url: profile?.avatar_url || '',
    bio: (profile as any)?.bio || '',
    location: (profile as any)?.location || '',
  } : null

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-10 pt-10 pb-24 relative scroll-smooth">
      <div className="max-w-7xl mx-auto fade-in-up">
        <SettingsLayout userData={userData} />
      </div>
    </main>
  )
}
