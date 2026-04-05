/**
 * 设置页面组件统一导出
 * @module components/settings
 * @description 设置页面所有组件的集中导出入口
 */

// Layout - 布局组件
export { SettingsLayout } from './_layout/SettingsLayout'
export { SettingsSection } from './_layout/SettingsSection'
export { SettingItem } from './_layout/SettingItem'
export { SettingsNav } from './_layout/SettingsNav'

// Sections - 设置区块组件
export { PrivacySection } from './sections/PrivacySection'
export { NotificationsSection } from './sections/NotificationsSection'
export { AppearanceSection } from './sections/AppearanceSection'
export { AdvancedSection } from './sections/AdvancedSection'

// Account - 账户相关组件
export { AccountSection } from './account/AccountSection'
export { AccountList } from './account/AccountList'

// Content - 内容设置组件
export { ContentSection } from './content/ContentSection'
export { ContentLanguage } from './content/ContentLanguage'

// Forms - 表单组件
export { EditProfileForm } from './_forms/EditProfileForm'
export { ChangeEmailForm } from './_forms/ChangeEmailForm'
export { SecuritySettingsForm } from './_forms/SecuritySettingsForm'
export { LinkedAccountsForm } from './_forms/LinkedAccountsForm'

// UI - 基础UI组件
export { ToggleSwitch } from './_ui/ToggleSwitch'
export { ColorPreview } from './_ui/ColorPreview'
export { SettingsBtn } from './_ui/SettingsBtn'

// Danger - 危险操作组件
export { DangerZone } from './_danger/DangerZone'
export { DeleteAccountCard } from './_danger/DeleteAccountCard'
export { DeactivateAccountCard } from './_danger/DeactivateAccountCard'

// Dialogs - 对话框组件
export { LoginHistoryDialog } from './_dialogs/LoginHistoryDialog'
