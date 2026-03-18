'use client'

/**
 * 账户设置列表组件
 * @module components/settings/account/AccountList
 * @description 渲染账户设置选项列表
 */

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'

/**
 * 账户设置列表属性
 */
interface AccountListProps {
  /** 当前邮箱地址 */
  email?: string
  /** 编辑个人资料回调 */
  onEditProfile: () => void
  /** 安全设置回调 */
  onSecurity: () => void
  /** 更换邮箱回调 */
  onChangeEmail: () => void
  /** 关联账号回调 */
  onLinkedAccounts: () => void
}

/**
 * 账户设置列表组件
 * @param props 组件属性
 * @returns 账户设置列表
 */
export function AccountList({
  email,
  onEditProfile,
  onSecurity,
  onChangeEmail,
}: AccountListProps) {
  return (
    <SettingsSection id="settings-account-section" title="账户设置">
      <div className="space-y-8">
        <SettingItem
          label="个人资料"
          description="更新你的个人信息和头像"
          controlType="button"
          control={
            <button
              onClick={onEditProfile}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              编辑个人资料
            </button>
          }
        />

        <SettingItem
          label="账号安全"
          description="管理密码和双重验证"
          controlType="button"
          control={
            <button
              onClick={onSecurity}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              管理安全设置
            </button>
          }
        />

        <SettingItem
          label="邮箱地址"
          description={email || '未设置'}
          controlType="button"
          control={
            <button
              onClick={onChangeEmail}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              更换邮箱
            </button>
          }
        />

        {/* TODO: 关联账号功能待开发中
        <SettingItem
          label="关联账号"
          description="管理你的社交媒体关联"
          controlType="button"
          control={
            <button
              onClick={onLinkedAccounts}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              管理关联账号
            </button>
          }
        />
        */}
        <SettingItem
          label="关联账号"
          description="功能开发中，敬请期待"
          controlType="button"
          control={
            <button
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-400 rounded-xl font-medium cursor-not-allowed"
            >
              即将上线
            </button>
          }
        />
      </div>
    </SettingsSection>
  )
}
