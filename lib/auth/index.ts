/**
 * 认证模块统一入口（客户端安全）
 * @module lib/auth
 * @description 统一导出所有认证相关的功能、类型和Hooks
 *
 * @注意 此模块导出的内容可在客户端和服务端安全使用
 * 服务端专用的权限控制函数请从 './permissions' 直接导入
 */

// ==================== Server Actions ====================
export { login } from './actions/login';
export { register } from './actions/register';
export { logout } from './actions/logout';
export { forgotPassword } from './actions/forgot-password';
export { resetPassword } from './actions/reset-password';
export { changePassword } from './actions/change-password';

// ==================== 类型定义（客户端安全）====================
export type { AuthResult } from './actions/types';
export type { LogoutResult } from '@/types';
export type { UseLogoutOptions, UseLogoutReturn } from '@/hooks/auth/useLogout';

// ==================== Hooks & 客户端工具 ====================
export { useLogout } from '@/hooks/auth/useLogout';

// ==================== 错误消息（保持兼容）====================
export {
  COMMON_ERRORS,
  LOGIN_ERRORS,
  REGISTER_ERRORS,
  RESET_PASSWORD_ERRORS,
  AUTH_ERRORS,
  mapSupabaseError,
} from './errorMessages';

// ==================== 权限类型（客户端安全）====================
export type {
  UserRole,
  WriteOperation,
  PermissionCheckResult,
} from '@/types/permissions';
