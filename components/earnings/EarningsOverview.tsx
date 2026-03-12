'use client'

/**
 * 收益概览组件
 *
 * 作用: 显示用户钱包余额和快捷操作
 * @returns {JSX.Element} 收益概览组件
 * 更新时间: 2026-03-11
 */

import { TrendingUp, Award, Calendar } from '@/components/icons'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { usePoints } from '@/components/rewards/hooks'
import Link from 'next/link'

/**
 * 统计卡片接口
 *
 * @interface StatCard
 * @property {string} label - 统计标签
 * @property {string} value - 统计数值
 * @property {React.ElementType} icon - 统计图标组件
 * @property {string} iconColor - 图标颜色类
 * @property {string} description - 描述信息
 * @property {boolean} hasButton - 是否显示提现按钮
 */
interface StatCard {
  label: string
  value: string
  icon: React.ElementType
  iconColor: string
  description?: string
  hasButton?: boolean
}

/**
 * 统计数据配置
 *
 * @constant statsData
 * @description 定义收益统计数据（第二行显示）
 */
const statsData: StatCard[] = [
  {
    label: '本月收入',
    value: '¥0.00',
    icon: TrendingUp,
    iconColor: 'text-xf-info',
    description: '同比增长 +0.0%'
  },
  {
    label: '累计收入',
    value: '¥0.00',
    icon: Award,
    iconColor: 'text-xf-warning',
    description: '已服务 0 位付费用户'
  },
  {
    label: '预计结算',
    value: '¥0.00',
    icon: Calendar,
    iconColor: 'text-xf-accent',
    description: '结算日期：待设置'
  }
]

/**
 * 收益概览组件
 *
 * @returns {JSX.Element} 收益概览组件
 */
/**
 * 收益概览组件
 *
 * @returns {JSX.Element} 收益概览组件
 */
export function EarningsOverview() {
  {/* 获取用户积分数据 */}
  const { overview, isLoading } = usePoints()
  const currentPoints = overview?.current_points ?? 0
  const displayPoints = isLoading ? '-' : currentPoints.toLocaleString()

  {/* 计算可兑换金额（100积分 = 1元） */}
  const exchangeAmount = isLoading ? '-' : (currentPoints / 100).toFixed(2)

  /**
   * 处理充值按钮点击
   *
   * @returns {void}
   */
  const handleRecharge = () => {
    {/* 触发充值模态框 */}
    const event = new CustomEvent('open-recharge-modal')
    window.dispatchEvent(event)
  }

  /**
   * 处理提现按钮点击
   *
   * @returns {void}
   */
  const handleWithdraw = () => {
    {/* 触发提现模态框 */}
    const event = new CustomEvent('open-withdraw-modal')
    window.dispatchEvent(event)
  }

  return (
    <div className="mb-8">
      {/* 第一行：余额总览 + 快捷入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 余额总览（占两列） */}
        <div className="lg:col-span-2 stat-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-xf-primary mb-1">可用余额</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold text-xf-accent">¥0.00</h2>
              <span className="text-xs bg-xf-success/20 text-xf-success px-2 py-1 rounded-full">正常</span>
            </div>
            <p className="text-xs text-xf-medium mt-2">冻结金额：¥0.00 · 累计收益 ¥0.00</p>
          </div>
          <div className="flex gap-3 self-end md:self-center">
            <button
              onClick={handleRecharge}
              className="flex items-center gap-2 px-5 py-2.5 bg-xf-info text-white rounded-xl shadow-sm"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span className="text-sm font-medium">充值</span>
            </button>
            <button
              onClick={handleWithdraw}
              className="flex items-center gap-2 px-5 py-2.5 bg-xf-success text-white rounded-xl shadow-sm"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">提现</span>
            </button>
          </div>
        </div>

        {/* 快捷入口卡片（积分/兑换比例） */}
        <div className="bg-xf-primary rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">我的积分</p>
            <p className="text-3xl font-bold">{displayPoints}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-white/70">可兑换 ¥{exchangeAmount}</span>
            <Link
              href="/rewards/shop"
              className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium hover:bg-white/30 transition"
            >
              去兑换
            </Link>
          </div>
        </div>
      </div>

      {/* 第二行：统计数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-xf-primary mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-xf-accent">{stat.value}</h3>
                </div>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.description && (
                <p className="text-sm text-xf-medium">
                  {stat.description.split(' ').map((word, wordIndex) => {
                    if (word.startsWith('+') || word.match(/^\d+/)) {
                      return <span key={`${stat.label}-word-${wordIndex}`} className="font-medium">{word} </span>
                    }
                    return <span key={`${stat.label}-word-${wordIndex}`}>{word} </span>
                  })}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
