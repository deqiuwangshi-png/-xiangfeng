'use client'

/**
 * 月度账单组件
 *
 * 作用: 显示本月账单摘要
 *
 * @returns {JSX.Element} 月度账单组件
 *
 * 更新时间: 2026-03-11
 */

import { PieChart } from 'lucide-react'

/**
 * 月度账单组件
 *
 * @returns {JSX.Element} 月度账单组件
 */
export function MonthlyBill() {
  return (
    <div className="stat-card rounded-2xl p-6 mb-8">
      {/* 头部 */}
      <h2 className="text-xl font-serif font-bold text-xf-accent flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5" />
        本月账单
      </h2>

      {/* 收支列表 */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-xf-primary">收入</span>
          <span className="font-semibold text-xf-success">+¥3,648.20</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xf-primary">支出</span>
          <span className="font-semibold text-xf-warning">-¥1,200.00</span>
        </div>
        <div className="border-t border-xf-bg/30 my-2" />
        <div className="flex justify-between">
          <span className="font-medium text-xf-dark">结余</span>
          <span className="font-bold text-xf-accent">¥2,448.20</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-4 h-2 bg-xf-bg rounded-full overflow-hidden">
        <div className="w-3/4 h-2 bg-xf-success rounded-full" />
      </div>
      <p className="text-xs text-xf-primary mt-2">预算使用 75%</p>

      {/* 查看详情按钮 */}
      <button className="w-full mt-4 py-2 border border-xf-bg/60 rounded-xl text-xf-primary text-sm">
        查看账单详情
      </button>
    </div>
  )
}
