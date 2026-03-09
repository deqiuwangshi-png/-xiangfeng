'use client'

/**
 * 积分记录组件
 * @module components/rewards/my/PtRecord
 * @description 显示用户的积分获得和消耗记录，支持筛选和分页
 */

import { useState, useMemo } from 'react'
import { Plus, Minus, Calendar, CheckCircle2, Edit3, Gift, Star } from '@/components/icons'
import { Pagination } from '@/components/drafts/navigation/Pagination'

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
  icon: React.ElementType
  iconColor: string
}

/**
 * 模拟积分记录数据
 * @constant mockRecords
 */
const mockRecords: PtRecordItem[] = [
  { id: '1', type: 'earn', points: 10, source: '每日签到', description: '连续签到第3天', date: '2024-05-15', icon: CheckCircle2, iconColor: 'text-green-600' },
  { id: '2', type: 'spend', points: 500, source: '兑换商品', description: '电子书券', date: '2024-05-12', icon: Gift, iconColor: 'text-xf-accent' },
  { id: '3', type: 'earn', points: 50, source: '发布文章', description: '文章《如何高效写作》获得点赞', date: '2024-05-10', icon: Edit3, iconColor: 'text-xf-primary' },
  { id: '4', type: 'earn', points: 20, source: '完成任务', description: '完善个人资料', date: '2024-05-09', icon: Star, iconColor: 'text-amber-600' },
  { id: '5', type: 'spend', points: 880, source: '兑换商品', description: '7天会员', date: '2024-05-08', icon: Gift, iconColor: 'text-xf-accent' },
  { id: '6', type: 'earn', points: 10, source: '每日签到', description: '连续签到第1天', date: '2024-05-08', icon: CheckCircle2, iconColor: 'text-green-600' },
  { id: '7', type: 'earn', points: 30, source: '评论互动', description: '优质评论获得作者点赞', date: '2024-05-07', icon: Edit3, iconColor: 'text-xf-primary' },
  { id: '8', type: 'spend', points: 200, source: '兑换商品', description: '咖啡折扣券', date: '2024-05-05', icon: Gift, iconColor: 'text-xf-accent' },
  { id: '9', type: 'earn', points: 100, source: '邀请好友', description: '好友成功注册', date: '2024-05-03', icon: Star, iconColor: 'text-amber-600' },
  { id: '10', type: 'earn', points: 10, source: '每日签到', description: '连续签到第5天', date: '2024-05-01', icon: CheckCircle2, iconColor: 'text-green-600' },
  { id: '11', type: 'spend', points: 80, source: '兑换商品', description: '表情包', date: '2024-04-28', icon: Gift, iconColor: 'text-xf-accent' },
  { id: '12', type: 'earn', points: 50, source: '文章被收藏', description: '文章《写作技巧分享》被收藏10次', date: '2024-04-25', icon: Edit3, iconColor: 'text-xf-primary' },
]

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
  const [records] = useState<PtRecordItem[]>(mockRecords)
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)

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
