/**
 * 积分商城子页面
 * @module app/(main)/rewards/shop/page
 * @description 积分商城子页面，展示所有可兑换商品
 * @优化说明 改为Server Component，服务端获取商品列表和积分数据，减少客户端JS体积
 */

import { ShopHeader } from '@/components/rewards/shop/ShopHeader'
import { ShopServerGrid } from '@/components/rewards/shop/ShopServerGrid'
import { ShopCategoryNav } from '@/components/rewards/shop/ShopCategoryNav'
import { MobileBackButton } from '@/components/mobile/MobileBackButton'
import { getUserPointsOverview } from '@/lib/rewards/actions/points'
import type { ShopItemCategory } from '@/types/rewards'

/**
 * 积分商城页面
 * @param {Object} searchParams - 查询参数
 * @returns {JSX.Element} 积分商城页面
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 获取分类参数
  const params = await searchParams
  const category = (params.category as ShopItemCategory | 'all' | undefined) || 'all'

  // 并行获取积分数据
  const overview = await getUserPointsOverview()
  const currentPoints = overview?.current_points ?? 0

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <MobileBackButton href="/rewards" title="积分商城" />

      <div className="max-w-6xl mx-auto fade-in-up px-6 md:px-10 pt-8 pb-12">
        {/* 静态头部 - Server Component渲染 */}
        <ShopHeader currentPoints={currentPoints} />

        {/* 分类导航 - Client Component */}
        <ShopCategoryNav activeCategory={category} />

        {/* 商品网格 - Server Component渲染 */}
        <ShopServerGrid category={category} userPoints={currentPoints} />

        {/* 底部留白 */}
        <div className="mt-8 text-center text-sm text-xf-primary">
          每一份兑换都是对自己的小小奖励
        </div>
      </div>
    </div>
  )
}
