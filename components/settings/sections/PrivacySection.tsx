'use client'

/**
 * 隐私与安全设置区块（Client Component）
 *
 * @module components/settings/PrivacySection
 * @description 显示隐私与安全设置相关选项，支持从服务端获取和保存设置
 * @version 2.0.0
 * @更新说明 使用统一的 useOptimisticMutation 进行乐观更新
 *
 * 性能优化:
 *   - 从 Context 获取服务端预取的数据，避免重复请求
 *   - 使用统一的乐观更新 Hook，自动处理回滚
 *   - 防止重复提交
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 *   - 数据通过 Context 从 Server Component 传递
 */

import { useState } from 'react'
import {
  SettingsSection,
  SettingItem,
  LoginHistoryDialog,
  useSettings,
} from '@/components/settings'
import { PRIVACY_VISIBILITY_OPTIONS, PrivacyVisibility } from '@/types/user/settings'
import { usePrivacySettings } from '@/hooks/settings/usePrivacySettings'

/**
 * 隐私与安全设置区块
 *
 * @returns {JSX.Element} 隐私与安全设置区块
 */
export function PrivacySection() {
  const { userSettings } = useSettings()
  const [showLoginHistory, setShowLoginHistory] = useState(false)

  // ==========================================
  // 使用统一的隐私设置 Hook
  // ==========================================
  const { settings, isSaving, updateProfileVisibility } = usePrivacySettings({
    initialSettings: {
      profile_visibility: userSettings.privacy.profile_visibility as PrivacyVisibility,
    },
  })

  /**
   * 处理个人资料可见性变更
   * 使用统一的乐观更新 Hook
   */
  const handleVisibilityChange = async (value: string) => {
    await updateProfileVisibility(value as PrivacyVisibility)
  }

  return (
    <SettingsSection id="settings-privacy-section" title="隐私与安全">
      <div className="space-y-8">
        <SettingItem
          label="个人资料可见性"
          description={isSaving ? '保存中...' : '谁可以看到你的个人资料和活动'}
          controlType="select"
          control={
            <select
              value={settings.profile_visibility}
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
