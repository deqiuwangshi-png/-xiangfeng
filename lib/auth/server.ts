/**
 * 认证模块服务端导出
 * @module lib/auth/server
 * @description 仅包含服务端专用的认证功能
 *
 * @安全说明
 * - 此文件导出的内容只能在 Server Components / Server Actions 中使用
 * - 包含 next/headers, next/cookies 等服务端专用 API
 * - 客户端导入此文件会导致编译错误
 *
 * @使用场景
 * - Server Components
 * - Server Actions
 * - API Routes
 * - 中间件
 */

// ==================== 服务端用户获取 ====================
export {
  getCurrentUser,
  isAuthenticated,
  getCurrentUserWithProfile,
} from './core/user';
export type { UserProfile } from './core/user';

// ==================== Server Actions ====================
// 服务端可以直接使用这些 Server Actions
export { login } from './actions/login';
export { register } from './actions/register';
export { logout } from './actions/logout';
export { forgotPassword } from './actions/forgot-password';
export { resetPassword } from './actions/reset-password';
export { changePassword } from './actions/change-password';

// ==================== 类型定义 ====================
export type { AuthResult } from './actions/types';
export type { LogoutResult } from '@/types';

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
