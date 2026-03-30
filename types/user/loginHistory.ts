/**
 * 登录历史类型定义
 * @module types/loginHistory
 * @description 用户登录历史的类型定义
 */

/**
 * 登录类型
 */
export type LoginType =
  | 'password'
  | 'magic_link'
  | 'oauth_google'
  | 'oauth_github'
  | 'oauth_wechat'
  | 'sso'
  | 'token'

/**
 * 登录历史记录
 * @interface LoginHistoryItem
 */
export interface LoginHistoryItem {
  /** 记录ID */
  id: string
  /** 用户ID */
  user_id: string
  /** IP地址 */
  ip_address: string | null
  /** 登录类型 */
  login_type: LoginType
  /** 设备类型 */
  device_type: string | null
  /** 浏览器 */
  browser: string | null
  /** 操作系统 */
  os: string | null
  /** 是否成功 */
  is_success: boolean
  /** 是否新设备 */
  is_new_device: boolean
  /** 登录时间 */
  created_at: string
}

/**
 * 获取登录历史结果
 * @interface GetLoginHistoryResult
 */
export interface GetLoginHistoryResult {
  /** 是否成功 */
  success: boolean
  /** 登录历史列表 */
  data?: LoginHistoryItem[]
  /** 错误信息 */
  error?: string
}
