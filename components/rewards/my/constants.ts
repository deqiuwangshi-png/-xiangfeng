/**
 * 常量配置
 * @module components/rewards/my/constants
 * @description 我的奖励页面常量定义
 */

import type { ExchangeStatus } from '@/types/rewards'

/**
 * 状态配置
 * @constant statusConfig
 */
export const statusConfig: Record<
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
