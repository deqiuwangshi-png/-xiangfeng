'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  SettingsSection,
  SettingItem,
  LoginHistoryDialog,
  useSettings,
} from '@/components/settings'
import { PRIVACY_VISIBILITY_OPTIONS } from '@/types/user/settings'
import { updatePrivacySettings } from '@/lib/settings/actions/privacy'

/**
 * 隐私与安全设置区块（Client Component）
 *
 * 作用: 显示隐私与安全设置相关选项，支持从服务端获取和保存设置
 *
 * @returns {JSX.Element} 隐私与安全设置区块
 *
 * 性能优化:
 *   - 从 Context 获取服务端预取的数据，避免重复请求
 *   - 本地状态优先响应，异步保存到服务端
 *   - 保存失败时回滚状态
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 *   - 数据通过 Context 从 Server Component 传递
 * 更新时间: 2026-03-28
 */

export function PrivacySection() {
  const { userSettings } = useSettings()
  const [showLoginHistory, setShowLoginHistory] = useState(false)
  const [profileVisibility, setProfileVisibility] = useState(
    userSettings.privacy.profile_visibility
  )
  const [isSaving, setIsSaving] = useState(false)

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
              disabled={isSaving}
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
