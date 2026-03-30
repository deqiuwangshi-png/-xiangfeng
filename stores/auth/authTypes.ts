/**
 * 认证 Store 类型定义
 * @module stores/auth/authTypes
 * @description Zustand 认证状态管理的类型定义
 */

import type { UserProfile, SimpleUser } from '@/types/user/user'

// ============================================
// Store 状态类型
// ============================================

/**
 * 认证状态
 * @type AuthStatus
 * @description 认证流程的各阶段状态
 */
export type AuthStatus = 
  | 'idle'        // 初始状态
  | 'loading'     // 加载中
  | 'authenticated' // 已认证
  | 'unauthenticated' // 未认证
  | 'error'       // 错误状态

/**
 * 认证错误信息
 * @interface AuthError
 */
export interface AuthError {
  /** 错误代码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误类型 */
  type: 'network' | 'validation' | 'server' | 'unknown'
}

/**
 * 认证 Store 状态
 * @interface AuthState
 */
export interface AuthState {
  // === 用户数据 ===
  /** 当前用户（简化对象） */
  user: SimpleUser | null
  /** 用户详细资料 */
  profile: UserProfile | null
  
  // === 状态标记 ===
  /** 认证状态 */
  status: AuthStatus
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 是否加载中 */
  isLoading: boolean
  /** 是否已初始化 */
  isInitialized: boolean
  
  // === 错误处理 ===
  /** 当前错误 */
  error: AuthError | null
  
  // === 上次更新时间 ===
  /** 用户数据最后更新时间 */
  lastUpdated: number | null
}

// ============================================
// Store Actions 类型
// ============================================

/**
 * 登录参数
 * @interface LoginParams
 */
export interface LoginParams {
  /** 邮箱 */
  email: string
  /** 密码 */
  password: string
  /** 记住我 */
  rememberMe?: boolean
}

/**
 * 登录结果
 * @interface LoginResult
 */
export interface LoginResult {
  /** 是否成功 */
  success: boolean
  /** 错误信息 */
  error?: string
  /** 跳转路径 */
  redirectTo?: string
}

/**
 * 认证 Store Actions
 * @interface AuthActions
 */
export interface AuthActions {
  // === 核心操作 ===
  
  /**
   * 用户登录
   * @param params - 登录参数
   * @returns 登录结果
   */
  login: (params: LoginParams) => Promise<LoginResult>
  
  /**
   * 用户登出
   * @param redirectTo - 登出后跳转路径
   * @returns 登出结果
   */
  logout: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>
  
  /**
   * 设置用户信息
   * @param user - 用户对象
   * @param profile - 用户资料
   */
  setUser: (user: SimpleUser | null, profile?: UserProfile | null) => void
  
  /**
   * 刷新用户信息
   * @description 从服务端重新获取用户信息
   */
  refreshUser: () => Promise<void>
  
  /**
   * 清除用户信息
   */
  clearUser: () => void
  
  // === 状态管理 ===
  
  /**
   * 设置加载状态
   * @param isLoading - 是否加载中
   */
  setLoading: (isLoading: boolean) => void
  
  /**
   * 设置错误信息
   * @param error - 错误对象
   */
  setError: (error: AuthError | null) => void
  
  /**
   * 清除错误信息
   */
  clearError: () => void
  
  /**
   * 初始化认证状态
   * @param user - 初始用户数据
   * @param profile - 初始用户资料
   */
  initialize: (user: SimpleUser | null, profile?: UserProfile | null) => void
  
  /**
   * 更新用户资料字段
   * @param updates - 部分更新的资料
   */
  updateProfile: (updates: Partial<UserProfile>) => void
}

// ============================================
// Store 完整类型
// ============================================

/**
 * 完整认证 Store 类型
 * @type AuthStore
 */
export type AuthStore = AuthState & AuthActions

// ============================================
// Selector 类型（用于性能优化）
// ============================================

/**
 * 用户 Selector 返回类型
 * @interface UserSelectorResult
 */
export interface UserSelectorResult {
  user: SimpleUser | null
  profile: UserProfile | null
  isAuthenticated: boolean
}

/**
 * 状态 Selector 返回类型
 * @interface StatusSelectorResult
 */
export interface StatusSelectorResult {
  status: AuthStatus
  isLoading: boolean
  isInitialized: boolean
  error: AuthError | null
}
