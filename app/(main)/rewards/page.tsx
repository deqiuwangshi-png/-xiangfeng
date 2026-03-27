import { RwClient } from '@/components/rewards/RwClient'
import { AuthRequiredContent } from '@/components/auth/AuthRequiredContent'
import { getCurrentUserWithProfile } from '@/lib/supabase/user'

/**
 * 福利中心页面
 * @module app/(main)/rewards/page
 * @description 福利中心主页面，支持未登录状态显示登录引导
 */

/**
 * 福利中心页面
 * @returns {JSX.Element} 福利中心页面
 */
export default async function RewardsPage() {
  const profile = await getCurrentUserWithProfile()

  {/* 未登录状态：显示登录引导 */}
  if (!profile) {
    return (
      <AuthRequiredContent
        title="福利中心"
        description="登录后领取专属福利"
      />
    )
  }

  return <RwClient />
}
