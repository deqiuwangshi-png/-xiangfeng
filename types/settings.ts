/**
 * 设置模块统一类型定义
 * @module types/settings
 * @description 集中管理设置相关的所有类型定义
 */

/**
 * 内容设置数据接口
 * 用于内容偏好设置
 */
export interface ContentSettings {
  /** 内容语言设置 */
  content_language: string
}

/**
 * 用户基础数据接口
 * 用于设置页面各组件间传递用户数据
 */
export interface UserData {
  /** 用户唯一标识（同时作为头像seed，确保头像一致性） */
  id: string
  /** 用户邮箱 */
  email: string
  /** 用户名 */
  username: string
  /** 头像URL（基于user.id生成，确保全局一致） */
  avatar_url: string
  /** 个人简介 */
  bio: string
  /** 位置信息 */
  location: string
  /** 个人领域 */
  domain?: string
}

/**
 * 设置分类枚举
 * 用于区分不同类型的设置
 */
export type SettingCategory =
  | 'privacy'
  | 'notifications'
  | 'appearance'
  | 'content'
  | 'advanced'

/**
 * 设置更新输入参数
 */
export interface UpdateSettingInput {
  /** 设置分类 */
  category: SettingCategory
  /** 设置键名 */
  key: string
  /** 设置值 */
  value: unknown
}

/**
 * 设置更新结果
 */
export interface UpdateSettingResult {
  /** 是否成功 */
  success: boolean
  /** 成功消息 */
  message?: string
  /** 错误信息 */
  error?: string
  /** 详细信息（用于验证错误） */
  details?: unknown
}

/**
 * 通知设置项配置
 */
export interface NotificationSettingConfig {
  /** 设置项标签 */
  label: string
  /** 设置项描述 */
  description: string
  /** 设置键名 */
  settingKey: string
  /** 默认是否开启 */
  defaultChecked: boolean
}

/**
 * 内容设置结果
 */
export interface ContentSettingsResult {
  /** 是否成功 */
  success: boolean
  /** 内容语言 */
  content_language?: string
  /** 错误信息 */
  error?: string
}

/**
 * 更新用户资料参数
 */
export interface UpdateProfileParams {
  /** 用户名 */
  username?: string
  /** 个人简介 */
  bio?: string
  /** 位置信息 */
  location?: string
  /** 头像URL */
  avatar_url?: string
  /** 个人领域 */
  domain?: string
}

/**
 * 更新用户资料结果
 */
export interface UpdateProfileResult {
  /** 是否成功 */
  success: boolean
  /** 错误信息 */
  error?: string
  /** 更新后的数据 */
  data?: {
    username: string
    bio: string
    location: string
    avatar_url: string
    domain?: string
  }
}

/**
 * 账户设置视图模式
 */
export type AccountViewMode =
  | 'list'
  | 'editProfile'
  | 'security'
  | 'changeEmail'
  | 'linkedAccounts'

/**
 * 关联账号项
 */
export interface LinkedAccountItem {
  /** 账号ID */
  id: string
  /** 账号名称 */
  name: string
  /** 是否已关联 */
  connected: boolean
  /** 关联的邮箱 */
  email?: string
}

/**
 * OAuth提供商类型
 */
export type OAuthProvider = 'github' | 'google' | 'wechat' | 'qq'

/**
 * 第三方账号信息（来自数据库）
 */
export interface UserIdentity {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** 提供商 */
  provider: OAuthProvider
  /** 第三方平台用户ID */
  provider_user_id: string
  /** 关联邮箱 */
  email?: string
  /** 显示名称 */
  display_name?: string
  /** 头像URL */
  avatar_url?: string
  /** 是否为主要登录方式 */
  is_primary: boolean
  /** 状态 */
  status: 'active' | 'revoked' | 'expired'
  /** 最后使用时间 */
  last_used_at?: string
  /** 创建时间 */
  created_at: string
}

/**
 * 获取关联账号列表结果
 */
export interface GetLinkedAccountsResult {
  /** 是否成功 */
  success: boolean
  /** 账号列表 */
  accounts?: LinkedAccountItem[]
  /** 错误信息 */
  error?: string
}

/**
 * 绑定/解绑账号结果
 */
export interface LinkAccountResult {
  /** 是否成功 */
  success: boolean
  /** 授权URL（绑定流程需要跳转） */
  url?: string
  /** 成功消息 */
  message?: string
  /** 错误信息 */
  error?: string
}

/**
 * 支持的语言选项
 */
export interface LanguageOption {
  /** 语言代码 */
  value: string
  /** 语言显示名称 */
  label: string
}

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
] as const

/**
 * 主题颜色选项
 */
export interface ThemeColorOption {
  /** 颜色值 */
  value: string
  /** 颜色名称 */
  label: string
}

/**
 * 预设主题颜色
 */
export const PRESET_THEME_COLORS: ThemeColorOption[] = [
  { value: '#6A5B8A', label: '默认紫' },
  { value: '#3A3C6E', label: '深蓝' },
  { value: '#4A6FA5', label: '天蓝' },
  { value: '#4CAF50', label: '绿色' },
  { value: '#FF9800', label: '橙色' },
  { value: '#9C27B0', label: '紫色' },
] as const

/**
 * 主题模式选项
 */
export interface ThemeModeOption {
  /** 模式值 */
  value: string
  /** 显示标签 */
  label: string
  /** 预览颜色 */
  previewColor: string
}

/**
 * 预设主题模式
 */
export const THEME_MODES: ThemeModeOption[] = [
  { value: 'light', label: '浅色', previewColor: 'white' },
  { value: 'dark', label: '深色', previewColor: '#25263D' },
  { value: 'auto', label: '自动', previewColor: 'linear-gradient(to bottom right, white, rgba(37, 38, 61, 0.2))' },
] as const

/**
 * 隐私可见性选项
 */
export interface PrivacyOption {
  /** 选项值 */
  value: string
  /** 显示标签 */
  label: string
}

/**
 * 隐私可见性选项列表
 */
export const PRIVACY_VISIBILITY_OPTIONS: PrivacyOption[] = [
  { value: 'public', label: '所有人可见' },
  { value: 'community', label: '仅社区成员可见' },
  { value: 'followers', label: '仅关注者可见' },
  { value: 'private', label: '仅自己可见' },
] as const

/**
 * 私信权限选项列表
 */
export const MESSAGE_PERMISSION_OPTIONS: PrivacyOption[] = [
  { value: 'everyone', label: '所有人' },
  { value: 'followers', label: '仅关注者' },
  { value: 'mutuals', label: '互相关注' },
  { value: 'none', label: '不允许' },
] as const

/**
 * 隐私可见性类型
 */
export type PrivacyVisibility = 'public' | 'community' | 'followers' | 'private'

/**
 * 私信权限类型
 */
export type MessagePermission = 'everyone' | 'followers' | 'mutuals' | 'none'
