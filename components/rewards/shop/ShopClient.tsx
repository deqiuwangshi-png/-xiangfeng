'use client'

/**
 * 积分商城客户端组件
 * @module components/rewards/shop/ShopClient
 * @description 积分商城主客户端组件，管理分类筛选和商品展示
 */

import { useState } from 'react'
import { ArrowLeft, Coins, Link } from '@/components/icons'
import { ShopNav } from './ShopNav'
import { ShopFull } from './ShopFull'
import { usePoints } from '../hooks/usePoints'
import type { ShopCategoryType } from '@/types/rewards'

/**
 * 分类配置
 * @constant categoryConfig
 */
const categoryConfig: Record<ShopCategoryType, string> = {
  all: '全部',
  card: '卡券',
  merch: '周边',
  physical: '实体',
  lottery: '抽奖',
}

/**
 * 积分商城客户端组件
 * @returns {JSX.Element} 积分商城客户端组件
 */
export function ShopClient() {
  const [activeCategory, setActiveCategory] = useState<ShopCategoryType>('all')
  
  const { overview, isLoading } = usePoints()
  
  {/* 有缓存数据时立即显示，无需等待loading */}
  const currentPoints = overview?.current_points ?? 0
  const displayPoints = overview ? currentPoints : isLoading ? '-' : '0'

  return (
    <div className="max-w-6xl mx-auto fade-in-up px-6 md:px-10 pt-8 pb-12">
      {/* 页头 + 返回链接 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            积分商城
          </h1>
          <p className="text-xf-primary mt-1 text-sm">浏览所有可兑换商品，消耗积分兑换好礼</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 当前积分显示 - 有缓存时立即显示 */}
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

      {/* 分类导航 */}
      <ShopNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categoryConfig}
      />

      {/* 商品网格 */}
      <ShopFull category={activeCategory} userPoints={currentPoints} />

      {/* 底部留白 */}
      <div className="mt-8 text-center text-sm text-xf-primary">每一份兑换都是对自己的小小奖励</div>
    </div>
  )
}
