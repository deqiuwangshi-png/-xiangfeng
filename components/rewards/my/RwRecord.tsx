'use client'

/**
 * 兑换记录组件
 * @module components/rewards/my/RwRecord
 * @description 显示用户的兑换记录，支持状态筛选和分页（使用 SWR 缓存优化）
 */

import { useState, useMemo, useCallback } from 'react'
import { Calendar, Gift } from '@/components/icons'
import { Pagination } from '@/components/drafts/navigation/Pagination'
import { useExchangeRecords } from '@/hooks/rewards/useExchangeRecords'
import { mapExchangeToRecord } from './utils'
import { statusConfig } from './constants'
import type { ExchangeStatus } from '@/types/rewards'

/**
 * 筛选类型
 * @type FilterType
 */
type FilterType = 'all' | ExchangeStatus

/**
 * 筛选配置
 * @constant filterTabs
 */
const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'issued', label: '已发放' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' },
]

/**
 * 每页显示数量
 * @constant PAGE_SIZE
 */
const PAGE_SIZE = 5

/**
 * 兑换记录组件
 * @returns {JSX.Element} 兑换记录组件
 */
export function RwRecord() {
  const { records, isLoading } = useExchangeRecords({ limit: 50 })
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * 转换后的记录列表（使用 useMemo 缓存）
   */
  const mappedRecords = useMemo(() => {
    return records.map(mapExchangeToRecord)
  }, [records])

  /**
   * 筛选后的记录
   */
  const filteredRecords = useMemo(() => {
    if (filter === 'all') return mappedRecords
    return mappedRecords.filter((record) => record.status === filter)
  }, [mappedRecords, filter])

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
   * 加载中状态 - 使用 Array.from 替代展开运算符
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
      <div className="flex gap-2 mb-6 flex-wrap">
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
            const status = statusConfig[record.status as ExchangeStatus]

            return (
              <div
                key={record.id}
                className="flex items-center gap-3 p-3 bg-xf-light/80 rounded-xl border border-xf-bg/30"
              >
                {/* 图标 */}
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${record.iconColor}`} />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-xf-dark">
                      {record.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${status.bgColor} ${status.textColor}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-xf-accent font-semibold">
                      <Gift className="w-3 h-3" />
                      {record.points} 灵感币
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {record.date}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 text-xf-primary">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-sm">暂无兑换记录</div>
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
