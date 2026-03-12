/**
 * 收益中心页面
 * 
 * 作用: 显示收益中心主页面
 * 
 * @returns {JSX.Element} 收益中心页面
 * 
 * 使用说明:
 *   - 使用 Server Component 渲染静态内容
 *   - 引入收益中心样式文件
 *   - 所有间距完全复制原型数值
 * 
 * 更新时间: 2026-02-20
 */

import { EarningsOverview, PaymentMethods, TransactionRecords, MonthlyBill, WithdrawModal, RechargeModal } from '@/components/earnings'
import '@/styles/domains/earnings.css'

/**
 * 收益中心页面组件
 * 
 * @returns {JSX.Element} 收益中心页面
 */
export default function EarningsPage() {
  return (
    <>
      <main className="flex-1 h-full overflow-y-auto px-6 md:px-10 pt-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* 标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-xf-accent font-bold mb-2">收益中心</h1>
            <p className="text-xf-dark/70">管理资金收益、支付方式与交易记录</p>
          </div>

          {/* 收益概览 + 支付方式 */}
          <EarningsOverview />

          {/* 支付方式管理 */}
          <PaymentMethods />

          {/* 交易记录 + 月度账单 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 交易记录（占2列） */}
            <div className="lg:col-span-2">
              <TransactionRecords />
            </div>

            {/* 月度账单（占1列） */}
            <div className="lg:col-span-1">
              <MonthlyBill />
            </div>
          </div>
        </div>
      </main>

      {/* 提现模态框 */}
      <WithdrawModal />

      {/* 充值模态框 */}
      <RechargeModal />
    </>
  )
}
