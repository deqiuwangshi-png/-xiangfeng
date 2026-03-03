/**
 * 认证模块入口
 * @module lib/auth
 * @description 统一导出认证相关的功能和类型
 */

// 导出退出登录功能
export { logout, logoutAndRedirect } from './logout'
export type { LogoutResult } from './logout'

// 导出Hook
export { useLogout } from './useLogout'
export type { UseLogoutOptions, UseLogoutReturn } from './useLogout'
