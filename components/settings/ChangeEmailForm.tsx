'use client'

import { useState } from 'react'
import { ArrowLeft, Mail, Shield, CheckCircle } from 'lucide-react'

/**
 * 更换邮箱表单组件
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @returns {JSX.Element} 更换邮箱表单组件
 *
 * 使用说明:
 *   - 输入新邮箱
 *   - 发送验证码
 *   - 验证并保存
 * 架构说明:
 *   - 使用'use client'指令
 *   - 纯展示组件，不处理路由
 * 更新时间: 2026-03-02
 */

interface ChangeEmailFormProps {
  onCancel: () => void
  onSave: () => void
}

export function ChangeEmailForm({ onCancel, onSave }: ChangeEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  /**
   * 处理发送验证码
   */
  const handleSendCode = async () => {
    if (!email || countdown > 0) return

    setIsLoading(true)
    try {
      // TODO: 调用API发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep('verify')
      setCountdown(60)

      // 倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('发送验证码失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'input') {
      await handleSendCode()
      return
    }

    setIsLoading(true)
    try {
      // TODO: 调用API验证并保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSave()
    } catch (error) {
      console.error('验证失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fade-in-up">
      {/* 返回按钮和标题区域 */}
      <div className="flex items-start gap-4 mb-10">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors mt-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回账户设置</span>
        </button>

        <header>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            更换邮箱
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            更新你的邮箱地址
          </p>
        </header>
      </div>

      {/* 当前邮箱提示 */}
      <div className="card-bg rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-xf-accent to-xf-primary rounded-xl flex items-center justify-center text-white">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-xf-medium">当前邮箱</p>
            <p className="font-medium text-xf-dark">felix@example.com</p>
          </div>
        </div>
      </div>

      {/* 更换邮箱表单 */}
      <form onSubmit={handleSubmit} className="card-bg rounded-2xl p-8 space-y-6">
        {step === 'input' ? (
          <div className="space-y-2">
            <label className="text-sm font-bold text-xf-dark">
              新邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
              placeholder="请输入新邮箱地址"
              required
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700">
                验证码已发送至 {email}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-xf-dark">
                验证码
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
                  placeholder="请输入6位验证码"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isLoading}
                  className="px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '重新发送'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4 border-t border-xf-bg/60">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isLoading || (step === 'input' && !email) || (step === 'verify' && !verificationCode)}
            className="flex-1 px-6 py-3 bg-linear-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? '处理中...' : step === 'input' ? '发送验证码' : '确认更换'}
          </button>
        </div>
      </form>

      {/* 安全提示 */}
      <div className="mt-6 flex items-start gap-3 text-sm text-xf-medium">
        <Shield className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          更换邮箱后，你需要使用新邮箱登录。我们会向新邮箱发送验证链接以确认所有权。
        </p>
      </div>
    </div>
  )
}
