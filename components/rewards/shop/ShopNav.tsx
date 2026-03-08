'use client'

import type { ShopCategoryType } from '@/types/rewards'

/**
 * 商城分类导航组件
 * @module components/rewards/ShopNav
 * @description 积分商城分类横向滚动导航
 */

/**
 * 商城分类导航Props
 * @interface ShopNavProps
 */
interface ShopNavProps {
  /** 当前选中分类 */
  activeCategory: ShopCategoryType
  /** 分类切换回调 */
  onCategoryChange: (category: ShopCategoryType) => void
  /** 分类配置 */
  categories: Record<ShopCategoryType, string>
}

/**
 * 商城分类导航组件
 * @param {ShopNavProps} props - 组件属性
 * @returns {JSX.Element} 分类导航
 */
export function ShopNav({ activeCategory, onCategoryChange, categories }: ShopNavProps) {
  return (
    <div className="overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {(Object.keys(categories) as ShopCategoryType[]).map((key) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`
              px-5 py-2 text-sm rounded-full border transition-all
              ${activeCategory === key
                ? 'bg-xf-accent text-white border-xf-accent'
                : 'bg-white border-xf-bg/60 text-xf-dark hover:bg-xf-light'
              }
            `}
          >
            {categories[key]}
          </button>
        ))}
      </div>
    </div>
  )
}
