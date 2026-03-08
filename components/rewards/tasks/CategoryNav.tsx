'use client'

/**
 * 分类导航组件
 * @module components/rewards/CategoryNav
 * @description 任务分类横向滚动导航
 */

/**
 * 分类类型
 * @type CategoryType
 */
type CategoryType = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'event'

/**
 * 分类导航Props
 * @interface CategoryNavProps
 */
interface CategoryNavProps {
  /** 当前选中分类 */
  activeCategory: CategoryType
  /** 分类切换回调 */
  onCategoryChange: (category: CategoryType) => void
  /** 分类配置 */
  categories: Record<CategoryType, string>
}

/**
 * 分类导航组件
 * @param {CategoryNavProps} props - 组件属性
 * @returns {JSX.Element} 分类导航
 */
export function CategoryNav({ activeCategory, onCategoryChange, categories }: CategoryNavProps) {
  return (
    <div className="overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {(Object.keys(categories) as CategoryType[]).map((key) => (
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
