'use client'

/**
 * 账户设置区块（视图路由）
 * @module components/settings/account/AccountSection
 * @description 账户设置页面的视图路由器，负责视图切换
 */

import { useAccountView } from './useAccountView'
import { AccountList } from './AccountList'
import { EditProfileForm } from '../_forms/EditProfileForm'
import { SecuritySettingsForm } from '../_forms/SecuritySettingsForm'
import { ChangeEmailForm } from '../_forms/ChangeEmailForm'
import { LinkedAccountsForm } from '../_forms/LinkedAccountsForm'
import { UserData } from '@/types/settings'

interface AccountSectionProps {
  userData: UserData | null
}

/**
 * 账户设置区块
 * @param props 组件属性
 * @returns 当前视图对应的组件
 */
export function AccountSection({ userData }: AccountSectionProps) {
  const { viewMode, toEditProfile, toSecurity, toChangeEmail, toLinkedAccounts, toList } =
    useAccountView()

  // 编辑个人资料视图
  if (viewMode === 'editProfile') {
    return (
      <EditProfileForm
        initialData={userData}
        onCancel={toList}
        onSave={toList}
      />
    )
  }

  // 安全设置视图
  if (viewMode === 'security') {
    return <SecuritySettingsForm onCancel={toList} onSave={toList} />
  }

  // 更换邮箱视图
  if (viewMode === 'changeEmail') {
    return (
      <ChangeEmailForm
        currentEmail={userData?.email}
        onCancel={toList}
        onSave={toList}
      />
    )
  }

  // 关联账号视图
  if (viewMode === 'linkedAccounts') {
    return <LinkedAccountsForm onCancel={toList} onSave={toList} />
  }

  // 默认显示账户设置列表
  return (
    <AccountList
      email={userData?.email}
      onEditProfile={toEditProfile}
      onSecurity={toSecurity}
      onChangeEmail={toChangeEmail}
      onLinkedAccounts={toLinkedAccounts}
    />
  )
}
