'use client'

/**
 * 编辑个人资料表单组件
 *
 * @module components/settings/EditProfileForm
 * @description 提供个人资料编辑功能，包括用户名、头像等
 * @version 2.0.0
 * @更新说明 使用 useProfileForm Hook 进行重构，简化状态管理
 */

import { useRef } from 'react'
import { ArrowLeft, Camera, User, Mail, FileText, MapPin, Filter } from '@/components/icons'
import { UserAvt } from '@/components/ui'
import { useProfileForm } from '@/hooks/settings/useProfileForm'
import { UserData } from '@/types/user/settings'
import { normalizeAvatarUrl } from '@/lib/user/avatar'

/**
 * 编辑个人资料表单组件
 * @param {EditProfileFormProps} props - 组件属性
 * @returns {JSX.Element} 编辑个人资料表单组件
 */
interface EditProfileFormProps {
  /** 初始用户数据（必须包含id用于头像生成） */
  initialData?: UserData | null
  /** 取消回调函数 */
  onCancel: () => void
  /** 保存成功回调函数 */
  onSave: () => void
}

export function EditProfileForm({ initialData, onCancel, onSave }: EditProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ==========================================
  // 使用统一的个人资料表单 Hook
  // ==========================================
  const {
    formData,
    isSubmitting,
    isUploading,
    error,
    updateField,
    uploadAvatar,
    clearAvatar,
    submit,
  } = useProfileForm({
    initialData,
    onSave,
  })

  /**
   * 处理表单字段变化
   */
  const handleChange = (field: string, value: string) => {
    updateField(field as keyof typeof formData, value)
  }

  /**
   * 处理头像点击 - 触发文件选择
   */
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * 处理文件选择 - 上传临时头像
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await uploadAvatar(file)

    // 清空input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * 处理取消
   */
  const handleCancel = () => {
    onCancel()
  }

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submit()
  }

  // 获取当前显示的头像URL（临时头像优先）
  const displayAvatarUrl = normalizeAvatarUrl(formData.avatar_url, { allowBlob: true })

  return (
    <div>
      {/* 返回按钮和标题区域 */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回账户设置</span>
        </button>

        <header className="text-right">
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            编辑个人资料
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            更新你的个人信息和头像
          </p>
        </header>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* 编辑表单 */}
      <form
        onSubmit={handleSubmit}
        className="card-bg rounded-2xl p-8 space-y-8 border border-xf-bg/60 shadow-none transition-none"
      >
        {/* 头像和基本信息区域 - 水平布局 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* 头像上传区域 - 左侧 */}
          <div className="flex flex-col items-center shrink-0">
            {/* 隐藏的文件输入 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="relative">
              {/* 头像点击区域 */}
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserAvt
                  name={formData.username}
                  userId={initialData?.id}
                  avatarUrl={displayAvatarUrl}
                  size="lg"
                />
                {/* 上传中遮罩 */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {/* 悬停提示 */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </button>
              {/* 清空头像按钮 - 有头像时显示 */}
              {displayAvatarUrl && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  disabled={isUploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border border-xf-bg/60 disabled:opacity-50"
                  title="清空头像"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-xf-secondary">点击头像上传</p>
          </div>

          {/* 右侧基本信息输入区域 */}
          <div className="flex-1 space-y-4">
            {/* 第一行：用户名、邮箱 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 用户名 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-xf-primary">
                  <User className="w-4 h-4" />
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl transition-colors"
                  placeholder="请输入用户名"
                  maxLength={50}
                  required
                />
              </div>

              {/* 邮箱（只读） */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-xf-primary">
                  <Mail className="w-4 h-4" />
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-xf-bg/60 outline-none rounded-xl text-gray-500 cursor-not-allowed"
                  placeholder="请输入邮箱"
                />
              </div>
            </div>

            {/* 第二行：个性名签、所在地 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 个性名签 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-xf-primary">
                  <Filter className="w-4 h-4" />
                  个性名签
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl transition-colors"
                  placeholder="设置你的专属名签"
                  maxLength={50}
                />
              </div>

              {/* 所在地 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-xf-primary">
                  <MapPin className="w-4 h-4" />
                  所在地
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl transition-colors"
                  placeholder="你在哪里？"
                  maxLength={100}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 个人简介 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-xf-primary">
            <FileText className="w-4 h-4" />
            个人简介
          </label>
          <div className="relative">
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl transition-colors resize-none pb-6"
              placeholder="介绍一下你自己..."
              rows={4}
              maxLength={500}
            />
            <p className="absolute bottom-2 right-3 text-xs text-xf-secondary">
              {formData.bio.length}/500
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 text-xf-primary hover:bg-xf-light rounded-xl font-medium transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-xf-primary hover:bg-xf-accent text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}

// 默认导出，用于懒加载
export default EditProfileForm
