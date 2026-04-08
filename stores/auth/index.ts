/**
 * 认证 Store 统一导出
 * @module stores/auth
 * @description 认证状态管理的统一导出入口
 *
 * @使用指南
 * - useAuthStore: 直接访问 Store（高级用法）
 * - selectUser: 用户数据 Selector
 * - selectStatus: 状态 Selector
 *
 * @推荐用法
 * 客户端组件推荐使用 hooks/auth 中的 Hook：
 * ```typescript
 * import { useUser, useAuth, useIsAuthenticated } from '@/hooks/auth';
 *
 * const { user, profile, username, avatarUrl } = useUser();
 * const { login, logout } = useAuth();
 * const isAuthenticated = useIsAuthenticated();
 * ```
 */

// ============================================
// Store 导出
// ============================================

export {
  useAuthStore,
  selectUser,
  selectStatus,
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
