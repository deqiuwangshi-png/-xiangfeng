import { SettingsLayout } from '@/components/settings/_layout/SettingsLayout'
import { MobileHamburgerMenu } from '@/components/mobile/MobileHamburgerMenu'
import '@/styles/domains/settings.css'
import { getCurrentUser } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { getContentSettings } from '@/lib/settings/actions'

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
 *   使用缓存的getCurrentUser()与布局共享用户数据
 * 更新时间: 2026-03-02
 */

export default async function SettingsPage() {
  // 获取当前用户数据 - 使用缓存函数
  const user = await getCurrentUser()

  // 从 profiles 表获取用户资料
  let profile = null
  if (user) {
    const supabase = await createClient()
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
    bio: (profile as { bio?: string })?.bio || '',
    location: (profile as { location?: string })?.location || '',
  } : null

  // 获取内容设置数据 - 避免客户端重复请求
  const contentSettingsResult = await getContentSettings()
  const contentSettings = contentSettingsResult.success
    ? { content_language: contentSettingsResult.content_language || 'zh-CN' }
    : { content_language: 'zh-CN' }

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative scroll-smooth">
      {/* 移动端顶部栏 */}
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <MobileHamburgerMenu />
        <h1 className="text-xl font-serif text-xf-accent font-bold">设置</h1>
      </div>

      <div className="max-w-7xl mx-auto fade-in-up">
        <SettingsLayout userData={userData} contentSettings={contentSettings} />
      </div>
    </main>
  )
}
