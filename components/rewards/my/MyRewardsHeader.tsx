import Link from 'next/link'
import { Archive, ArrowLeft } from '@/components/icons'

/**
 * 我的灵感币中心头部组件 (Server Component)
 * @module components/rewards/my/MyRewardsHeader
 * @description 历史记录页面头部，服务端渲染静态内容
 * @优化说明 从RwCenter提取为Server Component，减少客户端JS体积
 */

/**
 * 我的灵感币中心头部组件
 * @returns {JSX.Element} 页面头部
 */
export function MyRewardsHeader() {
  return (
    <>
      {/* 页头 + 返回链接 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1 flex items-center gap-2">
            <Archive className="w-7 h-7 text-xf-primary" />
            历史记录
          </h1>
          <p className="text-xf-primary mt-1 text-sm">查看您的灵感币变动与兑换历史</p>
        </div>
        <Link
          href="/rewards"
          className="text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> 返回福利中心
        </Link>
      </div>
    </>
  )
}
