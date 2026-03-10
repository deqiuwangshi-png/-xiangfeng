/**
 * 退出登录模块
 * @module lib/auth/logout
 * @description 客户端退出登录，调用Server Action
 */

import { logout as logoutAction } from './actions/logout';

/**
 * 退出登录结果接口
 */
export interface LogoutResult {
  success: boolean;
  error?: string;
}

/**
 * 退出登录
 * @description 调用Server Action执行退出
 * @returns 退出结果
 */
export async function logout(): Promise<LogoutResult> {
  try {
    const result = await logoutAction();
    return result;
  } catch (err) {
    console.error('退出登录失败:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

/**
 * 退出登录并跳转
 * @param redirectTo 跳转目标路径
 * @returns 退出结果
 */
export async function logoutAndRedirect(redirectTo: string = '/login'): Promise<LogoutResult> {
  const result = await logout();

  if (result.success) {
    window.location.href = redirectTo;
  }

  return result;
}
