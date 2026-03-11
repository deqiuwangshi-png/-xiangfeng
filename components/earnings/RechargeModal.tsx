'use client'

/**
 * 充值模态框组件
 *
 * 作用: 显示余额充值模态框
 *
 * @returns {JSX.Element} 充值模态框组件
 *
 * 使用说明:
 *   - 使用 Client Component 处理交互
 *   - 使用 lucide-react 图标组件
 *   - 通过 CustomEvent 触发显示/隐藏
 *
 * 更新时间: 2026-03-11
 */

import { useState, useEffect } from 'react'
import { X } from '@/components/icons'
import { Smartphone } from 'lucide-react'

/**
 * 支付方式接口
 *
 * @interface PaymentMethod
 * @property {string} id - 方式ID
 * @property {string} name - 方式名称
 * @property {React.ElementType} icon - 图标组件
 */
interface PaymentMethod {
  id: string
  name: string
  icon: React.ElementType
}

/**
 * 支付方式数据
 *
 * @constant paymentMethods
 * @description 定义充值支付方式
 */
const paymentMethods: PaymentMethod[] = [
  { id: 'alipay', name: '支付宝', icon: Smartphone },
  { id: 'wechat', name: '微信支付', icon: Smartphone }
]

/**
 * 快捷充值金额选项
 *
 * @constant quickAmounts
 */
const quickAmounts = [1, 10, 50, 100, 200, 500]

/**
 * 充值模态框组件
 *
 * @returns {JSX.Element} 充值模态框组件
 */
export function RechargeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('100')
  const [selectedMethod, setSelectedMethod] = useState('alipay')
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  /**
   * 监听打开事件
   */
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-recharge-modal', handleOpen)
    return () => window.removeEventListener('open-recharge-modal', handleOpen)
  }, [])

  /**
   * 处理模态框关闭
   *
   * @returns {void}
   */
  const handleClose = () => {
    setIsOpen(false)
    setIsCustom(false)
    setCustomAmount('')
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
   * 处理快捷金额选择
   *
   * @param {number} value - 金额值
   * @returns {void}
   */
  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
    setIsCustom(false)
    setCustomAmount('')
  }

  /**
   * 处理自定义金额输入
   *
   * @param {string} value - 输入值
   * @returns {void}
   */
  const handleCustomAmount = (value: string) => {
    setIsCustom(true)
    setCustomAmount(value)
    setAmount(value)
  }

  /**
   * 处理充值提交
   *
   * @returns {void}
   */
  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (!amount || numAmount <= 0) {
      alert('请输入有效的充值金额')
      return
    }
    if (numAmount < 1) {
      alert('最小充值金额为1元')
      return
    }
    // 提交充值申请
    alert(`充值申请：¥${amount}，支付方式：${selectedMethod === 'alipay' ? '支付宝' : '微信支付'}`)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold text-xf-info">充值余额</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 充值金额 */}
          <div>
            <label className="block text-sm font-medium text-xf-dark mb-3">充值金额</label>

            {/* 快捷金额选项 */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAmount(value)}
                  className={`py-2 border rounded-xl text-sm font-medium ${
                    !isCustom && amount === value.toString()
                      ? 'border-xf-info bg-xf-info/10 text-xf-info'
                      : 'border-xf-bg/50 text-xf-dark'
                  }`}
                >
                  ¥{value}
                </button>
              ))}
            </div>

            {/* 自定义金额 */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xf-dark">¥</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder="自定义金额"
                className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border ${
                  isCustom
                    ? 'border-xf-info focus:border-xf-info'
                    : 'border-xf-bg/50 focus:border-xf-primary'
                }`}
              />
            </div>

            {/* 当前选中金额显示 */}
            <p className="text-sm text-xf-primary mt-2">
              充值金额：<span className="font-semibold text-xf-info">¥{amount}</span>
            </p>
          </div>

          {/* 支付方式 */}
          <div>
            <label className="block text-sm font-medium text-xf-dark mb-3">支付方式</label>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border ${
                      selectedMethod === method.id
                        ? 'border-xf-info bg-xf-info/5'
                        : 'border-xf-bg/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      method.id === 'alipay' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-left font-medium text-xf-dark">{method.name}</span>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 rounded-full bg-xf-info flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-xf-bg/30 rounded-xl p-3 text-xs text-xf-medium">
            <p>• 充值金额将立即到账</p>
            <p>• 最小充值金额为 ¥1</p>
            <p>• 充值后可用于解锁内容、打赏创作者</p>
          </div>

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-xf-info text-white rounded-xl font-medium"
          >
            确认充值 ¥{amount}
          </button>
        </div>
      </div>
    </div>
  )
}
