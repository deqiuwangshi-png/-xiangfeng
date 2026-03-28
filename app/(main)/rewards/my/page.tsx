/**
 * 我的灵感币中心页面
 * @module app/(main)/rewards/my/page
 * @description 显示用户的灵感币记录和兑换记录
 * @优化说明 改为Server Component，服务端获取数据，减少客户端JS体积
 */

import { MyRewardsHeader } from '@/components/rewards/my/MyRewardsHeader'
import { PtRecordServer } from '@/components/rewards/my/PtRecordServer'
import { RwRecordServer } from '@/components/rewards/my/RwRecordServer'
import { MyRewardsTabNav } from '@/components/rewards/my/MyRewardsTabNav'
import { MobileBackButton } from '@/components/mobile/MobileBackButton'
import type { ExchangeStatus } from '@/types/rewards'

/**
 * Tab类型
 * @type TabType
 */
type TabType = 'points' | 'rewards'

/**
 * 我的灵感币中心页面
 * @param {Object} searchParams - 查询参数
 * @returns {JSX.Element} 我的灵感币中心页面
 */
export default async function MyRewardsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 获取Tab和筛选参数
  const params = await searchParams
  const activeTab = (params.tab as TabType) || 'points'
  const pointsFilter = (params.pointsFilter as 'all' | 'earn' | 'spend') || 'all'
  const rewardsFilter = (params.rewardsFilter as 'all' | ExchangeStatus) || 'all'
  const pointsPage = parseInt((params.pointsPage as string) || '1', 10)
  const rewardsPage = parseInt((params.rewardsPage as string) || '1', 10)

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <MobileBackButton href="/rewards" title="我的灵感币" />

      <div className="max-w-6xl mx-auto fade-in-up px-6 md:px-10 pt-8 pb-12">
        {/* 静态头部 - Server Component渲染 */}
        <MyRewardsHeader />

        {/* Tab导航 - Client Component */}
        <MyRewardsTabNav activeTab={activeTab} />

        {/* 内容区域 */}
        <div className="card-bg rounded-2xl p-6">
          {activeTab === 'points' ? (
            <PtRecordServer filter={pointsFilter} page={pointsPage} />
          ) : (
            <RwRecordServer filter={rewardsFilter} page={rewardsPage} />
          )}
        </div>

        {/* 底部留白 */}
        <div className="mt-8 text-center text-sm text-xf-primary">
          每一次记录都是成长的足迹
        </div>
      </div>
    </div>
  )
}
