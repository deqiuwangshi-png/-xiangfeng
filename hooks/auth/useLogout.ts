/**
 * 退出登录 Hook 模块
 * @module hooks/useLogout
 * @description 为React组件提供退出登录的状态管理和便捷接口
 *
 * @优化说明
 * - 使用全局认证状态管理（Zustand）
 * - 通过 useAuth Hook 处理登出逻辑
 * - 自动同步全局认证状态
 * - 统一默认跳转路径为 /login
 * - 使用 sanitizeRedirect 防止开放重定向
 */

import { useCallback } from 'react'
import { useAuth } from './useAuth'
import type { UseLogoutOptions, UseLogoutReturn } from '@/types'

export type { UseLogoutOptions, UseLogoutReturn } from '@/types'

/** 默认退出后跳转路径 */
const DEFAULT_REDIRECT = '/login'

/**
 * 退出登录 Hook
 *
 * @description 封装退出登录的状态管理和执行逻辑，提供加载状态和回调支持
 * @param {UseLogoutOptions} [options={}] - 配置选项
 * @returns {UseLogoutReturn} 退出状态和执行函数
 *
 * @优化说明
 * - 使用 useAuth Hook 处理登出逻辑
 * - 自动更新全局认证状态
 * - 无需手动管理 isLoading 状态
 */
export function useLogout(options: UseLogoutOptions = {}): UseLogoutReturn {
  const { redirectTo = DEFAULT_REDIRECT, onSuccess, onError } = options

  {/* 使用全局认证状态管理 */}
  const { logout, isLoading, error } = useAuth()

  /**
   * 执行退出登录
   *
   * @description 调用全局 Store 执行退出，处理回调和安全跳转
   * @安全说明
   * - 使用 sanitizeRedirect 清洗跳转路径，防止开放重定向攻击
   * - 强制页面刷新以确保中间件重新检查会话状态
   * - 自动更新全局认证状态
   */
  const handleLogout = useCallback(async () => {
    if (isLoading) return

    const success = await logout({ redirectTo })

    if (success) {
      onSuccess?.()
    } else {
      onError?.(error?.message || '退出失败')
    }
  }, [isLoading, logout, redirectTo, onSuccess, onError, error])

  /**
   * 执行退出登录（支持自定义跳转路径）
   *
   * @param {string} [customRedirect] - 自定义跳转路径（可选）
   * @returns {Promise<{ success: boolean; error?: string }>} 退出结果
   *
   * @description 在调用时指定跳转路径，覆盖默认路径
   */
  const logoutWithRedirect = useCallback(
    async (customRedirect?: string): Promise<{ success: boolean; error?: string }> => {
      if (isLoading) {
        return { success: false, error: '正在退出中' }
      }

      const targetRedirect = customRedirect || redirectTo
      const success = await logout({ redirectTo: targetRedirect })

      if (success) {
        onSuccess?.()
      } else {
        onError?.(error?.message || '退出失败')
      }

      return { success, error: error?.message }
    },
    [isLoading, logout, redirectTo, onSuccess, onError, error]
  )

  return {
    isLoggingOut: isLoading,
    handleLogout,
    logout: logoutWithRedirect,
  }
}
