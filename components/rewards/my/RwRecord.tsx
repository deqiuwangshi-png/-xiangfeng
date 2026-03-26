'use client'

/**
 * 兑换记录组件
 * @module components/rewards/my/RwRecord
 * @description 显示用户的兑换记录，支持状态筛选和分页
 */

import { useState, useMemo, useEffect } from 'react'
import {
  BookOpen,
  Crown,
  Coffee,
  Sticker,
  Calendar,
  Gift,
  ShoppingBag,
  Film,
  Music,
  Smartphone,
  CupSoda,
  Palette,
  Sparkles,
  Zap,
  type LucideIcon,
} from '@/components/icons'
import { Pagination } from '@/components/drafts/navigation/Pagination'
import { getExchangeRecords } from '@/lib/rewards/actions'
import type { ExchangeRecordWithItem, ExchangeStatus } from '@/types/rewards'

/**
 * 筛选类型
 * @type FilterType
 */
type FilterType = 'all' | ExchangeStatus

/**
 * 兑换记录展示项接口
 * @interface RwRecordItem
 */
interface RwRecordItem {
  id: string
  name: string
  points: number
  status: ExchangeStatus
  date: string
  icon: LucideIcon
  iconColor: string
}

/**
 * 图标映射配置
 * @constant iconMapping
 */
const iconMapping: Record<string, { icon: LucideIcon; color: string }> = {
  Coffee: { icon: Coffee, color: 'text-xf-primary' },
  Film: { icon: Film, color: 'text-xf-accent' },
  Music: { icon: Music, color: 'text-xf-accent' },
  Crown: { icon: Crown, color: 'text-amber-600' },
  ShoppingBag: { icon: ShoppingBag, color: 'text-xf-primary' },
  Bookmark: { icon: BookOpen, color: 'text-xf-primary' },
  Smartphone: { icon: Smartphone, color: 'text-xf-primary' },
  CupSoda: { icon: CupSoda, color: 'text-xf-info' },
  BookOpen: { icon: BookOpen, color: 'text-xf-accent' },
  Palette: { icon: Palette, color: 'text-purple-600' },
  Sparkles: { icon: Sparkles, color: 'text-rose-500' },
  Gift: { icon: Gift, color: 'text-rose-500' },
  Zap: { icon: Zap, color: 'text-amber-600' },
  Sticker: { icon: Sticker, color: 'text-xf-primary' },
}

/**
 * 获取默认图标配置
 * @returns {Object} 默认图标和颜色
 */
function getDefaultIcon() {
  return { icon: Gift, color: 'text-xf-accent' }
}

/**
 * 将兑换记录转换为展示格式
 * @param {ExchangeRecordWithItem} record - 兑换记录
 * @returns {RwRecordItem} 展示用记录项
 */
function mapExchangeToRecord(record: ExchangeRecordWithItem): RwRecordItem {
  const iconName = record.item?.icon_name || 'Gift'
  const iconColor = record.item?.icon_color || ''
  const iconConfig = iconMapping[iconName] || getDefaultIcon()

  return {
    id: record.id,
    name: record.item?.name || '未知商品',
    points: record.points_spent,
    status: record.status,
    date: new Date(record.created_at).toISOString().split('T')[0],
    icon: iconConfig.icon,
    iconColor: iconColor || iconConfig.color,
  }
}

/**
 * 状态配置
 * @constant statusConfig
 */
const statusConfig: Record<
  ExchangeStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  pending: { label: '待审核', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  processing: { label: '处理中', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  issued: { label: '已发放', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  used: { label: '已使用', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  expired: { label: '已过期', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
  cancelled: { label: '已取消', bgColor: 'bg-red-100', textColor: 'text-red-700' },
}

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
  const [records, setRecords] = useState<ExchangeRecordWithItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * 加载兑换记录（P1-3: 服务端已关联查询商品详情，无需二次请求）
   */
  useEffect(() => {
    async function loadRecords() {
      try {
        setIsLoading(true)
        const data = await getExchangeRecords({ limit: 50 })
        setRecords(data)
      } catch {
        // 加载失败时保持空状态
      } finally {
        setIsLoading(false)
      }
    }

    loadRecords()
  }, [])

  /**
   * 转换后的记录列表（P1-3: 直接使用服务端返回的商品详情）
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

  /**
   * 加载中状态
   */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
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
