'use client'

/**
 * 收益明细组件
 * 
 * 作用: 显示收益明细列表
 * 
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\收益.html
 * 
 * 设计原则:
 * - HTML原型文件是唯一真理数据来源
 * - 严格遵循原型中的所有样式和布局
 * - 不得自行修改或"优化"原型设计
 * - 所有间距完全复制原型数值
 * 
 * @returns {JSX.Element} 收益明细组件
 * 
 * 使用说明:
 *   - 使用 Client Component 处理交互
 *   - 使用 lucide-react 图标组件
 *   - 所有间距完全复制原型数值
 *   - 支持加载更多记录
 * 
 * 更新时间: 2026-02-20
 */

import { useState } from 'react'
import { RefreshCw, Plus, Users, FileText, Heart } from 'lucide-react'

/**
 * 收益记录接口
 * 
 * @interface EarningRecord
 * @property {string} id - 记录ID
 * @property {string} title - 收益标题
 * @property {string} source - 收益来源
 * @property {string} time - 时间
 * @property {string} amount - 金额
 * @property {string} ratio - 分成比例
 * @property {React.ElementType} icon - 图标组件
 * @property {string} iconBg - 图标背景类
 * @property {string} iconColor - 图标颜色类
 */
interface EarningRecord {
  id: string
  title: string
  source: string
  time: string
  amount: string
  ratio: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

/**
 * 收益记录数据
 * 
 * @constant earningsData
 * @description 定义收益记录数据
 */
const earningsData: EarningRecord[] = [
  {
    id: '1',
    title: '会员订阅收入',
    source: '来自 Sophia Chen',
    time: '1小时前',
    amount: '+¥298.00',
    ratio: '分成比例 70%',
    icon: Users,
    iconBg: 'bg-xf-success/10',
    iconColor: 'text-xf-success'
  },
  {
    id: '2',
    title: '付费文章销售',
    source: '《深度思考的方法论》',
    time: '5小时前',
    amount: '+¥168.00',
    ratio: '分成比例 60%',
    icon: FileText,
    iconBg: 'bg-xf-info/10',
    iconColor: 'text-xf-info'
  },
  {
    id: '3',
    title: '用户打赏',
    source: '来自匿名用户',
    time: '1天前',
    amount: '+¥50.00',
    ratio: '平台无抽成',
    icon: Heart,
    iconBg: 'bg-xf-accent/10',
    iconColor: 'text-xf-accent'
  }
]

/**
 * 收益明细组件
 * 
 * @returns {JSX.Element} 收益明细组件
 */
export function EarningsDetails() {
  const [records, setRecords] = useState<EarningRecord[]>(earningsData)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 刷新收益数据
   * 
   * @returns {void}
   */
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  /**
   * 加载更多记录
   * 
   * @returns {void}
   */
  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newRecord: EarningRecord = {
        id: String(records.length + 1),
        title: '会员订阅收入',
        source: '来自 Alex Wang',
        time: '2天前',
        amount: '+¥199.00',
        ratio: '分成比例 50%',
        icon: Users,
        iconBg: 'bg-xf-success/10',
        iconColor: 'text-xf-success'
      }
      setRecords([...records, newRecord])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="card-bg rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-xf-accent font-bold">收益明细</h2>
        <button
          onClick={handleRefresh}
          className="text-sm text-xf-primary hover:text-xf-accent font-medium flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      <div className="space-y-4">
        {records.map((record) => {
          const Icon = record.icon
          return (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-xf-bg/50"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${record.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${record.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-bold text-xf-dark">{record.title}</h4>
                  <p className="text-sm text-xf-primary">{record.source} • {record.time}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xf-accent text-lg">{record.amount}</div>
                <p className="text-sm text-xf-primary">{record.ratio}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          加载更多记录
        </button>
      </div>
    </div>
  )
}
