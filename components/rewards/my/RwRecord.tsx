'use client'

/**
 * 兑换记录组件
 * @module components/rewards/my/RwRecord
 * @description 显示用户的兑换记录，支持状态筛选和分页
 */

import { useState, useMemo } from 'react'
import { BookOpen, Crown, Coffee, Sticker, Calendar, Gift } from '@/components/icons'
import { Pagination } from '@/components/drafts/navigation/Pagination'

/**
 * 兑换状态类型
 * @type RwStatus
 */
type RwStatus = 'issued' | 'pending' | 'used'

/**
 * 筛选类型
 * @type FilterType
 */
type FilterType = 'all' | RwStatus

/**
 * 兑换记录项接口
 * @interface RwRecordItem
 */
interface RwRecordItem {
  id: string
  name: string
  points: number
  status: RwStatus
  date: string
  icon: React.ElementType
  iconColor: string
}

/**
 * 模拟兑换记录数据
 * @constant mockRecords
 */
const mockRecords: RwRecordItem[] = [
  { id: '1', name: '电子书券', points: 500, status: 'issued', date: '2024-05-12', icon: BookOpen, iconColor: 'text-xf-accent' },
  { id: '2', name: '7天会员', points: 880, status: 'issued', date: '2024-05-10', icon: Crown, iconColor: 'text-amber-600' },
  { id: '3', name: '咖啡折扣券', points: 200, status: 'pending', date: '2024-05-08', icon: Coffee, iconColor: 'text-xf-primary' },
  { id: '4', name: '表情包', points: 80, status: 'used', date: '2024-05-05', icon: Sticker, iconColor: 'text-xf-primary' },
  { id: '5', name: '电子书券', points: 500, status: 'issued', date: '2024-04-28', icon: BookOpen, iconColor: 'text-xf-accent' },
  { id: '6', name: '咖啡折扣券', points: 200, status: 'used', date: '2024-04-20', icon: Coffee, iconColor: 'text-xf-primary' },
  { id: '7', name: '7天会员', points: 880, status: 'issued', date: '2024-04-15', icon: Crown, iconColor: 'text-amber-600' },
  { id: '8', name: '表情包', points: 80, status: 'used', date: '2024-04-10', icon: Sticker, iconColor: 'text-xf-primary' },
]

/**
 * 状态配置
 * @constant statusConfig
 */
const statusConfig: Record<RwStatus, { label: string; bgColor: string; textColor: string }> = {
  issued: { label: '已发放', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  pending: { label: '待使用', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  used: { label: '已使用', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
}

/**
 * 筛选配置
 * @constant filterTabs
 */
const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'issued', label: '已发放' },
  { key: 'pending', label: '待使用' },
  { key: 'used', label: '已使用' },
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
  const [records] = useState<RwRecordItem[]>(mockRecords)
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * 筛选后的记录
   */
  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records
    return records.filter((record) => record.status === filter)
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
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  /**
   * 处理页码变化
   * @param {number} page - 页码
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
            const status = statusConfig[record.status]

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
                    <span className="font-medium text-sm text-xf-dark">{record.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.bgColor} ${status.textColor}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-xf-accent font-semibold">
                      <Gift className="w-3 h-3" />
                      {record.points} 积分
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
