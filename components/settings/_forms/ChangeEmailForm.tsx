'use client'

import { useState } from 'react'
import { ArrowLeft, Mail, Shield, CheckCircle, AlertCircle } from '@/components/icons'
import { IconBox, PrimaryButton } from '@/components/ui'
import { initiateEmailChange, UpdateEmailResult } from '@/lib/user/updateEmail'

/**
 * 更换邮箱表单组件
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @param currentEmail - 当前邮箱地址
 * @returns {JSX.Element} 更换邮箱表单组件
 *
 * 使用说明:
 *   - 显示当前邮箱
 *   - 输入新邮箱
 *   - Supabase 自动发送验证邮件
 *   - 用户点击邮件链接确认后生效
 * 
 * 流程:
 *   1. 输入新邮箱地址
 *   2. 点击"发送验证邮件"
 *   3. Supabase 发送确认邮件到新邮箱
 *   4. 用户登录新邮箱，点击确认链接
 *   5. 邮箱更换生效，需要重新登录
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用 Server Action 调用 Supabase Auth
 *   - Supabase 使用默认邮件模板发送验证邮件
 * 更新时间: 2026-03-02
 */

interface ChangeEmailFormProps {
  currentEmail?: string
  onCancel: () => void
  onSave: () => void
}

export function ChangeEmailForm({ currentEmail, onCancel, onSave }: ChangeEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<UpdateEmailResult | null>(null)

  /**
   * 处理发送验证邮件
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || isLoading) return

    // 基础验证
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    if (email === currentEmail) {
      setError('新邮箱不能与当前邮箱相同')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess(null)

    try {
      const result = await initiateEmailChange(email)

      if (result.success) {
        setSuccess(result)
        // 3秒后通知父组件保存成功（关闭表单）
        setTimeout(() => {
          onSave()
        }, 3000)
      } else {
        setError(result.error || '更换邮箱失败')
      }
    } catch (error) {
      console.error('更换邮箱失败:', error)
      setError('更换邮箱失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fade-in-up">
      {/* 返回按钮和标题区域 */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回账户设置</span>
        </button>

        <header className="text-right">
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
          <IconBox>
            <Mail className="w-5 h-5" />
          </IconBox>
          <div>
            <p className="text-sm text-xf-medium">当前邮箱</p>
            <p className="font-medium text-xf-dark">{currentEmail || '未设置'}</p>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* 成功提示 */}
      {success?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">验证邮件已发送</p>
              <p className="text-sm text-green-700 mt-1">
                我们已向 <strong>{email}</strong> 发送了验证邮件。
                请登录新邮箱，点击邮件中的确认链接完成更换。
              </p>
              <p className="text-sm text-green-700 mt-2">
                确认后你需要使用新邮箱重新登录。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 更换邮箱表单 */}
      {!success?.success && (
        <form onSubmit={handleSubmit} className="card-bg rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-xf-dark">
              新邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
              placeholder="请输入新邮箱地址"
              required
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 pt-4 border-t border-xf-bg/60">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              取消
            </button>
            <PrimaryButton
              type="submit"
              loading={isLoading}
              disabled={!email || email === currentEmail}
            >
              发送验证邮件
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* 安全提示 */}
      <div className="mt-6 flex items-start gap-3 text-sm text-xf-medium">
        <Shield className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong>安全提示：</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>更换邮箱后，你需要使用新邮箱登录</li>
            <li>我们会向新邮箱发送验证链接以确认所有权</li>
            <li>在点击验证链接前，当前邮箱仍然有效</li>
            <li>验证完成后，当前会话将失效，需要重新登录</li>
            <li>更换邮箱后，密码保持不变，使用新邮箱+原密码登录，旧邮箱将无法登录</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

{/* 默认导出，支持动态导入 */}
export default ChangeEmailForm
