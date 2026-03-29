import { SettingsLayout } from '@/components/settings/_layout/SettingsLayout'
import { MobileHamburgerMenu } from '@/components/mobile/MobileHamburgerMenu'
import '@/styles/settings.css'
import { getCurrentUser } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { getContentSettings } from '@/lib/settings/actions/content'
import { getPrivacySettings } from '@/lib/settings/actions/privacy'
import { getNotificationSettings } from '@/lib/settings/actions/notifications'
import { getAppearanceSettings } from '@/lib/settings/actions/appearance'
import type { UserSettings } from '@/types/user/settings'

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
 * 用户资料查询结果类型（部分字段）
 */
interface UserProfileData {
  username: string
  avatar_url: string | null
  bio: string | null
  location: string | null
}

/**
 * 获取用户资料
 * @param userId - 用户ID
 * @returns 用户资料数据，失败时返回 null
 */
async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url, bio, location')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('获取用户资料失败:', error.message)
      return null
    }

    return data as UserProfileData
  } catch (err) {
    console.error('获取用户资料时发生异常:', err)
    return null
  }
}

/**
 * 默认用户设置
 * 当获取失败时作为降级方案
 */
const DEFAULT_USER_SETTINGS: UserSettings = {
  privacy: { profile_visibility: 'public' },
  notifications: {
    email: true,
    newFollowers: true,
    comments: true,
    likes: true,
    mentions: true,
    system: true,
    achievements: true,
  },
  appearance: { theme: 'auto', theme_background: 'default' },
  content: { content_language: 'zh-CN' },
}

export default async function SettingsPage() {
  // 初始化默认值，防止异常导致页面崩溃
  let user = null
  let profile: UserProfileData | null = null
  let userSettings: UserSettings = DEFAULT_USER_SETTINGS

  try {
    // 并行获取所有数据，减少总等待时间
    const [
      currentUser,
      privacyResult,
      notificationsResult,
      appearanceResult,
      contentResult,
    ] = await Promise.all([
      getCurrentUser(),
      getPrivacySettings(),
      getNotificationSettings(),
      getAppearanceSettings(),
      getContentSettings(),
    ])

    user = currentUser

    // 如果用户已登录，获取用户资料
    if (user) {
      profile = await getUserProfile(user.id)
    }

    // 组装所有设置数据
    userSettings = {
      privacy: privacyResult.success && privacyResult.settings
        ? { profile_visibility: privacyResult.settings.profileVisibility }
        : DEFAULT_USER_SETTINGS.privacy,
      notifications: notificationsResult.success && notificationsResult.settings
        ? {
            email: notificationsResult.settings.email ?? true,
            newFollowers: notificationsResult.settings.newFollowers ?? true,
            comments: notificationsResult.settings.comments ?? true,
            likes: notificationsResult.settings.likes ?? true,
            mentions: notificationsResult.settings.mentions ?? true,
            system: notificationsResult.settings.system ?? true,
            achievements: notificationsResult.settings.achievements ?? true,
          }
        : DEFAULT_USER_SETTINGS.notifications,
      appearance: appearanceResult.success && appearanceResult.settings
        ? {
            theme: appearanceResult.settings.theme,
            theme_background: appearanceResult.settings.theme_background,
          }
        : DEFAULT_USER_SETTINGS.appearance,
      content: contentResult.success && contentResult.content_language
        ? { content_language: contentResult.content_language }
        : DEFAULT_USER_SETTINGS.content,
    }
  } catch (err) {
    console.error('获取设置页面数据失败:', err)
    // 使用默认值继续渲染，避免页面崩溃
  }

  /**
   * 组装用户数据传递给客户端
   * 头像逻辑：只使用 profile.avatar_url，不再动态生成
   * 如果 avatar_url 为空，AvatarPlaceholder 组件会显示首字母占位符
   */
  const userData = user
    ? {
        id: user.id,
        email: user.email || '',
        username: profile?.username || user.email?.split('@')[0] || '用户',
        avatar_url: profile?.avatar_url || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
      }
    : null

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
      {/* 移动端顶部栏 */}
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <MobileHamburgerMenu />
        <h1 className="text-xl font-serif text-xf-accent font-bold">设置</h1>
      </div>

      <div className="max-w-7xl mx-auto fade-in-up">
        <SettingsLayout userData={userData} userSettings={userSettings} />
      </div>
    </main>
  )
}
