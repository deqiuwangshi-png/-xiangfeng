'use client'

/**
 * 积分总览组件
 * @module components/rewards/overview/PtOverview
 * @description 显示用户当前积分、累计获得和已兑换积分
 */

import { memo } from 'react'
import { Loader2 } from '@/components/icons'

/**
 * 积分总览Props
 * @interface PtOverviewProps
 */
interface PtOverviewProps {
  /** 当前积分 */
  points: number
  /** 累计获得积分 */
  totalEarned: number
  /** 已兑换积分 */
  totalSpent: number
  /** 是否首次加载中 */
  isLoading?: boolean
  /** 是否在后台验证更新中 */
  isValidating?: boolean
}

/**
 * 积分总览组件
 * @param {PtOverviewProps} props - 组件属性
 * @returns {JSX.Element} 积分总览卡片
 */
export const PtOverview = memo(function PtOverview({
  points,
  totalEarned,
  totalSpent,
  isLoading,
  isValidating
}: PtOverviewProps) {
  /**
   * 格式化数字显示
   * @param {number} num - 数字
   * @returns {string} 格式化后的字符串
   */
  const formatNum = (num: number) => num.toLocaleString()

  // 骨架屏状态：仅当真正无数据且加载中显示
  // 注意：有缓存时 isLoading 可能瞬间为 true，但 points > 0，此时不显示骨架屏
  const showSkeleton = isLoading && points === 0 && totalEarned === 0

  if (showSkeleton) {
    return (
      <div className="bg-white rounded-2xl shadow-soft px-6 py-3 flex items-center gap-6 border border-xf-bg/30">
        <div className="flex items-center gap-2 text-xf-primary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">加载中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft px-6 py-3 flex items-center gap-6 border border-xf-bg/30">
      <div>
        <span className="text-xs text-xf-primary">我的积分</span>
        <div className="text-3xl font-bold text-xf-accent">
          {formatNum(points)}
          {/* 后台更新时显示小圆点 */}
          {isValidating && (
            <span className="ml-2 inline-block w-2 h-2 bg-xf-primary rounded-full animate-pulse" />
          )}
        </div>
      </div>
      <div className="h-8 w-px bg-xf-bg" />
      <div className="text-sm space-y-0.5">
        <div className="text-xf-medium">
          累计获得 <span className="font-bold text-xf-dark">{formatNum(totalEarned)}</span>
        </div>
        <div className="text-xf-medium">
          已兑换 <span className="font-bold text-xf-dark">{formatNum(totalSpent)}</span>
        </div>
      </div>
    </div>
  )
})
