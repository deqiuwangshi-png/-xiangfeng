'use client'

import { useState, useEffect, useCallback } from 'react'
import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { LoginHistoryDialog } from '../_dialogs/LoginHistoryDialog'
import { PRIVACY_VISIBILITY_OPTIONS, MESSAGE_PERMISSION_OPTIONS } from '@/types/settings'
import { getPrivacySettings, updatePrivacySettings } from '@/lib/settings/actions'
import { toast } from 'sonner'

/**
 * 隐私与安全设置区块（Client Component）
 *
 * 作用: 显示隐私与安全设置相关选项，支持从服务端获取和保存设置
 *
 * @returns {JSX.Element} 隐私与安全设置区块
 *
 * 性能优化:
 *   - 组件挂载时从服务端获取真实设置
 *   - 本地状态优先响应，异步保存到服务端
 *   - 保存失败时回滚状态
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据获取和修改
 * 更新时间: 2026-03-27
 */

export function PrivacySection() {
  const [showLoginHistory, setShowLoginHistory] = useState(false)
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [messagePermission, setMessagePermission] = useState('everyone')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * 组件挂载时从服务端获取隐私设置
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const result = await getPrivacySettings()

        if (result.success && result.settings) {
          setProfileVisibility(result.settings.profileVisibility || 'public')
          setMessagePermission(result.settings.messagePermission || 'everyone')
        }
      } catch {
        toast.error('加载隐私设置失败')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  /**
   * 处理个人资料可见性变更
   * @param value - 新值
   */
  const handleVisibilityChange = useCallback(async (value: string) => {
    const oldValue = profileVisibility
    setProfileVisibility(value)

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('key', 'profile_visible')
      formData.append('value', value)

      const result = await updatePrivacySettings(formData)

      if (!result.success) {
        setProfileVisibility(oldValue)
        toast.error('保存失败: ' + (result.error || '未知错误'))
      }
    } catch {
      setProfileVisibility(oldValue)
      toast.error('保存失败，请稍后重试')
    } finally {
      setIsSaving(false)
    }
  }, [profileVisibility])

  /**
   * 处理私信权限变更
   * @param value - 新值
   */
  const handleMessagePermissionChange = useCallback(async (value: string) => {
    const oldValue = messagePermission
    setMessagePermission(value)

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('key', 'message_permission')
      formData.append('value', value)

      const result = await updatePrivacySettings(formData)

      if (!result.success) {
        setMessagePermission(oldValue)
        toast.error('保存失败: ' + (result.error || '未知错误'))
      }
    } catch {
      setMessagePermission(oldValue)
      toast.error('保存失败，请稍后重试')
    } finally {
      setIsSaving(false)
    }
  }, [messagePermission])

  return (
    <SettingsSection id="settings-privacy-section" title="隐私与安全">
      <div className="space-y-8">
        <SettingItem
          label="个人资料可见性"
          description={isSaving ? '保存中...' : '谁可以看到你的个人资料和活动'}
          controlType="select"
          control={
            <select
              value={profileVisibility}
              onChange={(e) => handleVisibilityChange(e.target.value)}
              disabled={isLoading || isSaving}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl disabled:opacity-50"
            >
              {PRIVACY_VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />
        <SettingItem
          label="允许私信"
          description="谁可以向你发送私信"
          controlType="select"
          control={
            <select
              value={messagePermission}
              onChange={(e) => handleMessagePermissionChange(e.target.value)}
              disabled={isLoading || isSaving}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl disabled:opacity-50"
            >
              {MESSAGE_PERMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />
        <SettingItem
          label="登录历史"
          description="查看最近的登录活动"
          controlType="button"
          control={
            <button
              onClick={() => setShowLoginHistory(true)}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              查看登录历史
            </button>
          }
        />
      </div>

      {/* 登录历史弹窗 */}
      <LoginHistoryDialog
        isOpen={showLoginHistory}
        onClose={() => setShowLoginHistory(false)}
      />
    </SettingsSection>
  )
}
