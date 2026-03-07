'use client'

/**
 * 提现记录组件
 * 
 * 作用: 显示提现记录列表
 * 
 * @returns {JSX.Element} 提现记录组件
 * 更新时间: 2026-02-20
 */

import { DollarSign } from '@/components/icons'

/**
 * 提现记录接口
 * 
 * @interface WithdrawRecord
 * @property {string} id - 记录ID
 * @property {string} title - 提现标题
 * @property {string} time - 时间
 * @property {string} amount - 金额
 * @property {string} status - 状态
 * @property {string} statusColor - 状态颜色类
 */
interface WithdrawRecord {
  id: string
  title: string
  time: string
  amount: string
  status: string
  statusColor: string
}

/**
 * 提现记录数据
 * 
 * @constant withdrawData
 * @description 定义提现记录数据
 */
const withdrawData: WithdrawRecord[] = [
  {
    id: '1',
    title: '提现到支付宝',
    time: '2024年1月28日',
    amount: '¥2,000.00',
    status: '提现成功',
    statusColor: 'text-xf-success'
  },
  {
    id: '2',
    title: '提现到银行卡',
    time: '2024年1月15日',
    amount: '¥1,500.00',
    status: '提现成功',
    statusColor: 'text-xf-success'
  },
  {
    id: '3',
    title: '提现到微信',
    time: '2024年1月5日',
    amount: '¥847.50',
    status: '处理中',
    statusColor: 'text-xf-warning'
  }
]

/**
 * 提现记录组件
 * 
 * @returns {JSX.Element} 提现记录组件
 */
export function WithdrawHistory() {
  return (
    <div className="card-bg rounded-2xl p-6">
      <h2 className="text-2xl font-serif text-xf-accent font-bold mb-6">提现记录</h2>

      <div className="space-y-4">
        {withdrawData.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-xf-bg/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-xf-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-xf-primary" />
              </div>
              <div>
                <h4 className="font-bold text-xf-dark">{record.title}</h4>
                <p className="text-sm text-xf-primary">{record.time}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xf-accent text-lg">{record.amount}</div>
              <p className={`text-sm ${record.statusColor}`}>{record.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
