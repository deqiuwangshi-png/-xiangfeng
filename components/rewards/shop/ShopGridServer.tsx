import { ShoppingBag, ArrowRight } from '@/components/icons'
import { getCachedShopItems } from '@/lib/utils/cachedActions'
import type { ShopItem } from '@/types/rewards'

/**
 * 获取图标组件
 * @param {string} iconName - 图标名称
 * @returns {JSX.Element} 图标组件
 */
function getIconComponent(iconName: string): React.ElementType {
  // 这里可以根据需要返回不同的图标组件
  // 为了简化，我们暂时使用一个默认图标
  return ShoppingBag
}

/**
 * 兑换商城服务端组件
 * @param {Object} props - 组件属性
 * @param {number} props.userPoints - 用户当前积分
 * @returns {JSX.Element} 兑换商城面板
 */
export async function ShopGridServer({ userPoints }: { userPoints: number }) {
  // 服务端获取商品数据，使用缓存避免重复请求
  const items = await getCachedShopItems()
  
  // 只展示前6个商品
  const displayItems = items.slice(0, 6)

  return (
    <div className="card-bg rounded-2xl p-6 flex flex-col min-h-[380px]">
      <h2 className="text-xl font-serif font-bold text-xf-dark mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-xf-primary" />
        兑换商城
      </h2>

      {/* 商品网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
        {displayItems.map((item: ShopItem) => {
          const Icon = getIconComponent(item.icon_name)

          return (
            <div
              key={item.id}
              className="bg-xf-light/80 rounded-xl p-3 border border-transparent hover:border-xf-primary/30 hover:bg-white hover:shadow-soft transition cursor-pointer text-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: item.icon_color + '20' }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: item.icon_color }}
                />
              </div>
              <div className="font-medium text-sm mt-2 text-xf-dark truncate">
                {item.name}
              </div>
              <div className="text-xf-accent font-bold text-sm">
                {item.points_price}
              </div>
              <button
                className="mt-2 w-full text-xs py-1.5 rounded-full transition flex items-center justify-center gap-1 bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                disabled
              >
                即将上线
              </button>
            </div>
          )
        })}
      </div>

      {/* 更多商品链接 */}
      <div className="mt-4 text-right">
        <a
          href="/rewards/shop"
          className="text-xs text-xf-primary hover:text-xf-accent flex items-center justify-end gap-1"
        >
          更多商品
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
