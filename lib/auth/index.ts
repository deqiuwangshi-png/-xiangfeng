/**
 * 认证模块统一入口
 * @module lib/auth
 * @description 统一导出所有认证相关的功能、类型和Hooks
 */

// ==================== Server Actions ====================
export { login } from './actions/login';
export { register } from './actions/register';
export { logout } from './actions/logout';
export { forgotPassword } from './actions/forgot-password';
export { resetPassword } from './actions/reset-password';
export { changePassword } from './actions/change-password';

// ==================== 类型定义 ====================
export type { AuthResult } from './actions/types';
export type { LogoutResult } from './logout';
export type { UseLogoutOptions, UseLogoutReturn } from './useLogout';

// ==================== Hooks & 客户端工具 ====================
export { useLogout } from './useLogout';
export { logoutAndRedirect } from './logout';

// ==================== 错误消息（保持兼容）====================
export {
  COMMON_ERRORS,
  LOGIN_ERRORS,
  REGISTER_ERRORS,
  RESET_PASSWORD_ERRORS,
  AUTH_ERRORS,
  mapSupabaseError,
} from './errorMessages';
