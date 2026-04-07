/**
 * 认证模块客户端安全导出
 * @module lib/auth/client
 * @description 仅包含可在客户端安全使用的认证功能
 *
 * @安全说明
 * - 此文件导出的内容可在 Client Components 中安全使用
 * - 不包含任何服务端专用 API（如 next/headers, next/cookies）
 * - 服务端专用功能请从 lib/auth/server 导入
 *
 * @使用场景
 * - React Client Components
 * - 浏览器端代码
 * - 需要交互性的组件
 */

// ==================== Server Actions ====================
// Server Actions 可以在客户端调用，但它们在服务端执行
export { login } from './actions/login';
export { register } from './actions/register';
export { logout } from './actions/logout';
export { forgotPassword } from './actions/forgot-password';
export { resetPassword } from './actions/reset-password';
export { changePassword } from './actions/change-password';

// ==================== 类型定义 ====================
export type { AuthResult } from '@/types';
export type { UseLogoutOptions, UseLogoutReturn } from '@/hooks/auth/useLogout';

// ==================== Hooks ====================
export { useLogout } from '@/hooks/auth/useLogout';

// ==================== 消息常量 ====================
export {
  COMMON_ERRORS,
  LOGIN_MESSAGES,
  REGISTER_MESSAGES,
  RESET_PASSWORD_MESSAGES,
  AUTH_ERRORS,
  mapSupabaseError,
} from '@/lib/messages';

// ==================== 权限类型 ====================
export type {
  UserRole,
  WriteOperation,
  PermissionCheckResult,
} from '@/types/auth/permissions';
