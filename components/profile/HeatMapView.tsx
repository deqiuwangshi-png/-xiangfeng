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

const HEAT_COLORS = [
  'bg-stone-100', // 无记录
  'bg-amber-200', // 互动/轻度
  'bg-orange-400', // 创作/深度
]

const HEAT_LABELS = ['无记录', '互动', '创作']

function getHeatLevel(count: number): number {
  if (count <= 0) return 0
  if (count >= 3) return 2
  return 1
}

function getColorLevel(count: number): string {
  return HEAT_COLORS[getHeatLevel(count)] || HEAT_COLORS[0]
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
   * 计算统计信息
   */
  const stats = useMemo(() => {
    const activeDays = heatData.filter((item) => item.count > 0)
    const articleDays = activeDays.filter((item) => item.count >= 3)
    const interactionDays = activeDays.filter((item) => item.count > 0 && item.count < 3)

    // 计算有记录的不同领域数
    const domains = new Set(activeDays.map((item) => item.domain).filter(Boolean))

    return {
      activeDays: activeDays.length,
      articleDays: articleDays.length,
      interactionDays: interactionDays.length,
      domains: domains.size,
    }
  }, [heatData])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

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
    <section className="rounded-xl border border-xf-bg/70 bg-white p-4 sm:p-5 space-y-5">
      {/* 标题区 */}
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-xf-dark">思想轨迹</h3>
        <p className="text-xs sm:text-sm text-xf-medium">
          最近半年你的思考活跃分布（按周展示）
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg bg-xf-bg/40 px-3 py-2">
          <p className="text-[11px] text-xf-medium">活跃天数</p>
          <p className="text-lg font-semibold text-xf-dark">{stats.activeDays}</p>
        </div>
        <div className="rounded-lg bg-xf-bg/40 px-3 py-2">
          <p className="text-[11px] text-xf-medium">创作日</p>
          <p className="text-lg font-semibold text-xf-dark">{stats.articleDays}</p>
        </div>
        <div className="rounded-lg bg-xf-bg/40 px-3 py-2">
          <p className="text-[11px] text-xf-medium">互动日</p>
          <p className="text-lg font-semibold text-xf-dark">{stats.interactionDays}</p>
        </div>
        <div className="rounded-lg bg-xf-bg/40 px-3 py-2">
          <p className="text-[11px] text-xf-medium">思考维度</p>
          <p className="text-lg font-semibold text-xf-dark">{stats.domains}</p>
        </div>
      </div>

      {/* 热力图 */}
      <div className="relative">
        {/* 月份标签 - 绝对定位，与格子精确对齐 */}
        <div className="relative h-4 mb-1">
          {monthLabels.map((label) => (
            <span
              key={`${label.month}-${label.index}`}
              className="absolute text-[10px] text-xf-light"
              style={{
                left: `${32 + label.index * 20}px`,
              }}
            >
              {label.month}
            </span>
          ))}
        </div>

        {/* 热力图主体 */}
        <div className="flex gap-1">
          {/* 星期标签 */}
          <div className="flex flex-col gap-1 mr-2">
            {weekDays.map((day, i) => (
              <div
                key={day || i}
                className="text-[11px] text-xf-light w-6 h-4 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 热力格子 */}
          {visibleWeeks.map((item, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {item.week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${getColorLevel(
                    day.count
                  )} transition-all duration-150 hover:scale-110 hover:ring-1 hover:ring-xf-dark/20 cursor-pointer`}
                  title={
                    day.count > 0
                      ? `${formatDateShort(day.date)} · ${
                          day.count >= 3 ? '创作' : '互动'
                        }${
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
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-xf-bg/40">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 text-xs text-xf-medium hover:text-xf-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>更早</span>
            </button>

            <div className="text-xs text-xf-medium">
              第 {currentPage + 1} / {totalPages} 段
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
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

      {/* 图例 */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-xf-light">图例</span>
        <div className="flex items-center gap-2">
          {HEAT_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-3.5 h-3.5 rounded-sm ${HEAT_COLORS[i]}`} />
              <span className="text-xs text-xf-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
