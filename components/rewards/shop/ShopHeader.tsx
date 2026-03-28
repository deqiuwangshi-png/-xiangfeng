import Link from 'next/link'
import { ArrowLeft, Coins } from '@/components/icons'

/**
 * 积分商城头部组件 (Server Component)
 * @module components/rewards/shop/ShopHeader
 * @description 积分商城页面头部，服务端渲染静态内容
 * @优化说明 从ShopClient提取为Server Component，减少客户端JS体积
 */

interface ShopHeaderProps {
  /** 当前积分 */
  currentPoints?: number
}

/**
 * 积分商城头部组件
 * @param {ShopHeaderProps} props - 组件属性
 * @returns {JSX.Element} 页面头部
 */
export function ShopHeader({ currentPoints }: ShopHeaderProps) {
  // 显示积分，如果没有数据则显示占位符
  const displayPoints = currentPoints !== undefined ? currentPoints : '-'

  return (
    <>
      {/* 页头 + 返回链接 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            灵感币商城
          </h1>
          <p className="text-xf-primary mt-1 text-sm">浏览所有可兑换商品，消耗灵感币兑换好礼</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 当前积分显示 */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-soft">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-xf-dark">
              {displayPoints}
            </span>
          </div>
          <Link
            href="/rewards"
            className="text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" /> 返回福利中心
          </Link>
        </div>
      </div>
    </>
  )
}
