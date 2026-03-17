'use client'

import { useState } from 'react'
import { ArrowLeft, Camera, User, Mail, FileText, MapPin, Filter } from '@/components/icons'
import { AvatarPlaceholder, FormActions } from '@/components/ui'
import { updateProfile } from '@/lib/user/updateProfile'
import { getAvtUrl } from '@/lib/utils/getAvtUrl'
import { UserData, UpdateProfileParams } from '@/types/settings'

/**
 * 编辑个人资料表单组件
 *
 * 作用: 允许用户编辑个人资料信息
 *
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @param initialData - 初始用户数据
 * @returns {JSX.Element} 编辑个人资料表单组件
 *
 * 使用说明:
 *   - 头像上传（通过 URL 或 Dicebear API）
 *   - 用户名编辑
 *   - 简介编辑
 *   - 位置信息编辑
 * 更新时间: 2026-03-02
 */

interface EditProfileFormProps {
  initialData?: UserData | null
  onCancel: () => void
  onSave: () => void
}

export function EditProfileForm({ initialData, onCancel, onSave }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    avatar_url: initialData?.avatar_url || '',
    domain: initialData?.domain || '',
  })

  /**
   * 处理表单字段变化
   */
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // 清除错误
  }

  /**
   * 生成新的统一头像
   */
  const generateNewAvatar = () => {
    const newAvatarUrl = getAvtUrl(formData.username)
    setFormData(prev => ({ ...prev, avatar_url: newAvatarUrl }))
  }

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 调用 Server Action 保存数据
      const params: UpdateProfileParams = {
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url,
        domain: formData.domain,
      }

      const result = await updateProfile(params)

      if (result.success) {
        onSave() // 通知父组件保存成功
      } else {
        setError(result.error || '保存失败，请稍后重试')
      }
    } catch (error) {
      console.error('保存失败:', error)
      setError('保存失败，请稍后重试')
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
      <form onSubmit={handleSubmit} className="card-bg rounded-2xl p-8 space-y-8">
        {/* 头像和基本信息区域 - 水平布局 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* 头像上传区域 - 左侧 */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <AvatarPlaceholder
                name={formData.username}
                avatarUrl={formData.avatar_url}
                size="lg"
              />
              <button
                type="button"
                onClick={generateNewAvatar}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xf-primary hover:bg-xf-light transition-colors border border-xf-bg/60"
                title="更换随机头像"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-xf-medium mt-4">
              点击相机更换头像
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
                  required
                />
              </div>

              {/* 邮箱 - 只读 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-bold text-xf-dark text-layer-1">
                  <Mail className="w-5 h-5 text-xf-primary" />
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-3 bg-xf-light border border-xf-bg/60 rounded-xl text-xf-medium cursor-not-allowed"
                  title="邮箱地址请在账户安全中修改"
                />
              </div>
            </div>

            {/* 第二行：所在城市和个人领域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 所在城市 - 缩短长度 */}
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
                  placeholder="如：北京"
                  maxLength={20}
                />
              </div>

              {/* 个人领域 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-bold text-xf-dark text-layer-1">
                  <Filter className="w-5 h-5 text-xf-primary" />
                  个人领域
                </label>
                <input
                  type="text"
                  value={formData.domain || ''}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all"
                  placeholder="如：前端开发、产品设计等"
                  maxLength={30}
                />
              </div>
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
              maxLength={200}
              className="w-full px-4 py-3 pb-8 bg-white border border-xf-bg/60 rounded-xl text-xf-dark placeholder-xf-medium focus:outline-none focus:border-xf-accent focus:ring-2 focus:ring-xf-accent/20 transition-all resize-none"
              placeholder="介绍一下你自己..."
            />
            <p className="absolute bottom-2 right-3 text-sm text-xf-medium">
              {formData.bio.length}/200
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <FormActions onCancel={onCancel} loading={isLoading} />
      </form>
    </div>
  )
}

{/* 默认导出，支持动态导入 */}
export default EditProfileForm
