'use client'

/**
 * 账户设置列表组件
 * @module components/settings/account/AccountList
 * @description 渲染账户设置选项列表
 */

import {
  SettingsSection,
  SettingItem,
  SettingsBtn,
} from '@/components/settings'

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
  onLinkedAccounts,
}: AccountListProps) {
  return (
    <SettingsSection id="settings-account-section" title="账户设置">
      <div className="space-y-8">
        <SettingItem
          label="个人资料"
          description="更新你的个人信息和头像"
          controlType="button"
          control={<SettingsBtn onClick={onEditProfile}>编辑个人资料</SettingsBtn>}
        />

        <SettingItem
          label="账号安全"
          description="管理密码和双重验证"
          controlType="button"
          control={<SettingsBtn onClick={onSecurity}>管理安全设置</SettingsBtn>}
        />

        <SettingItem
          label="邮箱地址"
          description={email || '未设置'}
          controlType="button"
          control={<SettingsBtn onClick={onChangeEmail}>更换邮箱</SettingsBtn>}
        />

        <SettingItem
          label="关联账号"
          description="管理你的社交媒体关联"
          controlType="button"
          control={<SettingsBtn onClick={onLinkedAccounts}>管理关联账号</SettingsBtn>}
        />
      </div>
    </SettingsSection>
  )
}
