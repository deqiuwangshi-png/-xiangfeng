/**
 * 积分商城子页面
 * @module app/(main)/rewards/shop/page
 * @description 积分商城子页面，展示所有可兑换商品
 */

import { ShopClient } from '@/components/rewards/shop/ShopClient'
import { MobileBackButton } from '@/components/mobile/MobileBackButton'

/**
 * 积分商城页面
 * @returns {JSX.Element} 积分商城页面
 */
export default function ShopPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <MobileBackButton href="/rewards" title="积分商城" />
      <ShopClient />
    </div>
  )
}
