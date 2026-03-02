'use client'

import { useState } from 'react'
import { ArrowLeft, Key, Eye, EyeOff } from 'lucide-react'
import { IconBox, FormActions } from '@/components/ui'

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
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
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
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  /**
   * 处理表单提交
   *
   * @param e - 表单提交事件
   */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 验证密码
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('两次输入的密码不一致')
        setIsLoading(false)
        return
      }

      // TODO: 调用Server Action保存数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSave()
    } catch (error) {
      console.error('保存失败:', error)
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

          <div className="space-y-6">
            {/* 当前密码 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-xf-dark">
                当前密码
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all pr-12"
                  placeholder="请输入当前密码"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xf-medium hover:text-xf-primary transition-colors"
                >
                  {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

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
