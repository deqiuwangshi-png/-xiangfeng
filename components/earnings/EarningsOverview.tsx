'use client'

/**
 * 收益概览组件
 * 
 * 作用: 显示收益概览卡片
 * @returns {JSX.Element} 收益概览组件
 * 更新时间: 2026-02-20
 */

import { Wallet, TrendingUp, Award, Calendar } from '@/components/icons'

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
 * @description 定义收益统计数据
 */
const statsData: StatCard[] = [
  {
    label: '可提现余额',
    value: '¥2,847.50',
    icon: Wallet,
    iconColor: 'text-xf-success',
    hasButton: true
  },
  {
    label: '本月收入',
    value: '¥3,648.20',
    icon: TrendingUp,
    iconColor: 'text-xf-info',
    description: '同比增长 +24.5%'
  },
  {
    label: '累计收入',
    value: '¥18,247.80',
    icon: Award,
    iconColor: 'text-xf-warning',
    description: '已服务 342 位付费用户'
  },
  {
    label: '预计结算',
    value: '¥1,428.30',
    icon: Calendar,
    iconColor: 'text-xf-accent',
    description: '结算日期：2024年2月5日'
  }
]

/**
 * 收益概览组件
 * 
 * @returns {JSX.Element} 收益概览组件
 */
export function EarningsOverview() {
  /**
   * 处理提现按钮点击
   * 
   * @returns {void}
   */
  const handleWithdraw = () => {
    // 触发提现模态框
    const event = new CustomEvent('open-withdraw-modal')
    window.dispatchEvent(event)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            {stat.hasButton ? (
              <button
                onClick={handleWithdraw}
                className="w-full mt-4 py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-primary/90 transition"
              >
                立即提现
              </button>
            ) : stat.description ? (
              <p className="text-sm text-xf-medium">
                {stat.description.split(' ').map((word, wordIndex) => {
                  if (word.startsWith('+') || word.match(/^\d+/)) {
                    return <span key={`${stat.label}-word-${wordIndex}`} className="font-medium">{word} </span>
                  }
                  return <span key={`${stat.label}-word-${wordIndex}`}>{word} </span>
                })}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
