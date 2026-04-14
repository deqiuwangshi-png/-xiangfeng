/**
 * 认证模块类型定义
 * @module types/auth
 * @description 集中管理认证相关的所有类型定义
 */

import type { User, SupabaseClient } from '@supabase/supabase-js'

// ============================================
// 基础认证类型
// ============================================

/**
 * 认证结果接口
 * @interface AuthResult
 * @description 认证操作的统一返回格式
 */
export interface AuthResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 成功消息 */
  message?: string;
}

/**
 * 服务端已登录会话（用户 + Supabase 服务端客户端）
 * @description 用于需要同时访问 auth 用户与 RLS 数据库客户端的场景
 */
export interface AuthSessionResult extends AuthResult {
  user?: User;
  supabase?: SupabaseClient;
}

/**
 * 在已认证会话中执行的回调
 */
export type AuthSessionCallback<T> = (
  user: User,
  supabase: SupabaseClient
) => Promise<T>;

/**
 * 认证错误类型
 * @type AuthErrorType
 * @description 认证过程中可能遇到的错误类型
 */
export type AuthErrorType =
  | 'network'      // 网络错误
  | 'validation'   // 验证错误
  | 'rateLimit'    // 限流错误
  | 'server'       // 服务器错误
  | 'unknown';     // 未知错误

// ============================================
// 登录相关类型
// ============================================

/**
 * 登录表单数据接口
 * @interface LoginFormData
 * @description 用户登录表单的数据结构
 */
export interface LoginFormData {
  /** 邮箱地址 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 登录结果接口
 * @interface LoginResult
 * @description 登录操作的返回结果
 */
export interface LoginResult extends AuthResult {
  /** 跳转路径 */
  redirectTo?: string;
}

// ============================================
// 密码相关类型
// ============================================

/**
 * 密码验证结果接口
 * @interface PasswordValidationResult
 * @description 密码强度验证的结果
 */
export interface PasswordValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 强度分数 (0-100) */
  score: number;
  /** 强度等级 */
  strength: 'weak' | 'medium' | 'strong';
  /** 错误信息 */
  message?: string;
  /** 详细要求 */
  requirements: {
    /** 最小长度 */
    minLength: boolean;
    /** 包含数字 */
    hasNumber: boolean;
    /** 包含小写字母 */
    hasLowercase: boolean;
    /** 包含大写字母 */
    hasUppercase: boolean;
    /** 包含特殊字符 */
    hasSpecialChar: boolean;
  };
}

// ============================================
// 用户操作相关类型
// ============================================

/**
 * 更新邮箱结果接口
 * @interface UpdateEmailResult
 * @description 更新邮箱操作的返回结果
 */
export interface UpdateEmailResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 是否需要确认 */
  needsConfirmation?: boolean;
  /** 成功消息 */
  message?: string;
}

/**
 * 删除账号结果接口
 * @interface DeleteAccountResult
 * @description 删除账号操作的返回结果
 */
export interface DeleteAccountResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 成功消息 */
  message?: string;
}

/**
 * 停用账号结果接口
 * @interface DeactivateAccountResult
 * @description 停用账号操作的返回结果
 */
export interface DeactivateAccountResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 成功消息 */
  message?: string;
}

// ============================================
// 限流相关类型
// ============================================

/**
 * 限流检查结果接口
 * @interface RateLimitResult
 * @description 限流检查的结果
 */
export interface RateLimitResult {
  /** 是否允许操作 */
  allowed: boolean;
  /** 剩余尝试次数 */
  remaining: number;
  /** 重置时间戳 */
  resetTime: number;
}
