/**
 * 个人资料表单 Hook
 * @module hooks/settings/useProfileForm
 * @description 提供个人资料编辑表单的封装，支持乐观提交
 *
 * @特性
 * - 统一的表单状态管理
 * - 乐观提交（立即响应）
 * - 自动错误处理和回滚
 * - 头像上传管理
 * - XSS 安全检测
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { updateProfile } from '@/lib/user/updateProfile'
import { uploadAvatarAction, deleteAvatarAction } from '@/lib/auth/client'
import { containsXss } from '@/lib/security/inputValidator'
import type { UserData, UpdateProfileParams } from '@/types/user/settings'

const IS_DEV = process.env.NODE_ENV !== 'production'

function maskUserId(userId?: string): string {
  if (!userId) return 'unknown'
  if (userId.length <= 8) return '***'
  return `${userId.slice(0, 4)}***${userId.slice(-4)}`
}

function maskFileName(fileName?: string): string {
  if (!fileName) return 'unknown'
  const lastDot = fileName.lastIndexOf('.')
  const ext = lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : 'unknown'
  return `file.${ext}`
}

function debugLog(event: string, payload: Record<string, unknown>): void {
  if (!IS_DEV) return
  console.log(`[avatar-upload][${event}]`, payload)
}

/**
 * 个人资料表单数据
 */
export interface ProfileFormData {
  username: string
  email: string
  bio: string
  location: string
  avatar_url: string
}

/**
 * useProfileForm Hook 参数
 */
interface UseProfileFormOptions {
  /** 初始用户数据 */
  initialData?: UserData | null
  /** 保存成功回调 */
  onSave?: () => void
  /** 保存失败回调 */
  onError?: (error: string) => void
}

/**
 * useProfileForm Hook 返回值
 */
interface UseProfileFormReturn {
  /** 表单数据 */
  formData: ProfileFormData
  /** 是否正在提交 */
  isSubmitting: boolean
  /** 是否正在上传头像 */
  isUploading: boolean
  /** 错误信息 */
  error: string
  /** 更新表单字段 */
  updateField: (field: keyof ProfileFormData, value: string) => void
  /** 上传新头像 */
  uploadAvatar: (file: File) => Promise<void>
  /** 清空头像 */
  clearAvatar: () => Promise<void>
  /** 提交表单 */
  submit: () => Promise<boolean>
  /** 重置表单 */
  reset: () => void
}

/**
 * 个人资料表单 Hook
 * 
 * @param options - 配置选项
 * @returns 表单操作方法
 * 
 * @example
 * ```typescript
 * const {
 *   formData,
 *   isSubmitting,
 *   updateField,
 *   uploadAvatar,
 *   submit,
 * } = useProfileForm({
 *   initialData: userData,
 *   onSave: () => console.log('保存成功'),
 * })
 * ```
 */
export function useProfileForm({
  initialData,
  onSave,
  onError,
}: UseProfileFormOptions = {}): UseProfileFormReturn {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: initialData?.username || '',
    email: initialData?.email || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    avatar_url: initialData?.avatar_url || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const originalAvatarUrl = useRef(initialData?.avatar_url || '')
  const pendingDeleteUrl = useRef<string | null>(null)
  const tempAvatarUrl = useRef<string | null>(null)

  /**
   * 更新表单字段
   * 包含 XSS 安全检测
   */
  const updateField = useCallback((field: keyof ProfileFormData, value: string) => {
    if (containsXss(value)) {
      toast.error('输入包含不支持的字符或代码，请检查')
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }, [])

  /**
   * 上传头像
   */
  const uploadAvatar = useCallback(async (file: File) => {
    debugLog('client-select', {
      userId: maskUserId(initialData?.id),
      fileName: maskFileName(file?.name),
      fileType: file?.type,
      fileSize: file?.size,
    })

    if (!initialData?.id) {
      toast.error('用户未登录')
      debugLog('client-no-user', { hasInitialData: !!initialData?.id, userId: 'unknown' })
      return
    }

    setIsUploading(true)
    const toastId = toast.loading('正在上传头像...')

    try {
      if (tempAvatarUrl.current) {
        await deleteAvatarAction(tempAvatarUrl.current)
      }

      if (originalAvatarUrl.current && !pendingDeleteUrl.current) {
        pendingDeleteUrl.current = originalAvatarUrl.current
      }

      const formDataObj = new FormData()
      formDataObj.append('file', file)
      const result = await uploadAvatarAction(formDataObj)

      debugLog('client-action-result', {
        success: result.success,
        hasUrl: !!result.url,
        error: result.error,
      })

      if (!result.success || !result.url) {
        throw new Error(result.error || '上传失败')
      }

      tempAvatarUrl.current = result.url
      // 立即同步到表单态，确保前端可见最新头像预览
      setFormData(prev => ({ ...prev, avatar_url: result.url! }))
      toast.success('头像已上传，点击保存后生效', { id: toastId })
    } catch (err) {
      const message = err instanceof Error ? err.message : '头像上传失败，请稍后重试'
      debugLog('client-exception', {
        error: err instanceof Error ? err.message : 'unknown error',
      })
      toast.error(message, { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }, [initialData?.id])

  /**
   * 清空头像
   */
  const clearAvatar = useCallback(async () => {
    if (tempAvatarUrl.current) {
      await deleteAvatarAction(tempAvatarUrl.current)
      tempAvatarUrl.current = null
    }

    if (originalAvatarUrl.current) {
      pendingDeleteUrl.current = originalAvatarUrl.current
    }

    setFormData(prev => ({ ...prev, avatar_url: '' }))
    toast.success('头像已清空，点击保存后生效')
  }, [])

  /**
   * 提交表单
   * 使用乐观更新模式，立即响应用户操作
   */
  const submit = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true)
    setError('')

    try {
      const finalAvatarUrl = tempAvatarUrl.current || formData.avatar_url

      const params: UpdateProfileParams = {
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        avatar_url: finalAvatarUrl,
      }

      const result = await updateProfile(params)

      if (result.success) {
        if (pendingDeleteUrl.current) {
          deleteAvatarAction(pendingDeleteUrl.current).catch(console.error)
          pendingDeleteUrl.current = null
        }

        originalAvatarUrl.current = finalAvatarUrl
        tempAvatarUrl.current = null

        // 通知全局资料消费者（如 Sidebar/AuthProvider）刷新头像与用户名
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('user-profile-updated', {
            detail: {
              username: formData.username,
              avatar_url: finalAvatarUrl || '',
            },
          }))
        }

        onSave?.()
        return true
      } else {
        const errorMsg = result.error || '保存失败，请稍后重试'
        setError(errorMsg)
        onError?.(errorMsg)
        return false
      }
    } catch {
      const errorMsg = '保存失败，请稍后重试'
      setError(errorMsg)
      onError?.(errorMsg)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSave, onError])

  /**
   * 重置表单
   */
  const reset = useCallback(() => {
    if (tempAvatarUrl.current) {
      deleteAvatarAction(tempAvatarUrl.current).catch(console.error)
    }

    setFormData({
      username: initialData?.username || '',
      email: initialData?.email || '',
      bio: initialData?.bio || '',
      location: initialData?.location || '',
      avatar_url: originalAvatarUrl.current,
    })
    tempAvatarUrl.current = null
    setError('')
  }, [initialData])

  return {
    formData,
    isSubmitting,
    isUploading,
    error,
    updateField,
    uploadAvatar,
    clearAvatar,
    submit,
    reset,
  }
}

export default useProfileForm
