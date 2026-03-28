'use client'

/**
 * 商品分类导航客户端组件
 * @module components/rewards/shop/ShopCategoryNav
 * @description 积分商城分类导航，使用URL参数进行筛选
 * @优化说明 使用URL参数替代useState，支持Server Component获取数据
 */

import { useRouter, useSearchParams } from 'next/navigation'
import type { ShopItemCategory } from '@/types/rewards'

/**
 * 分类类型
 * @type ShopCategoryType
 */
type ShopCategoryType = 'all' | ShopItemCategory

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
  skin: '皮肤',
}

interface ShopCategoryNavProps {
  /** 当前激活的分类 */
  activeCategory: ShopCategoryType
}

/**
 * 商品分类导航客户端组件
 * @param {ShopCategoryNavProps} props - 组件属性
 * @returns {JSX.Element} 分类导航
 */
export function ShopCategoryNav({ activeCategory }: ShopCategoryNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * 处理分类切换
   * @param {ShopCategoryType} category - 目标分类
   */
  const handleCategoryChange = (category: ShopCategoryType) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/rewards/shop?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {(Object.keys(categoryConfig) as ShopCategoryType[]).map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-xf-accent text-white shadow-md'
              : 'bg-white text-xf-primary hover:bg-xf-light'
          }`}
        >
          {categoryConfig[category]}
        </button>
      ))}
    </div>
  )
}
