'use client'

import { useState } from 'react'
import { ArrowLeft, Lock, Shield, Key, Smartphone, Eye, EyeOff } from 'lucide-react'

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
 *   - 双重验证开关
 *   - 登录设备管理
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 纯展示组件，不处理路由
 *
 * 样式说明:
 *   - 严格遵循项目现有样式
 *   - 使用Tailwind CSS v4语法
 *   - 保持与settings页面一致的风格
 *
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
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 验证密码
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('两次输入的新密码不一致')
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
      <div className="flex items-start gap-4 mb-10">
        {/* 返回按钮 */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors mt-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回账户设置</span>
        </button>

        {/* 页面标题 */}
        <header>
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            账号安全
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            管理密码和双重验证
          </p>
        </header>
      </div>

      {/* 编辑表单 */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 修改密码区块 */}
        <div className="card-bg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-xf-accent to-xf-primary rounded-xl flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
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

        {/* 双重验证区块 */}
        <div className="card-bg rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-xf-dark text-layer-1">
                  双重验证
                </h2>
                <p className="text-sm text-xf-medium mt-1">
                  开启后登录时需要输入手机验证码
                </p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* 登录设备管理区块 */}
        <div className="card-bg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-xf-dark text-layer-1">
              登录设备
            </h2>
          </div>

          <div className="space-y-4">
            {/* 当前设备 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-xf-bg/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-xf-light rounded-lg flex items-center justify-center text-xf-primary">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-xf-dark">当前设备</p>
                  <p className="text-sm text-xf-medium">Windows 11 · Chrome</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                在线
              </span>
            </div>

            {/* 其他设备示例 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-xf-bg/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-xf-light rounded-lg flex items-center justify-center text-xf-primary">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-xf-dark">iPhone 15</p>
                  <p className="text-sm text-xf-medium">iOS 17 · Safari · 2天前</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-linear-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? '保存中...' : '保存更改'}
          </button>
        </div>
      </form>
    </div>
  )
}
