'use client'

/**
 * 积分记录组件
 * @module components/rewards/my/PtRecord
 * @description 显示用户的积分获得和消耗记录，支持筛选和分页
 */

import { useState, useMemo, useCallback } from 'react'
import {
  Plus,
  Minus,
  Calendar,
  CheckCircle2,
  Gift,
  Star,
  Clock,
  Award,
  Heart,
  type LucideIcon,
} from '@/components/icons'
import { Pagination } from '@/components/drafts/navigation/Pagination'
import { usePoints } from '@/hooks/rewards/usePoints'
import type { PointTransaction, PointSourceType } from '@/types/rewards'

/**
 * 积分记录类型
 * @type PtType
 */
type PtType = 'earn' | 'spend'

/**
 * 筛选类型
 * @type FilterType
 */
type FilterType = 'all' | PtType

/**
 * 积分记录项接口
 * @interface PtRecordItem
 */
interface PtRecordItem {
  id: string
  type: PtType
  points: number
  source: string
  description: string
  date: string
  icon: LucideIcon
  iconColor: string
}

/**
 * 来源配置映射
 * @constant sourceConfig
 */
const sourceConfig: Record<
  PointSourceType,
  { label: string; icon: LucideIcon; iconColor: string }
> = {
  signin: { label: '每日签到', icon: CheckCircle2, iconColor: 'text-green-600' },
  signin_bonus: { label: '签到奖励', icon: Star, iconColor: 'text-amber-600' },
  task_daily: { label: '每日任务', icon: Clock, iconColor: 'text-xf-primary' },
  task_weekly: { label: '每周任务', icon: Award, iconColor: 'text-xf-primary' },
  task_monthly: { label: '每月任务', icon: Award, iconColor: 'text-xf-primary' },
  task_yearly: { label: '年度任务', icon: Award, iconColor: 'text-xf-primary' },
  task_event: { label: '活动任务', icon: Award, iconColor: 'text-xf-primary' },
  exchange: { label: '兑换商品', icon: Gift, iconColor: 'text-xf-accent' },
  exchange_refund: { label: '兑换退款', icon: Gift, iconColor: 'text-green-600' },
  expire: { label: '积分过期', icon: Clock, iconColor: 'text-gray-500' },
  system: { label: '系统奖励', icon: Star, iconColor: 'text-amber-600' },
  reward_send: { label: '打赏支出', icon: Heart, iconColor: 'text-rose-500' },
  reward_receive: { label: '打赏收入', icon: Star, iconColor: 'text-amber-500' },
}

/**
 * 将交易数据转换为展示数据
 * @param {PointTransaction} transaction - 积分交易记录
 * @returns {PtRecordItem} 展示用记录项
 */
function mapTransactionToRecord(transaction: PointTransaction): PtRecordItem {
  const config = sourceConfig[transaction.source]

  return {
    id: transaction.id,
    type: transaction.type === 'earn' || transaction.type === 'refund' ? 'earn' : 'spend',
    points: transaction.amount,
    source: config.label,
    description: transaction.description || config.label,
    date: new Date(transaction.created_at).toISOString().split('T')[0],
    icon: config.icon,
    iconColor: config.iconColor,
  }
}

/**
 * 筛选配置
 * @constant filterTabs
 */
const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'earn', label: '获得' },
  { key: 'spend', label: '消耗' },
]

/**
 * 每页显示数量
 * @constant PAGE_SIZE
 */
const PAGE_SIZE = 5

/**
 * 积分记录组件
 * @returns {JSX.Element} 积分记录组件
 */
export function PtRecord() {
  const { transactions, isLoading } = usePoints()
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * 转换后的记录列表
   */
  const records = useMemo(() => {
    return transactions.map(mapTransactionToRecord)
  }, [transactions])

  /**
   * 筛选后的记录
   */
  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records
    return records.filter((record) => record.type === filter)
  }, [records, filter])

  /**
   * 总页数
   */
  const totalPages = useMemo(() => {
    return Math.ceil(filteredRecords.length / PAGE_SIZE)
  }, [filteredRecords])

  /**
   * 当前页数据
   */
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredRecords.slice(start, end)
  }, [filteredRecords, currentPage])

  /**
   * 处理筛选变化
   * @param {FilterType} newFilter - 新筛选条件
   */
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }, [])

  /**
   * 处理页码变化
   * @param {number} page - 页码
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  /**
   * 加载中状态 - 使用 Array.from 优化
   */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-xf-light/80 rounded-xl border border-xf-bg/30 animate-pulse"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* 筛选标签 */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              filter === tab.key
                ? 'bg-xf-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 记录列表 */}
      <div className="space-y-3">
        {currentRecords.length > 0 ? (
          currentRecords.map((record) => {
            const Icon = record.icon
            const isEarn = record.type === 'earn'

            return (
              <div
                key={record.id}
                className="flex items-center gap-3 p-3 bg-xf-light/80 rounded-xl border border-xf-bg/30"
              >
                {/* 图标 */}
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${record.iconColor}`} />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-xf-dark">{record.source}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isEarn ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isEarn ? '获得' : '消耗'}
                    </span>
                  </div>
                  <div className="text-xs text-xf-primary mt-0.5">{record.description}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    {record.date}
                  </div>
                </div>

                {/* 积分变动 */}
                <div className={`flex items-center gap-1 font-bold text-lg ${
                  isEarn ? 'text-green-600' : 'text-rose-600'
                }`}>
                  {isEarn ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  {record.points}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 text-xf-primary">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-sm">暂无记录</div>
          </div>
        )}
      </div>

      {/* 分页器 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
