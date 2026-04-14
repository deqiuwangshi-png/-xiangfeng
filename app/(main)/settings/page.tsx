import { SettingsLayout } from '@/components/settings'
import { requireAuth } from '@/lib/auth/server'
import {
  getContentSettings,
  getPrivacySettings,
  getNotificationSettings,
  getAppearanceSettings,
} from '@/lib/settings/actions'
import { getUserProfile } from '@/lib/settings/queries'
import { assembleUserSettings, buildUserData } from '@/lib/settings/utils/settings'
import { createClient } from '@/lib/supabase/server'
import '@/styles/settings.css'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await requireAuth()

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
      <div className="max-w-7xl mx-auto fade-in-up">
        <SettingsLayout userData={userData} userSettings={userSettings} />
      </div>
    </main>
  )
}
