import { getCachedShopItems } from '@/lib/utils/cachedActions'
import { ShopExchangeButton } from './ShopExchangeButton'
import type { ShopItemCategory } from '@/types/rewards'

/**
 * 积分商城商品网格服务端组件
 * @module components/rewards/shop/ShopServerGrid
 * @description 服务端渲染商品列表，只负责展示，兑换交互由客户端组件处理
 * @优化说明 改为Server Component，减少客户端JS体积
 */

interface ShopServerGridProps {
  /** 分类筛选 */
  category?: ShopItemCategory | 'all'
  /** 用户当前积分 */
  userPoints?: number
}

/**
 * 获取图标组件
 * @param {string} iconName - 图标名称
 * @returns {string} 图标emoji
 */
function getIconEmoji(iconName: string): string {
  const iconMap: Record<string, string> = {
    Gift: '🎁',
    Ticket: '🎫',
    Coffee: '☕',
    Shirt: '👕',
    Book: '📚',
    Star: '⭐',
    Crown: '👑',
    Zap: '⚡',
    Heart: '❤️',
    Sparkles: '✨',
  }
  return iconMap[iconName] || '🎁'
}

/**
 * 积分商城商品网格服务端组件
 * @param {ShopServerGridProps} props - 组件属性
 * @returns {JSX.Element} 商品网格
 */
export async function ShopServerGrid({ category = 'all', userPoints = 0 }: ShopServerGridProps) {
  // 服务端获取商品列表，使用缓存避免重复请求
  const items = await getCachedShopItems(
    category === 'all' ? undefined : (category as ShopItemCategory)
  )

  // 空状态
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-xf-primary">
        <div className="text-4xl mb-2">🛍️</div>
        <div className="text-sm">暂无商品</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const canAfford = userPoints >= item.points_price
        const iconEmoji = getIconEmoji(item.icon_name || 'Gift')

        return (
          <div
            key={item.id}
            className="card-bg rounded-xl p-4 flex flex-col hover:border-xf-primary/20 transition-colors"
          >
            {/* 图标 */}
            <div className="w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center mx-auto text-2xl">
              {iconEmoji}
            </div>

            {/* 商品信息 */}
            <div className="mt-3 text-center flex-1">
              <h3 className="font-medium text-xf-dark text-sm line-clamp-1">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-xs text-xf-medium mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* 积分和兑换按钮 */}
            <div className="mt-3 pt-3 border-t border-xf-bg">
              <div className="flex items-center justify-between">
                <span className="text-xf-accent font-bold text-sm">
                  {item.points_price}
                </span>
                <ShopExchangeButton
                  itemId={item.id}
                  itemName={item.name}
                  pointsCost={item.points_price}
                  userPoints={userPoints}
                  canAfford={canAfford}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
