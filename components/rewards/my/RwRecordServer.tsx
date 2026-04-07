import { Gift, Calendar } from '@/components/icons'
import { getExchangeRecords } from '@/lib/rewards/shop'
import { formatDateISO } from '@/lib/utils/date'
import type { ExchangeStatus } from '@/types/rewards'

/**
 * 兑换记录服务端组件
 * @module components/rewards/my/RwRecordServer
 * @description 服务端渲染兑换记录列表
 * @优化说明 改为Server Component，减少客户端JS体积
 */

/**
 * 状态配置映射
 * @constant statusConfig
 */
const statusConfig: Record<
  ExchangeStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  pending: { label: '待处理', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  processing: { label: '处理中', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  issued: { label: '已发放', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  used: { label: '已使用', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  expired: { label: '已过期', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
  cancelled: { label: '已取消', bgColor: 'bg-red-100', textColor: 'text-red-600' },
}

interface RwRecordServerProps {
  /** 筛选状态 */
  filter?: 'all' | ExchangeStatus
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}



/**
 * 兑换记录服务端组件
 * @param {RwRecordServerProps} props - 组件属性
 * @returns {JSX.Element} 兑换记录列表
 */
export async function RwRecordServer({
  filter = 'all',
  page = 1,
  pageSize = 5,
}: RwRecordServerProps) {
  // 服务端获取兑换记录
  const records = await getExchangeRecords({ limit: 50, offset: 0 })

  // 筛选
  const filteredRecords =
    filter === 'all' ? records : records.filter((record) => record.status === filter)

  // 分页
  const totalPages = Math.ceil(filteredRecords.length / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const currentRecords = filteredRecords.slice(start, end)

  // 空状态
  if (currentRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xf-primary">暂无兑换记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {currentRecords.map((record) => {
        const status = statusConfig[record.status]
        const itemName = record.item?.name || '未知商品'

        return (
          <div
            key={record.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-xf-primary/20 transition-colors"
          >
            {/* 图标 */}
            <div className="w-10 h-10 rounded-full bg-xf-primary/10 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-xf-primary" />
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xf-dark text-sm">{itemName}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${status.bgColor} ${status.textColor}`}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-xf-medium" />
                <span className="text-xs text-xf-medium">{formatDateISO(record.created_at)}</span>
              </div>
            </div>

            {/* 消耗积分 */}
            <div className="shrink-0">
              <span className="text-xf-accent font-bold">-{record.points_spent}</span>
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
