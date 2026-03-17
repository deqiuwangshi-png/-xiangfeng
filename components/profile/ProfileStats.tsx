/**
 * 数据统计组件
 * 
 * 作用: 显示用户的数据统计信息
 * @returns {JSX.Element} 数据统计组件
 * 更新时间: 2026-02-20
 */

import { FileText, Users, ThumbsUp, Share2 } from 'lucide-react'
import type { UserStats } from '@/lib/settings/actions'

/**
 * 统计项接口
 * 
 * @interface StatItem
 * @property {string} value - 统计数值
 * @property {string} label - 统计标签
 * @property {React.ElementType} icon - 统计图标组件
 * @property {string} iconGradient - 图标背景渐变类
 * @property {string} iconColor - 图标颜色类
 */
interface StatItem {
  value: string
  label: string
  icon: React.ElementType
  iconGradient: string
  iconColor: string
}

/**
 * 统计数据配置
 * 
 * @param stats 用户统计数据
 * @returns 统计项配置数组
 */
function getStatsData(stats: UserStats): StatItem[] {
  return [
    {
      value: String(stats.articles),
      label: '文章',
      icon: FileText,
      iconGradient: 'from-blue-100 to-blue-200',
      iconColor: 'text-xf-info'
    },
    {
      value: String(stats.followers),
      label: '关注者',
      icon: Users,
      iconGradient: 'from-purple-100 to-purple-200',
      iconColor: 'text-xf-primary'
    },
    {
      value: String(stats.likes),
      label: '获赞',
      icon: ThumbsUp,
      iconGradient: 'from-indigo-100 to-indigo-200',
      iconColor: 'text-xf-accent'
    },
    {
      value: String(stats.nodes),
      label: '节点',
      icon: Share2,
      iconGradient: 'from-green-100 to-green-200',
      iconColor: 'text-xf-success'
    }
  ]
}

/**
 * 数据统计组件
 * 
 * @function ProfileStats
 * @param {Object} props - 组件属性
 * @param {UserStats} props.stats - 用户统计数据
 * @returns {JSX.Element} 数据统计组件
 * 
 * @description
 * 提供用户数据统计的完整功能，包括：
 * - 文章数量
 * - 关注者数量
 * - 获赞数量
 * - 节点数量
 * 
 * @layout
 * - 使用 grid 布局
 * - 响应式设计（移动端2列，桌面端4列）
 * - 所有间距完全复制原型数值
 */
export function ProfileStats({ stats }: { stats: UserStats }) {
  const statsData = getStatsData(stats)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {statsData.map((stat) => (
        <div key={stat.label} className="profile-stats-item card-bg rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-xf-accent mb-1">{stat.value}</div>
              <div className="text-sm text-xf-primary font-medium">{stat.label}</div>
            </div>
            <div className={`w-10 h-10 rounded-full bg-linear-to-tr ${stat.iconGradient} flex items-center justify-center ${stat.iconColor}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
