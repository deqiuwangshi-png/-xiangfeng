/**
 * OAuth 第三方认证类型定义
 * @module types/auth/oauth
 * @description 集中管理 OAuth 第三方认证相关的所有类型定义
 * 与基础认证类型(types/auth/auth.ts)分离，避免耦合和冲突
 */

// ============================================
// 基础 OAuth 类型
// ============================================

/**
 * OAuth 提供商类型
 * @type OAuthProvider
 * @description 支持的第三方登录提供商
 * 仅包含 Supabase 原生支持的 Provider
 */
export type OAuthProvider = 'github' | 'google';

/**
 * OAuth 提供商配置
 * @interface OAuthProviderConfig
 * @description 单个 OAuth 提供商的配置信息
 */
export interface OAuthProviderConfig {
  /** 提供商显示名称 */
  name: string;
  /** 是否启用 */
  enabled: boolean;
  /** 图标名称（用于前端展示） */
  icon?: string;
  /** 授权 scopes */
  scopes?: string[];
}

/**
 * OAuth 提供商配置映射
 * @type OAuthProviderConfigMap
 * @description 所有支持的 OAuth 提供商配置
 */
export type OAuthProviderConfigMap = Record<OAuthProvider, OAuthProviderConfig>;

// ============================================
// OAuth 登录相关类型
// ============================================

/**
 * OAuth 登录结果
 * @interface OAuthLoginResult
 * @description OAuth 登录操作的返回结果
 */
export interface OAuthLoginResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 授权 URL（成功时返回） */
  url?: string;
}

/**
 * OAuth 回调参数
 * @interface OAuthCallbackParams
 * @description OAuth 回调 URL 中的参数
 */
export interface OAuthCallbackParams {
  /** 授权码 */
  code?: string;
  /** 错误信息 */
  error?: string;
  /** 错误描述 */
  error_description?: string;
  /** 跳转目标路径 */
  next?: string;
}

/**
 * OAuth 回调结果
 * @interface OAuthCallbackResult
 * @description OAuth 回调处理的结果
 */
export interface OAuthCallbackResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 跳转路径 */
  redirectTo?: string;
  /** 是否需要额外处理（如绑定已有账号） */
  needsLinking?: boolean;
}

// ============================================
// 第三方账号关联类型
// ============================================

/**
 * 第三方账号信息（来自数据库）
 * @interface UserIdentity
 * @description 用户关联的第三方账号信息
 */
export interface UserIdentity {
  /** 记录ID */
  id: string;
  /** 用户ID */
  user_id: string;
  /** 提供商 */
  provider: OAuthProvider;
  /** 第三方平台用户ID */
  provider_user_id: string;
  /** 关联邮箱 */
  email?: string;
  /** 显示名称 */
  display_name?: string;
  /** 头像URL */
  avatar_url?: string;
  /** 是否为主要登录方式 */
  is_primary: boolean;
  /** 状态 */
  status: 'active' | 'revoked' | 'expired';
  /** 最后使用时间 */
  last_used_at?: string;
  /** 创建时间 */
  created_at: string;
}

/**
 * 关联账号列表项
 * @interface LinkedAccountItem
 * @description 前端展示的关联账号信息
 */
export interface LinkedAccountItem {
  /** 提供商 */
  provider: OAuthProvider;
  /** 提供商名称 */
  providerName: string;
  /** 关联邮箱 */
  email?: string;
  /** 显示名称 */
  displayName?: string;
  /** 头像URL */
  avatarUrl?: string;
  /** 是否为主要登录方式 */
  isPrimary: boolean;
  /** 最后使用时间 */
  lastUsedAt?: string;
  /** 是否已连接 */
  isConnected: boolean;
}

/**
 * 获取关联账号列表结果
 * @interface GetLinkedAccountsResult
 * @description 获取用户关联账号列表的返回结果
 */
export interface GetLinkedAccountsResult {
  /** 是否成功 */
  success: boolean;
  /** 账号列表 */
  accounts?: LinkedAccountItem[];
  /** 错误信息 */
  error?: string;
}

/**
 * 关联/解绑账号结果
 * @interface LinkAccountResult
 * @description 关联或解绑第三方账号的返回结果
 */
export interface LinkAccountResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 成功消息 */
  message?: string;
  /** 关联的账号信息 */
  account?: LinkedAccountItem;
  /** 授权URL（绑定流程需要跳转） */
  url?: string;
}

// ============================================
// OAuth 按钮组件类型
// ============================================

/**
 * OAuth 按钮组件属性
 * @interface OAuthButtonsProps
 * @description OAuth 登录按钮组的组件属性
 */
export interface OAuthButtonsProps {
  /** 是否禁用按钮 */
  disabled?: boolean;
  /** 分隔线文字 */
  dividerText?: string;
  /** 登录成功后的跳转路径 */
  redirectTo?: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 单个 OAuth 按钮属性
 * @interface OAuthButtonProps
 * @description 单个 OAuth 提供商按钮的属性
 */
export interface OAuthButtonProps {
  /** 提供商类型 */
  provider: OAuthProvider;
  /** 是否加载中 */
  isLoading?: boolean;
  /** 点击回调 */
  onClick: (provider: OAuthProvider) => void;
  /** 额外的 CSS 类名 */
  className?: string;
}
