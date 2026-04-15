'use client'

/**
 * 账户设置区块（视图路由）
 * @module components/settings/account/AccountSection
 * @description 账户设置页面的视图路由器，负责视图切换
 */

import { lazy, Suspense } from 'react'
import { AccountList } from './AccountList'
import { AccountViewMode, UserData } from '@/types/user/settings'

{/* 表单组件懒加载 - 减少首屏 JS 体积 */}
const EditProfileForm = lazy(() => import('../_forms/EditProfileForm'))
const SecuritySettingsForm = lazy(() => import('../_forms/SecuritySettingsForm'))
const ChangeEmailForm = lazy(() => import('../_forms/ChangeEmailForm'))
const LinkedAccountsForm = lazy(() => import('../_forms/LinkedAccountsForm'))

{/* 表单加载骨架屏 */}
function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}

interface AccountSectionProps {
  userData: UserData | null
  viewMode: AccountViewMode
  onViewChange: (view: AccountViewMode) => void
}

/**
 * 账户设置区块
 * @param props 组件属性
 * @returns 当前视图对应的组件
 */
export function AccountSection({ userData, viewMode, onViewChange }: AccountSectionProps) {
  const toList = () => onViewChange('list')

  // 编辑个人资料视图
  if (viewMode === 'editProfile') {
    return (
      <Suspense fallback={<FormSkeleton />}>
        <EditProfileForm
          initialData={userData}
          onCancel={toList}
          onSave={toList}
        />
      </Suspense>
    )
  }

  // 安全设置视图
  if (viewMode === 'security') {
    return (
      <Suspense fallback={<FormSkeleton />}>
        <SecuritySettingsForm onCancel={toList} onSave={toList} />
      </Suspense>
    )
  }

  // 更换邮箱视图
  if (viewMode === 'changeEmail') {
    return (
      <Suspense fallback={<FormSkeleton />}>
        <ChangeEmailForm
          currentEmail={userData?.email}
          onCancel={toList}
          onSave={toList}
        />
      </Suspense>
    )
  }

  // 关联账号视图
  if (viewMode === 'linkedAccounts') {
    return (
      <Suspense fallback={<FormSkeleton />}>
        <LinkedAccountsForm onCancel={toList} onSave={toList} />
      </Suspense>
    )
  }

  // 默认显示账户设置列表
  return (
    <AccountList
      email={userData?.email}
      onEditProfile={() => onViewChange('editProfile')}
      onSecurity={() => onViewChange('security')}
      onChangeEmail={() => onViewChange('changeEmail')}
      onLinkedAccounts={() => onViewChange('linkedAccounts')}
    />
  )
}
