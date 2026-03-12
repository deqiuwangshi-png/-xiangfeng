'use client'

/**
 * 支付方式管理组件
 *
 * 作用: 显示和管理用户的支付方式（微信、支付宝、银行卡）
 *
 * @returns {JSX.Element} 支付方式管理组件
 *
 * 更新时间: 2026-03-11
 */

import { toast } from 'sonner'
import { CreditCard, PlusCircle, Edit2 } from '@/components/icons'
import { Smartphone } from 'lucide-react'

/**
 * 支付方式接口
 *
 * @interface PaymentMethod
 */
interface PaymentMethod {
  id: string
  type: 'wechat' | 'alipay' | 'bank'
  name: string
  account: string
  isDefault?: boolean
}

/**
 * 支付方式数据（模拟）
 *
 * @constant paymentMethodsData
 */
const paymentMethodsData: PaymentMethod[] = [
  {
    id: '1',
    type: 'wechat',
    name: '微信支付',
    account: '尾号 8912',
    isDefault: true
  },
  {
    id: '2',
    type: 'alipay',
    name: '支付宝',
    account: '尾号 3456'
  },
  {
    id: '3',
    type: 'bank',
    name: '招商银行',
    account: '储蓄卡 · 尾号 2378'
  }
]

/**
 * 获取支付方式图标和颜色
 *
 * @param {string} type - 支付方式类型
 * @returns {object} 图标和颜色配置
 */
function getPaymentStyle(type: string) {
  switch (type) {
    case 'wechat':
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        icon: Smartphone
      }
    case 'alipay':
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        icon: Smartphone
      }
    case 'bank':
      return {
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        icon: CreditCard
      }
    default:
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        icon: CreditCard
      }
  }
}

/**
 * 支付方式管理组件
 *
 * @returns {JSX.Element} 支付方式管理组件
 */
export function PaymentMethods() {
  /**
   * 处理添加支付方式
   *
   * @returns {void}
   */
  const handleAddPayment = () => {
    toast.info('添加支付方式功能（待实现）')
  }

  /**
   * 处理编辑支付方式
   *
   * @param {string} id - 支付方式ID
   * @returns {void}
   */
  const handleEditPayment = (id: string) => {
    toast.info(`编辑支付方式 ${id}（待实现）`)
  }

  return (
    <div className="stat-card rounded-2xl p-6 mb-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-bold text-xf-accent flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          支付方式
        </h2>
        <button
          onClick={handleAddPayment}
          className="text-sm text-xf-info hover:underline flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          添加新卡
        </button>
      </div>

      {/* 支付方式列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethodsData.map((method) => {
          const style = getPaymentStyle(method.type)
          const Icon = style.icon

          return (
            <div
              key={method.id}
              className="border border-xf-bg/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer"
            >
              {/* 图标 */}
              <div className={`w-10 h-10 rounded-full ${style.bgColor} flex items-center justify-center ${style.textColor} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-xf-dark truncate">{method.name}</p>
                  {method.isDefault && (
                    <span className="text-[10px] bg-xf-primary/10 text-xf-primary px-1.5 py-0.5 rounded">
                      默认
                    </span>
                  )}
                </div>
                <p className="text-xs text-xf-primary truncate">{method.account}</p>
              </div>

              {/* 编辑按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditPayment(method.id)
                }}
                className="text-xf-medium p-1 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>

      {/* 提示信息 */}
      <p className="text-xs text-xf-medium mt-4">
        提示：添加支付方式后可用于提现收款。请确保账户信息准确无误。
      </p>
    </div>
  )
}
