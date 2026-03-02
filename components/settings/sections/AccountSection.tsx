'use client'

import { useState } from 'react'
import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'
import { EditProfileForm } from '../EditProfileForm'
import { SecuritySettingsForm } from '../SecuritySettingsForm'
import { ChangeEmailForm } from '../ChangeEmailForm'
import { LinkedAccountsForm } from '../LinkedAccountsForm'

/**
 * 视图模式类型
 */
type ViewMode = 'list' | 'editProfile' | 'security' | 'changeEmail' | 'linkedAccounts'

/**
 * 用户数据接口
 */
interface UserData {
  id: string
  email: string
  username: string
  avatar_url: string
  bio: string
  location: string
}

interface AccountSectionProps {
  userData: UserData | null
}

/**
 * 账户设置区块（Client Component）
 *
 * 作用: 显示账户设置相关选项
 *
 * @returns {JSX.Element} 账户设置区块
 *
 * 使用说明:
 *   显示账户设置选项
 *   处理账户设置交互
 *   支持局部切换编辑个人资料和安全设置表单，无刷新更新
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用useState管理视图状态
 *   - 局部更新，不触发整页刷新
 *   - 左侧导航栏保持固定不重新渲染
 * 更新时间: 2026-03-02
 */

export function AccountSection({ userData }: AccountSectionProps) {
  // 控制当前视图模式
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  /**
   * 处理编辑个人资料按钮点击
   *
   * @function handleEditProfile
   * @description 切换到编辑个人资料视图，局部更新不刷新页面
   */
  const handleEditProfile = () => {
    setViewMode('editProfile')
  }

  /**
   * 处理管理安全设置按钮点击
   *
   * @function handleSecuritySettings
   * @description 切换到安全设置视图，局部更新不刷新页面
   */
  const handleSecuritySettings = () => {
    setViewMode('security')
  }

  /**
   * 处理更换邮箱按钮点击
   *
   * @function handleChangeEmail
   * @description 切换到更换邮箱视图，局部更新不刷新页面
   */
  const handleChangeEmail = () => {
    setViewMode('changeEmail')
  }

  /**
   * 处理管理关联账号按钮点击
   *
   * @function handleLinkedAccounts
   * @description 切换到关联账号视图，局部更新不刷新页面
   */
  const handleLinkedAccounts = () => {
    setViewMode('linkedAccounts')
  }

  /**
   * 处理返回列表视图
   *
   * @function handleBackToList
   * @description 返回账户设置列表视图
   */
  const handleBackToList = () => {
    setViewMode('list')
  }

  /**
   * 处理保存成功
   *
   * @function handleSaveSuccess
   * @description 保存成功后返回账户设置列表视图
   */
  const handleSaveSuccess = () => {
    setViewMode('list')
    // TODO: 可以在这里添加成功提示
  }

  // 根据视图模式渲染不同内容
  if (viewMode === 'editProfile') {
    return (
      <EditProfileForm
        initialData={userData}
        onCancel={handleBackToList}
        onSave={handleSaveSuccess}
      />
    )
  }

  if (viewMode === 'security') {
    return (
      <SecuritySettingsForm
        onCancel={handleBackToList}
        onSave={handleSaveSuccess}
      />
    )
  }

  if (viewMode === 'changeEmail') {
    return (
      <ChangeEmailForm
        onCancel={handleBackToList}
        onSave={handleSaveSuccess}
      />
    )
  }

  if (viewMode === 'linkedAccounts') {
    return (
      <LinkedAccountsForm
        onCancel={handleBackToList}
        onSave={handleSaveSuccess}
      />
    )
  }

  // 默认显示账户设置列表
  return (
    <SettingsSection id="settings-account-section" title="账户设置">
      <div className="space-y-8">
        <SettingItem
          label="个人资料"
          description="更新你的个人信息和头像"
          controlType="button"
          control={
            <button
              onClick={handleEditProfile}
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
              onClick={handleSecuritySettings}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              管理安全设置
            </button>
          }
        />

        <SettingItem
          label="邮箱地址"
          description={userData?.email || '未设置'}
          controlType="button"
          control={
            <button
              onClick={handleChangeEmail}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              更换邮箱
            </button>
          }
        />

        <SettingItem
          label="关联账号"
          description="管理你的社交媒体关联"
          controlType="button"
          control={
            <button
              onClick={handleLinkedAccounts}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all"
            >
              管理关联账号
            </button>
          }
        />

      </div>
    </SettingsSection>
  )
}
