'use client'

/**
 * 提现模态框组件
 * 
 * 作用: 显示提现申请模态框
 * 
 * @returns {JSX.Element} 提现模态框组件
 * 
 * 使用说明:
 *   - 使用 Client Component 处理交互
 *   - 使用 lucide-react 图标组件
 *   - 所有间距完全复制原型数值
 *   - 通过 CustomEvent 触发显示/隐藏
 * 
 * 更新时间: 2026-02-20
 */

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { X } from '@/components/icons'

/**
 * 提现方式接口
 * 
 * @interface WithdrawMethod
 * @property {string} id - 方式ID
 * @property {string} name - 方式名称
 */
interface WithdrawMethod {
  id: string
  name: string
}

/**
 * 提现方式数据
 * 
 * @constant withdrawMethods
 * @description 定义提现方式
 */
const withdrawMethods: WithdrawMethod[] = [
  { id: 'wechat', name: '微信支付' },
  { id: 'alipay', name: '支付宝' }
]

/**
 * 提现模态框组件
 * 
 * @returns {JSX.Element} 提现模态框组件
 */
export function WithdrawModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('2847.50')
  const [selectedMethod, setSelectedMethod] = useState('wechat')

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-withdraw-modal', handleOpen)
    return () => window.removeEventListener('open-withdraw-modal', handleOpen)
  }, [])

  /**
   * 处理模态框关闭
   * 
   * @returns {void}
   */
  const handleClose = () => {
    setIsOpen(false)
  }

  /**
   * 处理背景点击关闭
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - 鼠标事件
   * @returns {void}
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  /**
   * 处理提现提交
   *
   * @returns {void}
   */
  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('请输入有效的提现金额')
      return
    }
    // 提交提现申请
    toast.success(`提现申请已提交：¥${amount}`)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold text-xf-accent">提现申请</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-xf-dark mb-2">提现金额</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-xf-bg/50 focus:border-xf-primary"
                placeholder="输入提现金额"
              />
            </div>
            <p className="text-sm text-xf-primary mt-2">可提现余额：¥2,847.50</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-xf-dark mb-2">到账方式</label>
            <div className="grid grid-cols-2 gap-3">
              {withdrawMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`py-3 rounded-xl font-medium ${
                    selectedMethod === method.id
                      ? 'bg-xf-primary text-white'
                      : 'bg-xf-light border border-xf-bg/50 text-xf-primary'
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-xf-primary text-white rounded-xl font-medium"
          >
            确认提现
          </button>
        </div>
      </div>
    </div>
  )
}
