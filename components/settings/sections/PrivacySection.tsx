'use client'

import { useState } from 'react'
import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { LoginHistoryDialog } from '../_dialogs/LoginHistoryDialog'
import { PRIVACY_VISIBILITY_OPTIONS, MESSAGE_PERMISSION_OPTIONS } from '@/types/settings'

/**
 * 隐私与安全设置区块（Client Component）
 *
 * 作用: 显示隐私与安全设置相关选项
 *
 * @returns {JSX.Element} 隐私与安全设置区块
 *
 * 使用说明:
 *   显示隐私与安全设置选项
 *   处理隐私与安全设置交互
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 * 更新时间: 2026-02-22
 */

export function PrivacySection() {
  const [showLoginHistory, setShowLoginHistory] = useState(false)

  return (
    <SettingsSection id="settings-privacy-section" title="隐私与安全">
      <div className="space-y-8">
        <SettingItem
          label="个人资料可见性"
          description="谁可以看到你的个人资料和活动"
          controlType="select"
          control={
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl">
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
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl">
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
