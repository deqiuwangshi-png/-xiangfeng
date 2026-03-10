/**
 * 认证工具模块
 * @module lib/auth/utils
 * @description 提供认证相关的通用工具函数，消除重复代码
 */

import { createClient } from '@/lib/supabase/server';
import { validatePassword } from '@/lib/security/passwordPolicy';
import type { AuthResult } from './actions/types';
import type { User } from '@supabase/supabase-js';

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
    return { success: false, error: '两次输入的密码不一致' };
  }

  return null;
}

/**
 * 获取当前登录用户（认证模块专用）
 * 
 * @returns 用户对象，失败时返回 null
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * 获取当前用户（带错误返回）
 * 
 * @returns 用户对象，失败时返回错误结果
 */
export async function requireCurrentUser(): Promise<{ user: User } | AuthResult> {
  const user = await getCurrentUser();
  
  if (!user) {
    return { success: false, error: '未登录或登录已过期' };
  }

  return { user };
}

/**
 * 创建 Supabase 客户端
 * 
 * @returns Supabase 客户端实例
 */
export async function createAuthClient() {
  return await createClient();
}
