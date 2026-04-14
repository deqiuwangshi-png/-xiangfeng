'use client'

/**
 * 签到卡片组件
 * @module components/rewards/SignCard
 * @description 显示连续签到天数、今日签到按钮和7天日历预览
 */

import { memo, useMemo } from 'react'
import { CalendarCheck, CheckCircle, Loader2 } from '@/components/icons'

/**
 * 签到奖励配置项
 * @interface SignInRewardItem
 */
interface SignInRewardItem {
  day: number
  points: number
  isBonus: boolean
  bonusPoints: number
}

/**
 * 签到卡片Props
 * @interface SignCardProps
 */
interface SignCardProps {
  /** 是否已签到 */
  isSigned: boolean
  /** 连续签到天数 */
  signDays: number
  /** 签到奖励配置 */
  rewardsConfig: SignInRewardItem[]
  /** 是否正在签到 */
  isSigning: boolean
  /** 签到回调 */
  onSign: () => void
}

/**
 * 星期标签
 * @constant weekDays
 */
const weekDays = ['一', '二', '三', '四', '五', '六', '日']

/**
 * 默认签到奖励配置（当数据库未返回配置时使用）
 * @constant defaultRewardsConfig
 */
const defaultRewardsConfig: SignInRewardItem[] = [
  { day: 1, points: 5, isBonus: false, bonusPoints: 0 },
  { day: 2, points: 5, isBonus: false, bonusPoints: 0 },
  { day: 3, points: 10, isBonus: false, bonusPoints: 0 },
  { day: 4, points: 10, isBonus: false, bonusPoints: 0 },
  { day: 5, points: 15, isBonus: false, bonusPoints: 0 },
  { day: 6, points: 15, isBonus: false, bonusPoints: 0 },
  { day: 7, points: 20, isBonus: true, bonusPoints: 30 },
]

/**
 * 签到卡片组件
 * @param {SignCardProps} props - 组件属性
 * @returns {JSX.Element} 签到卡片
 */
export const SignCard = memo(function SignCard({
  isSigned,
  signDays,
  rewardsConfig,
  isSigning,
  onSign,
}: SignCardProps) {
  {/* 使用数据库配置或默认配置 */}
  const effectiveConfig = useMemo(() => {
    return rewardsConfig.length > 0 ? rewardsConfig : defaultRewardsConfig
  }, [rewardsConfig])

  {/* 计算今天是一周中的第几天 (0-6) */}
  const todayIndex = useMemo(() => {
    return (signDays - 1) % 7
  }, [signDays])

  /**
   * 获取日期单元格样式
   * @param {number} index - 索引
   * @returns {string} CSS类名
   */
  const getCellStyle = useMemo(() => {
    return (index: number) => {
      // 已签到的日期（包括今天）
      if (index < todayIndex) return 'bg-xf-primary text-white opacity-60'
      // 今天已签到
      if (index === todayIndex && isSigned) return 'bg-xf-success text-white'
      // 今天未签到
      if (index === todayIndex) return 'bg-xf-accent text-white'
      // 未来的日期
      return 'bg-white border-1.5 border-xf-primary text-xf-primary'
    }
  }, [todayIndex, isSigned])

  /**
   * 获取今日奖励积分
   * @returns {number} 今日奖励积分
   */
  const todayReward = useMemo(() => {
    const dayInCycle = ((signDays - 1) % 7) + 1
    const config = effectiveConfig.find((r) => r.day === dayInCycle)
    return config?.points || 5
  }, [signDays, effectiveConfig])

  /**
   * 获取明日奖励积分
   * @returns {number} 明日奖励积分
   */
  const tomorrowReward = useMemo(() => {
    const tomorrowDayInCycle = (signDays % 7) + 1
    const config = effectiveConfig.find((r) => r.day === tomorrowDayInCycle)
    return config?.points || 5
  }, [signDays, effectiveConfig])

  /**
   * 检查今日是否为大将日
   * @returns {boolean} 是否为大将日
   */
  const bonusDay = useMemo(() => {
    const dayInCycle = ((signDays - 1) % 7) + 1
    const config = effectiveConfig.find((r) => r.day === dayInCycle)
    return config?.isBonus || false
  }, [signDays, effectiveConfig])

  /**
   * 获取大将日额外奖励
   * @returns {number} 额外奖励积分
   */
  const bonusPoints = useMemo(() => {
    const dayInCycle = ((signDays - 1) % 7) + 1
    const config = effectiveConfig.find((r) => r.day === dayInCycle)
    return config?.bonusPoints || 0
  }, [signDays, effectiveConfig])

  /**
   * 获取奖励显示列表
   * @returns {number[]} 奖励列表
   */
  const rewardsList = useMemo(() => {
    return effectiveConfig
      .sort((a, b) => a.day - b.day)
      .map((r) => r.points)
  }, [effectiveConfig])

  /**
   * 获取大将日标记列表
   * @returns {boolean[]} 大将日标记列表
   */
  const bonusList = useMemo(() => {
    return effectiveConfig
      .sort((a, b) => a.day - b.day)
      .map((r) => r.isBonus)
  }, [effectiveConfig])

  return (
    <div className="lg:col-span-2 card-bg rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-xf-soft/10 rounded-full -mr-8 -mt-8" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xf-primary text-sm mb-1">
              <CalendarCheck className="w-4 h-4" />
              连续签到 <span className="font-bold text-xf-accent text-lg">{signDays}天</span>
            </div>
            <div className="text-2xl font-serif font-semibold text-xf-dark">
              今日签到得 <span className="text-xf-accent">{todayReward}灵感币</span>
              {bonusDay && (
                <span className="text-sm text-xf-success ml-2">(大将日+{bonusPoints}!)</span>
              )}
            </div>
          </div>
          <button
            onClick={onSign}
            disabled={isSigned || isSigning}
            className="bg-xf-accent text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:bg-xf-success disabled:cursor-not-allowed"
          >
            {isSigning ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {isSigned ? '已签到' : isSigning ? '签到中...' : '今日签到'}
          </button>
        </div>

        {/* 签到日历预览 - 单行布局 */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-xf-primary">签到奖励</span>
          <div className="flex gap-3">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium ${getCellStyle(index)}`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex gap-2 text-xs font-medium text-xf-primary">
            {rewardsList.map((reward, index) => (
              <span
                key={index}
                className={index >= todayIndex ? 'text-xf-accent' : ''}
              >
                +{reward}
                {bonusList[index] && '*'}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-xf-primary mt-3">
          明日签到可得{tomorrowReward}灵感币
          {signDays % 7 === 6 && bonusList[6] && '，连续7天额外奖励大将灵感币!'}
        </p>
      </div>
    </div>
  )
})