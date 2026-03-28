'use client'

import { useState, useRef, useCallback } from 'react'
import { ArrowLeft, Camera, User, Mail, FileText, MapPin, Filter } from '@/components/icons'
import { UserAvatar, FormActions } from '@/components/ui'
import { updateProfile } from '@/lib/user/updateProfile'
import { uploadAvatar, deleteOldAvatar, AvatarUploadError } from '@/lib/upload/avatar'
import { containsXss } from '@/lib/security/inputValidator'
import { toast } from 'sonner'
import { UserData, UpdateProfileParams } from '@/types/settings'

/**
 * 编辑个人资料表单组件
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @param initialData - 初始用户数据
 * @returns {JSX.Element} 编辑个人资料表单组件
 * 更新时间: 2026-03-24
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
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
   * 临时头像状态管理
   * - tempAvatarUrl: 新上传但未保存的头像URL
   * - originalAvatarUrl: 原始头像URL（用于取消时恢复）
   * - pendingDeleteUrl: 等待删除的旧头像URL（保存成功后删除）
   */
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null)
  const originalAvatarUrl = useRef(initialData?.avatar_url || '')
  const pendingDeleteUrl = useRef<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 处理表单字段变化
   * @安全增强 C-01: 客户端实时 XSS 检测
   * - 检测危险代码模式
   * - 立即阻止可疑输入
   * - 提供即时反馈
   */
  const handleChange = useCallback((field: string, value: string) => {
    // 实时 XSS 检测
    if (containsXss(value)) {
      toast.error('输入包含不支持的字符或代码，请检查')
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // 清除错误
  }, [])

  /**
   * 处理头像点击 - 触发文件选择
   */
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * 处理文件选择 - 上传临时头像
   * 注意：此时只上传到Storage，不写入数据库
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!initialData?.id) {
      toast.error('用户未登录')
      return
    }

    setIsUploading(true)
    const toastId = toast.loading('正在上传头像...')

    try {
      // 如果已有临时头像，先删除（避免堆积）
      if (tempAvatarUrl) {
        await deleteOldAvatar(tempAvatarUrl)
      }

      // 标记原始头像为待删除（如果是第一次上传新头像）
      if (originalAvatarUrl.current && !pendingDeleteUrl.current) {
        pendingDeleteUrl.current = originalAvatarUrl.current
      }

      // 上传新头像到Storage（临时）
      const newAvatarUrl = await uploadAvatar(file, initialData.id)

      // 保存为临时头像，不更新formData.avatar_url
      setTempAvatarUrl(newAvatarUrl)

      toast.success('头像已上传，点击保存后生效', { id: toastId })
    } catch (err) {
      if (err instanceof AvatarUploadError) {
        toast.error(err.message, { id: toastId })
      } else {
        toast.error('头像上传失败，请稍后重试', { id: toastId })
      }
    } finally {
      setIsUploading(false)
      // 清空input，允许重复选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  /**
   * 清空头像
   * 标记为待清空，实际删除在保存时执行
   */
  const clearAvatar = () => {
    // 如果有临时头像，直接删除
    if (tempAvatarUrl) {
      deleteOldAvatar(tempAvatarUrl).catch(console.error)
      setTempAvatarUrl(null)
    }

    // 标记原始头像待删除（保存时执行）
    if (originalAvatarUrl.current) {
      pendingDeleteUrl.current = originalAvatarUrl.current
    }

    // 清空显示
    setFormData(prev => ({ ...prev, avatar_url: '' }))
    toast.success('头像已清空，点击保存后生效')
  }

  /**
   * 处理取消 - 清理临时头像
   */
  const handleCancel = () => {
    // 如果有临时头像未保存，删除它
    if (tempAvatarUrl) {
      deleteOldAvatar(tempAvatarUrl).catch(console.error)
    }

    // 恢复原始头像显示
    setFormData(prev => ({
      ...prev,
      avatar_url: originalAvatarUrl.current
    }))
    setTempAvatarUrl(null)

    // 调用父组件的取消回调
    onCancel()
  }

  /**
   * 处理表单提交
   * 保存时才将临时头像写入数据库
   */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 确定最终头像URL：优先使用临时头像
      const finalAvatarUrl = tempAvatarUrl || formData.avatar_url

      // 调用 Server Action 保存数据
      const params: UpdateProfileParams = {
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        avatar_url: finalAvatarUrl,
        domain: formData.domain,
      }

      const result = await updateProfile(params)

      if (result.success) {
        // 保存成功后，异步删除旧头像（不阻塞用户反馈）
        if (pendingDeleteUrl.current) {
          deleteOldAvatar(pendingDeleteUrl.current).catch(console.error)
          pendingDeleteUrl.current = null
        }

        // 更新原始头像引用
        originalAvatarUrl.current = finalAvatarUrl
        setTempAvatarUrl(null)

        onSave() // 通知父组件保存成功
      } else {
        setError(result.error || '保存失败，请稍后重试')
      }
    } catch {
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
      <form onSubmit={handleSubmit} className="card-bg rounded-2xl p-8 space-y-8">
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
                <UserAvatar
                  name={formData.username}
                  userId={initialData?.id}
                  avatarUrl={tempAvatarUrl || formData.avatar_url}
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
              {/* 清空头像按钮 - 有临时头像或已保存头像时显示 */}
              {(tempAvatarUrl || formData.avatar_url) && (
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
            <p className="text-sm text-xf-medium mt-4">
              {isUploading ? '上传中...' : tempAvatarUrl ? '头像待保存' : '点击头像上传'}
            </p>
            <p className="text-xs text-xf-medium/70 mt-1">
              支持 JPG、PNG、WebP，最大 2MB
            </p>
            {tempAvatarUrl && (
              <p className="text-xs text-amber-600 mt-1">
                * 点击保存更改后生效
              </p>
            )}
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
