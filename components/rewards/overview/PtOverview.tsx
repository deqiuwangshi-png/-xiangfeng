/**
 * 积分总览组件 (Server Component)
 * @module components/rewards/overview/PtOverview
 * @description 显示用户当前积分、累计获得和已兑换积分
 * @优化说明 改为Server Component，服务端直接渲染，减少客户端JS体积
 */

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
}

/**
 * 格式化数字为千分位
 * @param {number} value - 数字值
 * @returns {string} 格式化后的字符串
 */
function formatNumber(value: number): string {
  return value.toLocaleString()
}

/**
 * 积分总览组件
 * @param {PtOverviewProps} props - 组件属性
 * @returns {JSX.Element} 积分总览卡片
 */
export function PtOverview({
  points,
  totalEarned,
  totalSpent,
}: PtOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-soft px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 border border-xf-bg/30">
      <div>
        <span className="text-xs text-xf-primary">我的灵感币</span>
        {/* 当前积分 */}
        <div className="text-3xl font-bold text-xf-accent">
          {formatNumber(points)}
        </div>
      </div>
      <div className="h-px sm:h-8 w-full sm:w-px bg-xf-bg" />
      <div className="text-sm space-y-0.5">
        <div className="text-xf-medium">
          累计获得 <span className="font-bold text-xf-dark">{formatNumber(totalEarned)}</span>
        </div>
        <div className="text-xf-medium">
          已兑换 <span className="font-bold text-xf-dark">{formatNumber(totalSpent)}</span>
        </div>
      </div>
    </div>
  )
}
