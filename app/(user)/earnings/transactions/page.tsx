'use client'

/**
 * 交易记录子页面
 * 
 * 作用: 显示详细的交易记录列表，方便用户对账
 * 
 * @returns {JSX.Element} 交易记录子页面
 * 
 * 更新时间: 2026-03-12
 */

import { useState, useMemo } from 'react'
import { ArrowLeft, List, Heart, FileText, CreditCard } from '@/components/icons'
import { Search } from 'lucide-react'
import Link from 'next/link'

/**
 * 交易类型
 */
type TransactionType = 'income' | 'withdraw' | 'expense'

/**
 * 交易记录接口
 */
interface Transaction {
  id: string
  type: TransactionType
  title: string
  description: string
  date: string
  time: string
  amount: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

/**
 * 交易记录数据（模拟）
 */
const transactionsData: Transaction[] = [
  {
    id: '1',
    type: 'income',
    title: '会员订阅收入',
    description: '来自 Sophia Chen',
    date: '2026-03-12',
    time: '10:30',
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
    date: '2026-03-12',
    time: '08:15',
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
    date: '2026-03-11',
    time: '16:45',
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
    date: '2026-03-10',
    time: '14:20',
    amount: '-¥2,000.00',
    icon: CreditCard,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: '5',
    type: 'income',
    title: '文章阅读收益',
    description: '来自平台分成',
    date: '2026-03-09',
    time: '00:00',
    amount: '+¥128.50',
    icon: FileText,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: '6',
    type: 'income',
    title: '会员订阅收入',
    description: '来自 David Kim',
    date: '2026-03-08',
    time: '18:30',
    amount: '+¥298.00',
    icon: Heart,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  }
]

/**
 * 交易记录子页面
 */
export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'withdraw'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  /**
   * 过滤和搜索交易记录
   */
  const filteredTransactions = useMemo(() => {
    return transactionsData.filter(transaction => {
      const matchesFilter = filter === 'all' || transaction.type === filter
      const matchesSearch = searchTerm === '' || 
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [filter, searchTerm])

  /**
   * 计算统计数据
   */
  const stats = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount.replace(/[¥,+]/g, ''))
      if (transaction.type === 'income') {
        acc.income += amount
      } else {
        acc.expense += amount
      }
      return acc
    }, { income: 0, expense: 0 })
  }, [filteredTransactions])

  return (
    <main className="flex-1 h-full overflow-y-auto px-6 md:px-10 pt-8 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* 页头 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-serif text-xf-accent font-bold flex items-center gap-2">
              <List className="w-6 h-6" />
              交易记录
            </h1>
            <Link
              href="/earnings"
              className="text-xf-primary hover:text-xf-accent flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回收益中心</span>
            </Link>
          </div>
          <p className="text-xf-dark/70 mt-1">查看所有交易记录，方便对账</p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="stat-card rounded-xl p-4 bg-green-50 border border-green-100">
            <p className="text-sm text-xf-primary mb-1">总收入</p>
            <p className="text-2xl font-bold text-xf-success">¥{stats.income.toFixed(2)}</p>
          </div>
          <div className="stat-card rounded-xl p-4 bg-red-50 border border-red-100">
            <p className="text-sm text-xf-primary mb-1">总支出</p>
            <p className="text-2xl font-bold text-xf-warning">¥{stats.expense.toFixed(2)}</p>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm rounded-lg border transition ${filter === 'all' ? 'bg-xf-accent text-white border-xf-accent' : 'bg-white border-xf-bg/60 text-xf-dark'}`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 text-sm rounded-lg border transition ${filter === 'income' ? 'bg-xf-success text-white border-xf-success' : 'bg-white border-xf-bg/60 text-xf-dark'}`}
            >
              收入
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 text-sm rounded-lg border transition ${filter === 'expense' ? 'bg-xf-warning text-white border-xf-warning' : 'bg-white border-xf-bg/60 text-xf-dark'}`}
            >
              支出
            </button>
            <button
              onClick={() => setFilter('withdraw')}
              className={`px-4 py-2 text-sm rounded-lg border transition ${filter === 'withdraw' ? 'bg-xf-info text-white border-xf-info' : 'bg-white border-xf-bg/60 text-xf-dark'}`}
            >
              提现
            </button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-xf-primary" />
            <input
              type="text"
              placeholder="搜索交易记录"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-xf-bg/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-xf-primary/30"
            />
          </div>
        </div>

        {/* 交易列表 */}
        <div className="stat-card rounded-2xl p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-xf-primary">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-sm">暂无交易记录</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => {
                const Icon = transaction.icon
                const isIncome = transaction.type === 'income'

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-xf-bg/30 hover:border-xf-primary/30 transition"
                  >
                    {/* 图标 */}
                    <div className={`w-10 h-10 rounded-full ${transaction.iconBg} flex items-center justify-center ${transaction.iconColor} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xf-dark truncate">{transaction.title}</p>
                      <p className="text-xs text-xf-primary truncate">{transaction.description}</p>
                      <p className="text-xs text-xf-medium mt-1">{transaction.date} {transaction.time}</p>
                    </div>

                    {/* 金额 */}
                    <div className="text-right shrink-0">
                      <p className={`font-semibold ${isIncome ? 'text-xf-success' : 'text-xf-dark'}`}>
                        {transaction.amount}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
