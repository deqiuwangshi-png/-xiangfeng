'use client'

/**
 * 交易记录组件
 *
 * 作用: 显示最近交易记录
 *
 * @returns {JSX.Element} 交易记录组件
 *
 * 更新时间: 2026-03-11
 */

import { RefreshCw } from '@/components/icons'
import { CreditCard, FileText, Heart, List } from 'lucide-react'

/**
 * 交易类型
 */
type TransactionType = 'income' | 'withdraw' | 'expense'

/**
 * 交易记录接口
 *
 * @interface Transaction
 */
interface Transaction {
  id: string
  type: TransactionType
  title: string
  description: string
  time: string
  amount: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

/**
 * 交易记录数据（模拟，最多4条）
 *
 * @constant transactionsData
 */
const transactionsData: Transaction[] = [
  {
    id: '1',
    type: 'income',
    title: '会员订阅收入',
    description: '来自 Sophia Chen',
    time: '1小时前',
    amount: '+¥298.00',
    icon: Heart,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: '2',
    type: 'expense',
    title: '解锁付费文章',
    description: '《深度思考的方法论》',
    time: '3小时前',
    amount: '-¥168.00',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: '3',
    type: 'income',
    title: '用户打赏',
    description: '来自匿名用户',
    time: '1天前',
    amount: '+¥50.00',
    icon: Heart,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  {
    id: '4',
    type: 'withdraw',
    title: '提现到支付宝',
    description: '尾号 3456',
    time: '2天前',
    amount: '-¥2,000.00',
    icon: CreditCard,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
]

/**
 * 交易记录组件
 *
 * @returns {JSX.Element} 交易记录组件
 */
export function TransactionRecords() {
  /**
   * 处理加载更多
   *
   * @returns {void}
   */
  const handleLoadMore = () => {
    alert('加载更多交易记录（待实现）')
  }

  return (
    <div className="stat-card rounded-2xl p-6 mb-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-bold text-xf-accent flex items-center gap-2">
          <List className="w-5 h-5" />
          最近交易
        </h2>
        <a href="#" className="text-sm text-xf-info hover:underline">
          查看全部 →
        </a>
      </div>

      {/* 交易列表 */}
      <div className="space-y-3">
        {transactionsData.map((transaction) => {
          const Icon = transaction.icon
          const isIncome = transaction.type === 'income'

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
            >
              {/* 图标 */}
              <div className={`w-10 h-10 rounded-full ${transaction.iconBg} flex items-center justify-center ${transaction.iconColor} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xf-dark truncate">{transaction.title}</p>
                <p className="text-xs text-xf-primary truncate">{transaction.description}</p>
              </div>

              {/* 时间和金额 */}
              <div className="text-right shrink-0">
                <p className={`font-semibold ${isIncome ? 'text-xf-success' : 'text-xf-dark'}`}>
                  {transaction.amount}
                </p>
                <p className="text-xs text-xf-medium">{transaction.time}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 加载更多 */}
      <div className="mt-4 text-center">
        <button
          onClick={handleLoadMore}
          className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center justify-center gap-1 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          加载更多
        </button>
      </div>
    </div>
  )
}
