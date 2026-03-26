import { SettingsLayout } from '@/components/settings/_layout/SettingsLayout'
import { MobileHamburgerMenu } from '@/components/mobile/MobileHamburgerMenu'
import '@/styles/settings.css'
import { getCurrentUser } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { getContentSettings } from '@/lib/settings/actions'

/**
 * 强制动态渲染
 * @description 由于使用了 cookies() 获取用户会话，无法进行静态生成
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-dynamic'

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
 * 更新时间: 2026-03-25
 */

/**
 * 获取用户资料（并行执行）
 * @param userId - 用户ID
 * @returns 用户资料数据
 */
async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export default async function SettingsPage() {
  // 并行获取用户数据和内容设置，减少总等待时间
  const [user, contentSettingsResult] = await Promise.all([
    getCurrentUser(),
    getContentSettings()
  ])

  // 如果用户已登录，并行获取用户资料
  const profile = user ? await getUserProfile(user.id) : null

  /**
   * 组装用户数据传递给客户端
   * 头像逻辑：只使用 profile.avatar_url，不再动态生成
   * 如果 avatar_url 为空，AvatarPlaceholder 组件会显示首字母占位符
   */
  const userData = user ? {
    id: user.id,
    email: user.email || '',
    username: profile?.username || user.email?.split('@')[0] || '用户',
    avatar_url: profile?.avatar_url || '',
    bio: (profile as { bio?: string })?.bio || '',
    location: (profile as { location?: string })?.location || '',
  } : null

  // 处理内容设置数据
  const contentSettings = contentSettingsResult.success
    ? { content_language: contentSettingsResult.content_language || 'zh-CN' }
    : { content_language: 'zh-CN' }

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
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
