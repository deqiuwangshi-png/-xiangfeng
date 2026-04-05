import { SettingsLayout } from '@/components/settings'
import { UnauthenticatedPrompt } from '@/components/auth'
import { MobileHamburgerMenu } from '@/components/mobile'
import { getCurrentUser } from '@/lib/auth/server'
import {
  getContentSettings,
  getPrivacySettings,
  getNotificationSettings,
  getAppearanceSettings,
} from '@/lib/settings/actions'
import { getUserProfile } from '@/lib/settings/queries'
import { assembleUserSettings, buildUserData } from '@/lib/settings/utils/settings'
import { createClient } from '@/lib/supabase/server'
import { Settings as SettingsIcon } from 'lucide-react'
import '@/styles/settings.css'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <UnauthenticatedPrompt
        title="账户设置"
        description="管理你的隐私、通知与外观偏好"
        icon={<SettingsIcon className="w-8 h-8 sm:w-10 sm:h-10 text-xf-primary" />}
        promptText="登录后管理你的账户设置"
      />
    )
  }

  const supabase = await createClient()

  const [
    privacyResult,
    notificationsResult,
    appearanceResult,
    contentResult,
    profile,
  ] = await Promise.all([
    getPrivacySettings(),
    getNotificationSettings(),
    getAppearanceSettings(),
    getContentSettings(),
    getUserProfile(user.id, supabase),
  ])

  const { settings: userSettings } = assembleUserSettings(
    privacyResult,
    notificationsResult,
    appearanceResult,
    contentResult
  )

  const userData = buildUserData(user.id, user.email, profile)

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
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
