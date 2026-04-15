/**
 * 积分与订阅页：积分用尽后可选择订阅方案
 * @module app/(main)/rewards/page
 */

import { requireAuth } from '@/lib/auth/server'
import { Gift } from '@/components/icons'
import { RewardsTabs } from '@/components/rewards/RewardsTabs'
import {
  getActivePlans,
  getActiveSubscription,
  getPointTransactions,
  getPointsOverview,
} from '@/lib/rewards'

export const metadata = {
  title: '积分与订阅 · 相逢',
}

const FALLBACK_TIERS = [
  {
    id: 'free',
    name: '个人免费版',
    price: '¥0',
    dailyPoints: 2400,
    blurb: '适合轻度体验与日常浏览。',
    features: ['基础积分额度', '社区核心功能', '标准客服响应'],
    cta: '当前方案',
    emphasized: false,
    isCurrent: true,
  },
  {
    id: 'plus',
    name: '进阶版',
    price: '¥29',
    dailyPoints: 6400,
    blurb: '更高积分与常用创作能力。',
    features: ['进阶积分包', '发布与草稿增强', '优先处理队列'],
    cta: '选择进阶版',
    emphasized: false,
    isCurrent: false,
  },
  {
    id: 'pro',
    name: '高级版',
    price: '¥79',
    dailyPoints: 8400,
    blurb: '面向高频创作者与深度使用。',
    features: ['大额月度积分', '高级功能解锁', '专属活动权益'],
    cta: '选择高级版',
    emphasized: false,
    isCurrent: false,
  },
  {
    id: 'ultimate',
    name: '旗舰版',
    price: '¥199',
    dailyPoints: 14000,
    blurb: '团队与重度用户的一站式方案。',
    features: ['顶配积分与额度', '全站能力开放', '旗舰级支持通道'],
    cta: '选择旗舰版',
    emphasized: true,
    isCurrent: false,
  },
] as const

function formatDailyPoints(points: number): string {
  if (points >= 10000) {
    const wan = points / 10000
    return Number.isInteger(wan) ? `${wan}万` : `${wan.toFixed(1)}万`
  }
  return points.toLocaleString('en-US')
}

function formatMonthlyPrice(cents: number): { price: string; period: string } {
  if (cents <= 0) return { price: '¥0', period: '' }
  return {
    price: `¥${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    period: '/月',
  }
}

function formatTypeLabel(type: string): string {
  if (type === 'earn') return '获得'
  if (type === 'spend') return '消耗'
  if (type === 'expire') return '过期'
  if (type === 'refund') return '退款'
  return type
}

function formatSourceLabel(source: string): string {
  const map: Record<string, string> = {
    signin: '每日登录',
    signin_bonus: '签到加成',
    subscription_daily: '订阅每日发放',
    period_reset: '每周清零',
    task_daily: '每日任务',
    task_weekly: '每周任务',
    task_monthly: '每月任务',
    task_yearly: '年度任务',
    task_event: '活动任务',
    exchange: '商城兑换',
    exchange_refund: '兑换退款',
    expire: '积分过期',
    reward_send: '打赏支出',
    reward_receive: '收到打赏',
    system: '系统发放',
  }
  return map[source] || source
}

function formatDateTime(value: string): string {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default async function RewardsPage() {
  const user = await requireAuth()

  const [plans, activeSub, pointsOverview, transactions] = await Promise.all([
    getActivePlans(),
    getActiveSubscription(user.id),
    getPointsOverview(user.id),
    getPointTransactions(user.id, 20),
  ])

  const tiers = (plans.length > 0 ? plans : FALLBACK_TIERS).map((tier) => {
    const planCode = 'code' in tier ? tier.code : tier.id
    const planName = tier.name
    const dailyPoints = tier.dailyPoints
    const priceMonthly = 'priceMonthly' in tier ? tier.priceMonthly : Number(tier.price.replace(/[^\d]/g, '')) * 100
    const isCurrent = activeSub?.planCode ? activeSub.planCode === planCode : planCode === 'free'
    const emphasized = planCode === 'ultimate'
    const priceParts = formatMonthlyPrice(priceMonthly)
    return {
      id: planCode,
      name: planName,
      dailyPointsLabel: formatDailyPoints(dailyPoints),
      price: priceParts.price,
      period: priceParts.period,
      emphasized,
      isCurrent,
    }
  })

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 text-xf-primary mb-2">
            <Gift className="w-5 h-5" aria-hidden />
            <span className="text-sm font-medium">积分</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-xf-dark tracking-tight">
            积分与订阅
          </h1>
        </header>

        <RewardsTabs
          subscriptionContent={(
            <div>
              <div className="mb-4 rounded-xl border border-xf-surface/30 bg-white p-5 sm:p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold text-xf-dark">订阅管理</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-xf-primary/10 text-xf-primary">
                    当前方案：{tiers.find((item) => item.isCurrent)?.name ?? '个人免费版'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-xf-medium">
                  订阅状态：{activeSub?.status === 'active' ? '生效中' : '未开通'}
                </p>
                <p className="mt-1 text-sm text-xf-medium">
                  最近发放：{activeSub?.lastDailyGrantDate || '今日未发放'}
                </p>
                <p className="mt-3 text-sm text-xf-medium">积分于用户登录后自动发放</p>
              </div>

              <section
                aria-label="订阅方案"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4"
              >
                {tiers.map((tier) => (
                  <article
                    key={tier.id}
                    className={`
                      flex flex-col rounded-xl border bg-white p-5 sm:p-6 transition-shadow min-w-0
                      ${tier.emphasized
                        ? 'border-xf-primary shadow-elevated ring-1 ring-xf-primary/15'
                        : 'border-xf-surface/30 shadow-soft'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-xf-dark">{tier.name}</h3>
                      {tier.emphasized && (
                        <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-xf-primary/10 text-xf-primary">
                          推荐
                        </span>
                      )}
                    </div>
                    <div className="mt-4 rounded-lg bg-xf-light px-3 py-2.5 border border-xf-surface/20">
                      <div className="text-xs text-xf-medium">每日积分</div>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <span className="text-lg font-semibold text-xf-primary tabular-nums">
                          {tier.dailyPointsLabel}
                        </span>
                        <span className="text-sm text-xf-dark/80">点</span>
                      </div>
                    </div>
                    <div className="mt-5 flex items-baseline gap-0.5">
                      <span className="text-2xl font-semibold text-xf-dark">{tier.price}</span>
                      {tier.period ? (
                        <span className="text-sm text-xf-medium">{tier.period}</span>
                      ) : null}
                    </div>
                    <div className="mt-5 flex-1" />
                    <div className="mt-6 pt-2">
                      {tier.isCurrent ? (
                        <button
                          type="button"
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-xf-surface/40 text-xf-medium bg-xf-light cursor-default"
                        >
                          当前方案
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-xf-primary text-white/95 opacity-80 cursor-not-allowed"
                        >
                          订阅即将开放
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </section>
            </div>
          )}
          pointsContent={(
            <section className="rounded-xl border border-xf-surface/30 bg-white p-5 sm:p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-xf-dark">积分明细</h2>
                <span className="text-sm text-xf-medium">
                  当前积分：{pointsOverview.currentPoints.toLocaleString('en-US')}
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead>
                    <tr className="text-left border-b border-xf-surface/25">
                      <th className="py-2.5 pr-4 text-xs font-medium text-xf-medium">时间</th>
                      <th className="py-2.5 pr-4 text-xs font-medium text-xf-medium">类型</th>
                      <th className="py-2.5 pr-4 text-xs font-medium text-xf-medium">来源</th>
                      <th className="py-2.5 pr-4 text-xs font-medium text-xf-medium">变动</th>
                      <th className="py-2.5 pr-4 text-xs font-medium text-xf-medium">变动后余额</th>
                      <th className="py-2.5 text-xs font-medium text-xf-medium">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-sm text-xf-medium text-center">
                          暂无积分流水
                        </td>
                      </tr>
                    ) : (
                      transactions.map((item) => (
                        <tr key={item.id} className="border-b border-xf-surface/15 last:border-b-0">
                          <td className="py-3 pr-4 text-sm text-xf-medium">
                            {formatDateTime(item.createdAt)}
                          </td>
                          <td className="py-3 pr-4 text-sm text-xf-dark">{formatTypeLabel(item.type)}</td>
                          <td className="py-3 pr-4 text-sm text-xf-dark">{formatSourceLabel(item.source)}</td>
                          <td
                            className={`py-3 pr-4 text-sm font-medium tabular-nums ${
                              item.amount >= 0 ? 'text-xf-success' : 'text-xf-error'
                            }`}
                          >
                            {item.amount >= 0 ? '+' : ''}
                            {item.amount.toLocaleString('en-US')}
                          </td>
                          <td className="py-3 pr-4 text-sm text-xf-dark tabular-nums">
                            {item.balanceAfter.toLocaleString('en-US')}
                          </td>
                          <td className="py-3 text-sm text-xf-medium">{item.description || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        />
      </div>
    </main>
  )
}
