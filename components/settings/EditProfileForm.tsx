'use client'

import { useState } from 'react'
import { ArrowLeft, Camera, User, Mail, FileText, MapPin } from 'lucide-react'
import { AvatarPlaceholder, PrimaryButton } from '@/components/ui'

/**
 * 编辑个人资料表单组件
 *
 * 作用: 允许用户编辑个人资料信息
 *
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @returns {JSX.Element} 编辑个人资料表单组件
 *
 * 使用说明:
 *   - 头像上传
 *   - 用户名编辑
 *   - 简介编辑
 *   - 位置信息编辑
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

interface EditProfileFormProps {
  onCancel: () => void
  onSave: () => void
}

export function EditProfileForm({ onCancel, onSave }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: 'Felix',
    email: 'felix@example.com',
    bio: '探索认知边界中...',
    location: '上海',
  })

  /**
   * 处理表单字段变化
   *
   * @param field - 字段名
   * @param value - 字段值
   */
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

        {/* 页面标题 - 靠右对齐 */}
        <header className="text-right">
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            编辑个人资料
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            更新你的个人信息和头像
          </p>
        </header>
      </div>

      {/* 编辑表单 */}
      <form onSubmit={handleSubmit} className="card-bg rounded-2xl p-8 space-y-8">
        {/* 头像和基本信息区域 - 水平布局 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* 头像上传区域 - 左侧 */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <AvatarPlaceholder name={formData.username} />
              <button
                type="button"
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xf-primary hover:bg-xf-light transition-colors border border-xf-bg/60"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-xf-medium mt-4">
              点击头像更换照片
            </p>
          </div>

          {/* 用户名、邮箱和城市 - 右侧 */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {/* 第一行：用户名和邮箱 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 用户名 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-bold text-xf-dark text-layer-1">
                  <User className="w-5 h-5 text-xf-primary" />
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
                  placeholder="请输入用户名"
                />
              </div>

              {/* 邮箱 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-bold text-xf-dark text-layer-1">
                  <Mail className="w-5 h-5 text-xf-primary" />
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            {/* 第二行：所在城市 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-lg font-bold text-xf-dark text-layer-1">
                <MapPin className="w-5 h-5 text-xf-primary" />
                所在城市
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
                placeholder="请输入所在城市"
              />
            </div>
          </div>
        </div>

        {/* 个人简介 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-bold text-xf-dark text-layer-1">
            <FileText className="w-5 h-5 text-xf-primary" />
            个人简介
          </label>
          <div className="relative">
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 pb-8 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all resize-none"
              placeholder="介绍一下你自己..."
            />
            <p className="absolute bottom-2 right-3 text-sm text-xf-medium">
              {formData.bio.length}/200
            </p>
          </div>
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
          <PrimaryButton type="submit" loading={isLoading}>
            保存更改
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}
