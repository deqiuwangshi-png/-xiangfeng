/**
 * 认证相关 Hooks 统一导出
 * @module hooks/auth
 * @description 所有认证相关 Hooks 的集中导出入口
 *
 * @使用指南
 * - useUser: 获取当前用户数据（推荐）
 * - useAuth: 完整的认证状态管理
 * - useIsAuthenticated: 仅获取登录状态
 * - useUserId: 仅获取用户 ID
 */

// ============================================
// 核心 Hooks
// ============================================

/**
 * useUser - 获取当前用户数据（推荐）
 * @description 客户端获取当前用户的最简方式，与服务端 getCurrentUser() 对应
 * @example
 * ```tsx
 * function UserBadge() {
 *   const { user, profile, isAuthenticated, username, avatarUrl } = useUser();
 *   if (!isAuthenticated) return <GuestBadge />;
 *   return <Avatar src={avatarUrl} alt={username} />;
 * }
 * ```
 */
export { useUser } from './useAuth'

/**
 * useAuth - 完整的认证状态管理
 * @description 提供完整的认证状态和操作方法（登录、登出等）
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { isAuthenticated, login, logout } = useAuth();
 *   return isAuthenticated
 *     ? <button onClick={() => logout()}>登出</button>
 *     : <button onClick={() => login({ email, password })}>登录</button>;
 * }
 * ```
 */
export { useAuth } from './useAuth'

/**
 * useAuthUser - 仅获取用户数据（性能优化）
 * @description 只订阅用户相关数据，避免不必要的重渲染
 */
export { useAuthUser } from './useAuth'

/**
 * useAuthStatus - 仅获取认证状态（性能优化）
 * @description 只订阅状态相关数据，不订阅用户数据
 */
export { useAuthStatus } from './useAuth'

/**
 * useIsAuthenticated - 仅获取登录状态（最小订阅）
 * @description 只返回是否已登录，用于条件渲染
 * @example
 * ```tsx
 * function ProtectedContent() {
 *   const isAuthenticated = useIsAuthenticated();
 *   return isAuthenticated ? <PrivateContent /> : <LoginPrompt />;
 * }
 * ```
 */
export { useIsAuthenticated } from './useAuth'

/**
 * useUserId - 仅获取用户 ID（最小订阅）
 * @description 只返回用户 ID，用于关联查询
 */
export { useUserId } from './useAuth'

// ============================================
// 其他认证 Hooks
// ============================================

export { useAuthToast } from './useAuthToast'
export { useLogout } from './useLogout'
export { usePermission } from './usePermission'
export { useRegisterForm } from './useRegisterForm'
