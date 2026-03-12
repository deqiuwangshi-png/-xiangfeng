'use client'

/**
 * 积分总览组件
 * @module components/rewards/overview/PtOverview
 * @description 显示用户当前积分、累计获得和已兑换积分
 */

import { memo, useMemo } from 'react'

/**
 * 数字显示组件（独立 memo 优化）
 * @interface PointsNumberProps
 */
interface PointsNumberProps {
  /** 数字值 */
  value: number
  /** 是否在后台更新中 */
  isValidating?: boolean
}

/**
 * 数字显示组件
 * @param {PointsNumberProps} props - 组件属性
 * @returns {JSX.Element} 数字元素
 */
const PointsNumber = memo(function PointsNumber({ value, isValidating }: PointsNumberProps) {
  const formatted = useMemo(() => value.toLocaleString(), [value])

  return (
    <div className="text-3xl font-bold text-xf-accent">
      {formatted}
      {/* 后台更新时显示小圆点 */}
      {isValidating && (
        <span className="ml-2 inline-block w-2 h-2 bg-xf-primary rounded-full animate-pulse" />
      )}
    </div>
  )
})

/**
 * 累计/兑换数字组件（独立 memo 优化）
 * @interface StatNumberProps
 */
interface StatNumberProps {
  /** 数字值 */
  value: number
}

/**
 * 统计数字组件
 * @param {StatNumberProps} props - 组件属性
 * @returns {JSX.Element} 数字元素
 */
const StatNumber = memo(function StatNumber({ value }: StatNumberProps) {
  const formatted = useMemo(() => value.toLocaleString(), [value])

  return <span className="font-bold text-xf-dark">{formatted}</span>
})

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
  isValidating
}: PtOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-soft px-6 py-3 flex items-center gap-6 border border-xf-bg/30">
      <div>
        <span className="text-xs text-xf-primary">我的积分</span>
        {/* 当前积分 - 独立组件 */}
        <PointsNumber value={points} isValidating={isValidating} />
      </div>
      <div className="h-8 w-px bg-xf-bg" />
      <div className="text-sm space-y-0.5">
        <div className="text-xf-medium">
          累计获得 <StatNumber value={totalEarned} />
        </div>
        <div className="text-xf-medium">
          已兑换 <StatNumber value={totalSpent} />
        </div>
      </div>
    </div>
  )
})
