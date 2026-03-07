'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Key, Eye, EyeOff } from 'lucide-react'
import { IconBox, FormActions } from '@/components/ui'
import { changePassword } from '@/lib/auth/actions'
import { validatePassword } from '@/lib/security/passwordPolicy'

/**
 * 安全管理表单组件
 *
 * 作用: 允许用户管理账号安全设置
 *
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @returns {JSX.Element} 安全管理表单组件
 *
 * 使用说明:
 *   - 修改密码
 * 架构说明:
 *   - 使用'use client'指令
 *   - 纯展示组件，不处理路由
 * 更新时间: 2026-03-02
 */

interface SecuritySettingsFormProps {
  onCancel: () => void
  onSave: () => void
}

export function SecuritySettingsForm({ onCancel, onSave }: SecuritySettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  /**
   * 处理密码字段变化
   *
   * @param field - 字段名
   * @param value - 字段值
   */
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * 切换密码显示/隐藏
   *
   * @param field - 字段名
   */
  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  /**
   * 处理表单提交
   *
   * @param e - 表单提交事件
   */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 本地验证密码强度
      const passwordCheck = validatePassword(passwordData.newPassword)
      if (!passwordCheck.valid) {
        setError(passwordCheck.message)
        setIsLoading(false)
        return
      }

      // 验证两次密码是否一致
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('两次输入的密码不一致')
        setIsLoading(false)
        return
      }

      // 调用 Server Action 修改密码
      const formData = new FormData()
      formData.append('password', passwordData.newPassword)
      formData.append('confirmPassword', passwordData.confirmPassword)

      const result = await changePassword(formData)

      if (!result.success) {
        setError(result.error || '修改密码失败')
        setIsLoading(false)
        return
      }

      // 密码修改成功，会话已失效，跳转到登录页
      onSave()
      router.push('/login?message=password_changed')
    } catch (error) {
      console.error('保存失败:', error)
      setError('修改密码过程中发生错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fade-in-up">
      {/* 返回按钮和标题区域 */}
      <div className="flex items-center justify-between mb-10">
        {/* 返回按钮 */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回账户设置</span>
        </button>

        {/* 页面标题*/}
        <header className="text-right">
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            账号安全
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            管理密码
          </p>
        </header>
      </div>

      {/* 编辑表单 */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 修改密码区块 */}
        <div className="card-bg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <IconBox>
              <Key className="w-5 h-5" />
            </IconBox>
            <h2 className="text-xl font-bold text-xf-dark text-layer-1">
              修改密码
            </h2>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* 新密码 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-xf-dark">
                新密码
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all pr-12"
                  placeholder="请输入新密码"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xf-medium hover:text-xf-primary transition-colors"
                >
                  {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-xf-medium">
                密码长度至少8位，包含字母和数字
              </p>
            </div>

            {/* 确认新密码 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-xf-dark">
                确认新密码
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all pr-12"
                  placeholder="请再次输入新密码"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xf-medium hover:text-xf-primary transition-colors"
                >
                  {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 操作按钮 */}
        <FormActions onCancel={onCancel} loading={isLoading} showBorder={false} />
      </form>
    </div>
  )
}

{/* 默认导出，支持动态导入 */}
export default SecuritySettingsForm
