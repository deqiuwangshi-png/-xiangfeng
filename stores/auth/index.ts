/**
 * 认证 Store 导出（高级用法请优先使用 @/hooks/auth）
 * @module stores/auth
 */

export { useAuthStore, selectUser, selectStatus } from './authStore'

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
