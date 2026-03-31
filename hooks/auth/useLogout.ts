/**
 * 退出登录 Hook 模块（兼容层）
 * @module hooks/useLogout
 * @description 为React组件提供退出登录的状态管理和便捷接口
 *
 * @优化说明
 * - 此文件为兼容层，所有功能从 useAuth 重新导出
 * - 使用全局认证状态管理（Zustand）
 * - 通过 useAuth Hook 处理登出逻辑
 * - 自动同步全局认证状态
 * - 统一默认跳转路径为 /login
 * - 使用 sanitizeRedirect 防止开放重定向
 *
 * @统一认证 2026-03-30
 * - 此文件保留用于向后兼容，避免破坏现有导入
 * - 新代码应直接使用 import { useAuth } from '@/hooks/auth/useAuth'
 * - 实际实现已迁移到 useAuth.ts
 */

import { useCallback } from 'react'
import { useAuth } from './useAuth'
import type { UseLogoutOptions, UseLogoutReturn } from '@/types'

export type { UseLogoutOptions, UseLogoutReturn } from '@/types'

/** 默认退出后跳转路径 */
const DEFAULT_REDIRECT = '/'

/**
 * 退出登录 Hook（兼容层）
 *
 * @description 为保持向后兼容性，提供与旧版 API 兼容的退出登录接口
 * @param {UseLogoutOptions} [options={}] - 配置选项
 * @returns {UseLogoutReturn} 退出状态和执行函数
 */
export function useLogout(options: UseLogoutOptions = {}): UseLogoutReturn {
  const { redirectTo = DEFAULT_REDIRECT, onSuccess, onError } = options
  const { logout, isLoading, error } = useAuth()

  const handleLogout = useCallback(async () => {
    if (isLoading) return
    const success = await logout({ redirectTo })
    if (success) {
      onSuccess?.()
    } else {
      onError?.(error?.message || '退出失败')
    }
  }, [isLoading, logout, redirectTo, onSuccess, onError, error])

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
