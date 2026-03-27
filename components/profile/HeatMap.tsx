/**
 * 灵感热力图组件
 * @module components/profile/HeatMap
 * @description 展示用户在不同领域的思考频次，类似GitHub提交记录
 *
 * @文件名限制 严格小于12字符: HeatMap.tsx (8字符)
 */

'use client'

import { useMemo } from 'react'

/**
 * 热力图数据项
 * @interface HeatMapItem
 * @property {string} date - 日期 (YYYY-MM-DD)
 * @property {number} count - 思考次数
 * @property {string} [domain] - 领域标签
 */
interface HeatMapItem {
  date: string
  count: number
  domain?: string
}

/**
 * 灵感热力图组件Props
 * @interface HeatMapProps
 * @property {HeatMapItem[]} [data] - 热力图数据
 * @property {number} [weeks] - 显示周数 (默认52周)
 */
interface HeatMapProps {
  data?: HeatMapItem[]
  weeks?: number
}

/**
 * 获取颜色等级
 * @param {number} count - 思考次数
 * @returns {string} Tailwind颜色类
 */
function getColorLevel(count: number): string {
  if (count === 0) return 'bg-xf-bg/60'
  if (count <= 2) return 'bg-emerald-200'
  if (count <= 4) return 'bg-emerald-300'
  if (count <= 6) return 'bg-emerald-400'
  return 'bg-emerald-500'
}

/**
 * 生成模拟数据（渐进开发阶段1）
 * @param {number} weeks - 周数
 * @returns {HeatMapItem[]} 模拟数据
 */
function generateMockData(weeks: number): HeatMapItem[] {
  const data: HeatMapItem[] = []
  const today = new Date()
  const domains = ['技术', '产品', '设计', '商业', '生活']

  for (let i = 0; i < weeks * 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // 随机生成思考记录（约30%概率有记录）
    if (Math.random() > 0.7) {
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8) + 1,
        domain: domains[Math.floor(Math.random() * domains.length)],
      })
    }
  }

  return data.reverse()
}

/**
 * 灵感热力图组件
 *
 * @function HeatMap
 * @param {HeatMapProps} props - 组件属性
 * @returns {JSX.Element} 热力图组件
 *
 * @渐进开发
 * 阶段1: 基础热力图展示（当前）
 * 阶段2: 添加领域筛选
 * 阶段3: 添加悬停详情
 * 阶段4: 添加点击交互
 */
export function HeatMap({ data, weeks = 52 }: HeatMapProps) {
  // 使用模拟数据或传入数据
  const heatData = useMemo(() => data || generateMockData(weeks), [data, weeks])

  /**
   * 将数据按周分组
   * @returns {HeatMapItem[][]} 按周分组的数据
   */
  const weeksData = useMemo(() => {
    const result: HeatMapItem[][] = []
    const today = new Date()

    for (let w = 0; w < weeks; w++) {
      const week: HeatMapItem[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (weeks - 1 - w) * 7 - (6 - d))
        const dateStr = date.toISOString().split('T')[0]
        const item = heatData.find((h) => h.date === dateStr)
        week.push(
          item || {
            date: dateStr,
            count: 0,
          }
        )
      }
      result.push(week)
    }

    return result
  }, [heatData, weeks])

  /**
   * 计算统计信息
   */
  const stats = useMemo(() => {
    const total = heatData.reduce((sum, item) => sum + item.count, 0)
    const activeDays = heatData.filter((item) => item.count > 0).length
    const maxStreak = (() => {
      let max = 0
      let current = 0
      for (const item of heatData) {
        if (item.count > 0) {
          current++
          max = Math.max(max, current)
        } else {
          current = 0
        }
      }
      return max
    })()

    return { total, activeDays, maxStreak }
  }, [heatData])

  // 星期标签
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="space-y-4">
      {/* 统计概览 */}
      <div className="flex gap-6 text-sm">
        <div>
          <span className="text-xf-medium">总思考次数: </span>
          <span className="font-semibold text-xf-dark">{stats.total}</span>
        </div>
        <div>
          <span className="text-xf-medium">活跃天数: </span>
          <span className="font-semibold text-xf-dark">{stats.activeDays}</span>
        </div>
        <div>
          <span className="text-xf-medium">最长连续: </span>
          <span className="font-semibold text-xf-dark">{stats.maxStreak}天</span>
        </div>
      </div>

      {/* 热力图 */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {/* 星期标签 */}
          <div className="flex flex-col gap-1 mr-2">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`text-xs text-xf-light w-4 h-4 flex items-center justify-center ${
                  i % 2 === 1 ? 'opacity-0' : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 热力格子 */}
          {weeksData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getColorLevel(
                    day.count
                  )} transition-all hover:ring-2 hover:ring-xf-accent/30 cursor-pointer`}
                  title={`${day.date}: ${day.count}次思考${
                    day.domain ? ` (${day.domain})` : ''
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-2 text-xs text-xf-medium">
        <span>少</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-xf-bg/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-200" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        </div>
        <span>多</span>
      </div>
    </div>
  )
}

/**
 * 热力图骨架屏
 * @returns {JSX.Element} 骨架屏组件
 */
export function HeatMapSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* 统计骨架 */}
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-24 bg-xf-bg/60 rounded" />
        ))}
      </div>

      {/* 热力图骨架 */}
      <div className="flex gap-1">
        {Array.from({ length: 52 }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} className="w-3 h-3 rounded-sm bg-xf-bg/60" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
