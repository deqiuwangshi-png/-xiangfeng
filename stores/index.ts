/**
 * 全局状态管理统一导出
 * @module stores
 * @description 所有 Zustand Store 的集中导出入口
 *
 * 使用方式：
 * ```typescript
 * import { useAuthStore, selectUser } from '@/stores';
 * ```
 */

// ============================================
// 认证 Store
// ============================================

export {
  useAuthStore,
  selectUser,
  selectStatus,
} from './auth'

export type {
  AuthStore,
  AuthState,
  AuthStatus,
  AuthError,
  AuthActions,
  LoginParams,
  LoginResult,
  UserSelectorResult,
  StatusSelectorResult,
} from './auth'
