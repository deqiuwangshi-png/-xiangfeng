/**
 * 认证相关 Hooks 统一导出
 * @module hooks/auth
 */

export {
  useUser,
  useAuth,
  useAuthUser,
  useAuthStatus,
  useIsAuthenticated,
  useUserId,
} from './useAuth'

export { useAuthToast } from './useAuthToast'
export { useLogout } from './useLogout'
export { usePermission } from './usePermission'
export { useRegisterForm } from './useRegisterForm'
