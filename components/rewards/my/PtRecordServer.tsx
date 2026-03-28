import {
  Plus,
  Minus,
  CheckCircle2,
  Gift,
  Star,
  Clock,
  Award,
  Heart,
  type LucideIcon,
} from '@/components/icons'
import { getPointTransactions } from '@/lib/rewards/actions/points'
import type { PointTransaction, PointSourceType } from '@/types/rewards'

/**
 * 积分记录服务端组件
 * @module components/rewards/my/PtRecordServer
 * @description 服务端渲染积分记录列表
 * @优化说明 改为Server Component，减少客户端JS体积
 */

/**
 * 积分记录项接口
 * @interface PtRecordItem
 */
interface PtRecordItem {
  id: string
  type: 'earn' | 'spend'
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

interface PtRecordServerProps {
  /** 筛选类型 */
  filter?: 'all' | 'earn' | 'spend'
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 积分记录服务端组件
 * @param {PtRecordServerProps} props - 组件属性
 * @returns {JSX.Element} 积分记录列表
 */
export async function PtRecordServer({
  filter = 'all',
  page = 1,
  pageSize = 10,
}: PtRecordServerProps) {
  // 服务端获取积分记录
  const transactions = await getPointTransactions({ limit: 100, offset: 0 })

  // 转换为展示数据
  const records = transactions.map(mapTransactionToRecord)

  // 筛选
  const filteredRecords =
    filter === 'all' ? records : records.filter((record) => record.type === filter)

  // 分页
  const totalPages = Math.ceil(filteredRecords.length / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const currentRecords = filteredRecords.slice(start, end)

  // 空状态
  if (currentRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xf-primary">暂无积分记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {currentRecords.map((record) => {
        const Icon = record.icon
        return (
          <div
            key={record.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-xf-primary/20 transition-colors"
          >
            {/* 图标 */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50`}>
              <Icon className={`w-5 h-5 ${record.iconColor}`} />
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xf-dark text-sm">{record.source}</span>
                <span className="text-xs text-xf-medium">{record.date}</span>
              </div>
              <p className="text-xs text-xf-primary mt-0.5 truncate">{record.description}</p>
            </div>

            {/* 积分变动 */}
            <div className="flex items-center gap-1 shrink-0">
              {record.type === 'earn' ? (
                <>
                  <Plus className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-bold">{record.points}</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 text-xf-accent" />
                  <span className="text-xf-accent font-bold">{record.points}</span>
                </>
              )}
            </div>
          </div>
        )
      })}

      {/* 分页信息 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <span className="text-sm text-xf-primary">
            第 {page} / {totalPages} 页
          </span>
        </div>
      )}
    </div>
  )
}
