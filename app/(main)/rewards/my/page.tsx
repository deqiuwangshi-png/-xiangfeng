/**
 * 我的积分中心页面
 * @module app/(main)/rewards/my/page
 * @description 显示用户的积分记录和兑换记录
 */

import { RwCenter } from '@/components/rewards/my/RwCenter'
import { MobileBackButton } from '@/components/mobile/MobileBackButton'

/**
 * 我的积分中心页面
 * @returns {JSX.Element} 我的积分中心页面
 */
export default function MyRewardsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <MobileBackButton href="/rewards" title="我的积分" />
      <RwCenter />
    </div>
  )
}
