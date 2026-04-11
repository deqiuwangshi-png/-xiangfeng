/**
 * 认证工具模块
 * @module lib/auth/utils
 * @description 提供认证相关的通用工具函数
 */

import { validatePassword } from '@/lib/security/passwordPolicy';
import { REGISTER_MESSAGES } from '@/lib/messages';
import type { AuthResult } from '@/types';

/**
 * 判断是否为网络类错误（登录/会话刷新等可重试场景）
 */
export function isNetworkError(error: unknown): boolean {
  const messages = ['网络错误', 'Network error', 'Connection failed', 'Timeout', 'fetch failed', '请求失败']
  const message = error instanceof Error ? error.message : String(error)
  return messages.some((msg) => message.includes(msg))
}

/**
 * 允许的邮箱域名白名单
 */
export const ALLOWED_EMAIL_DOMAINS = ['qq.com', 'gmail.com', '139.com'];

/**
 * 验证邮箱是否在白名单内
 *
 * @param email - 邮箱地址
 * @returns 是否在白名单内
 */
export function isAllowedEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}

/**
 * 获取允许使用的邮箱类型提示
 *
 * @returns 支持的邮箱类型说明
 */
export function getAllowedEmailHint(): string {
  return '请使用 QQ邮箱(@qq.com)、Gmail(@gmail.com) 或 139邮箱(@139.com)';
}

/**
 * 验证密码和确认密码
 *
 * @param password - 密码
 * @param confirmPassword - 确认密码
 * @returns 验证结果，失败时返回错误信息
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): AuthResult | null {
  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return { success: false, error: pwdCheck.message };
  }

  if (password !== confirmPassword) {
    return { success: false, error: REGISTER_MESSAGES.PASSWORD_MISMATCH };
  }

  return null;
}


