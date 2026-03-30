/**
 * 认证 Store 统一导出
 * @module stores/auth
 * @description 认证状态管理的统一导出入口
 *
 * 使用方式：
 * ```typescript
 * import { useAuthStore, selectUser, selectStatus } from '@/stores/auth';
 * 
 * // 在组件中使用
 * const { user, isAuthenticated } = useAuthStore(selectUser);
 * const { login, logout } = useAuthStore();
 * ```
 */

// ============================================
// Store 导出
// ============================================

export { 
  useAuthStore,
  selectUser,
  selectStatus,
  selectUserId,
  selectIsAuthenticated,
} from './authStore'

// ============================================
// 类型导出
// ============================================

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
} from './authTypes'
