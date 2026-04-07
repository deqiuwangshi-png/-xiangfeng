/**
 * 灵感热力图视图组件 - 客户端交互层
 * @module components/profile/HeatMapView
 * @description 负责热力图的交互逻辑和展示，数据由服务端传入
 *
 * @文件名限制 严格小于12字符: HeatMapView.tsx (11字符)
 */

'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeatMapData } from '@/lib/thoughts/queries'
import { formatDateShort } from '@/lib/utils/date'

/**
 * 热力图视图组件Props
 * @interface HeatMapViewProps
 * @property {HeatMapData[]} initialData - 服务端传入的热力图数据
 */
interface HeatMapViewProps {
  initialData: HeatMapData[]
}

/**
 * 思考深度对应的颜色
 * 使用暖色调渐变：从浅琥珀到深赭石
 * 避免程序员绿色系，营造人文/艺术氛围
 */
const DEPTH_COLORS = [
  'bg-stone-100',           // 0 - 无记录
  'bg-amber-100',           // 1 - 浅思
  'bg-amber-200',           // 2 - 沉思
  'bg-orange-200',          // 3 - 深思
  'bg-orange-300',          // 4 - 顿悟
  'bg-amber-700',           // 5 - 灵感爆发
]

/**
 * 思考深度描述
 */
const DEPTH_LABELS = ['静', '浅', '沉', '深', '悟', '燃']

/**
 * 获取颜色等级
 * @param {number} count - 思考深度 (0-5)
 * @returns {string} Tailwind颜色类
 */
function getColorLevel(count: number): string {
  return DEPTH_COLORS[Math.min(count, 5)] || DEPTH_COLORS[0]
}



/**
 * 获取月份标签
 * @param {string} dateStr - 日期字符串
 * @returns {string} 月份
 */
function getMonthLabel(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月`
}

/**
 * 灵感热力图视图组件
 *
 * @function HeatMapView
 * @param {HeatMapViewProps} props - 组件属性
 * @returns {JSX.Element} 热力图视图组件
 *
 * @description
 * 纯客户端组件，负责：
 * - 接收服务端传入的数据
 * - 处理翻页等交互逻辑
 * - 渲染热力图展示
 */
export function HeatMapView({ initialData }: HeatMapViewProps) {
  // 交互状态：当前页码
  const [currentPage, setCurrentPage] = useState(0)
  const WEEKS_PER_VIEW = 12 // 每次显示12周

  // 使用服务端传入的数据
  const heatData = initialData

  /**
   * 将数据按周分组
   */
  const weeksData = useMemo(() => {
    const result: { week: HeatMapData[]; monthLabel?: string }[] = []
    const today = new Date()
    const totalWeeks = 26 // 显示最近26周（约半年）

    for (let w = 0; w < totalWeeks; w++) {
      const week: HeatMapData[] = []
      let monthLabel: string | undefined

      for (let d = 0; d < 7; d++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (totalWeeks - 1 - w) * 7 - (6 - d))
        const dateStr = date.toISOString().split('T')[0]
        const item = heatData.find((h) => h.date === dateStr)

        // 记录月份标签（每周的第一天）
        if (d === 0) {
          monthLabel = getMonthLabel(dateStr)
        }

        week.push(
          item || {
            date: dateStr,
            count: 0,
          }
        )
      }

      result.push({ week, monthLabel })
    }

    return result
  }, [heatData])

  // 分页数据
  const totalPages = Math.ceil(weeksData.length / WEEKS_PER_VIEW)
  const visibleWeeks = weeksData.slice(
    currentPage * WEEKS_PER_VIEW,
    (currentPage + 1) * WEEKS_PER_VIEW
  )

  /**
   * 计算统计信息 - 强调质而非量
   */
  const stats = useMemo(() => {
    const activeDays = heatData.filter((item) => item.count > 0)
    const deepThoughts = activeDays.filter((item) => item.count >= 3)
    const sparkMoments = activeDays.filter((item) => item.count >= 4)

    // 计算有记录的不同领域数
    const domains = new Set(activeDays.map((item) => item.domain).filter(Boolean))

    return {
      totalRecords: activeDays.length,
      deepThoughts: deepThoughts.length,
      sparkMoments: sparkMoments.length,
      domains: domains.size,
    }
  }, [heatData])

  // 星期标签 - 简化显示（只在关键位置显示）
  const weekDays = ['日', '一', '', '三', '', '五', '']

  // 计算月份标签位置
  const monthLabels = useMemo(() => {
    const labels: { month: string; index: number }[] = []
    let lastMonth = ''

    visibleWeeks.forEach((item, idx) => {
      if (item.monthLabel && item.monthLabel !== lastMonth) {
        labels.push({ month: item.monthLabel, index: idx })
        lastMonth = item.monthLabel
      }
    })

    return labels
  }, [visibleWeeks])

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <h3 className="text-base font-medium text-xf-medium">
        你所经历、所遇见、所感念的，都会成为你世界地图上的坐标
      </h3>

      {/* 统计概览 - 强调质而非量 */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-light text-xf-dark">{stats.deepThoughts}</span>
          <span className="text-xf-medium">次深度思考</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-light text-xf-dark">{stats.sparkMoments}</span>
          <span className="text-xf-medium">个灵感时刻</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-light text-xf-dark">{stats.domains}</span>
          <span className="text-xf-medium">个思考维度</span>
        </div>
      </div>

      {/* 热力图区域 - GitHub风格紧凑布局 */}
      <div className="relative">
        {/* 月份标签 - 绝对定位，与格子精确对齐 */}
        <div className="relative h-4 mb-1">
          {monthLabels.map((label) => (
            <span
              key={`${label.month}-${label.index}`}
              className="absolute text-[10px] text-xf-light"
              style={{
                left: `${28 + label.index * 16}px`, // 28px是星期标签宽度 + gap，16px是每周宽度(12px) + gap(4px)
              }}
            >
              {label.month}
            </span>
          ))}
        </div>

        {/* 热力图主体 */}
        <div className="flex gap-1">
          {/* 星期标签 */}
          <div className="flex flex-col gap-[3px] mr-2">
            {weekDays.map((day, i) => (
              <div
                key={day || i}
                className="text-[10px] text-xf-light w-5 h-3 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 热力格子 */}
          {visibleWeeks.map((item, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {item.week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-[2px] ${getColorLevel(
                    day.count
                  )} transition-all duration-300 hover:scale-125 hover:shadow-sm cursor-pointer`}
                  title={
                    day.count > 0
                      ? `${formatDateShort(day.date)} · ${DEPTH_LABELS[day.count]}思${
                          day.domain ? ` · ${day.domain}` : ''
                        }${day.insight ? `\n${day.insight}` : ''}`
                      : formatDateShort(day.date)
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* 翻页控件 - 精致隐形设计 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-xf-bg/40">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 text-xs text-xf-medium hover:text-xf-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>更早</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentPage
                      ? 'bg-xf-accent w-3'
                      : 'bg-xf-bg hover:bg-xf-light/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-1 text-xs text-xf-medium hover:text-xf-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span>更近</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 图例 - 人文风格 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-xf-light">思考深度</span>
          <div className="flex items-center gap-1">
            {DEPTH_LABELS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-[2px] ${DEPTH_COLORS[i]}`}
                />
                <span className="text-[9px] text-xf-light">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 提示文字 */}
        <p className="text-xs text-xf-light italic">
          思想的痕迹，如墨入水，深浅自知
        </p>
      </div>
    </div>
  )
}
