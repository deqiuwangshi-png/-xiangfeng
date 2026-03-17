/**
 * 退出登录 Hook 模块
 * @module hooks/useLogout
 * @description 为React组件提供退出登录的状态管理和便捷接口
 */

import { useState, useCallback } from 'react'
import { logout } from '@/lib/auth/logout'
import type { LogoutResult, UseLogoutOptions, UseLogoutReturn } from '@/types';

export type { UseLogoutOptions, UseLogoutReturn } from '@/types';

/**
 * 退出登录 Hook
 * @description 封装退出登录的状态管理和执行逻辑，提供加载状态和回调支持
 * @param {UseLogoutOptions} [options={}] - 配置选项
 * @returns {UseLogoutReturn} 退出状态和执行函数
 * 
 * @example
 * // 基础用法
 * const { isLoggingOut, handleLogout } = useLogout()
 * 
 * @example
 * // 自定义跳转路径和回调
 * 
 * @example
 */
export function useLogout(options: UseLogoutOptions = {}): UseLogoutReturn {
  const { redirectTo = '/', onSuccess, onError } = options
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  /**
   * 执行退出登录
   * @description 调用logout函数并处理回调和跳转
   */
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      const result = await logout()

      if (result.success) {
        onSuccess?.()
        // 强制刷新页面以确保中间件重新检查会话
        window.location.href = redirectTo
      } else {
        onError?.(result.error || '退出失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '退出失败'
      onError?.(errorMessage)
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, redirectTo, onSuccess, onError])

  /**
   * 底层退出函数（支持自定义跳转）
   * @param {string} [customRedirect] - 自定义跳转路径
   * @returns {Promise<LogoutResult>} 退出结果
   */
  const logoutWithRedirect = useCallback(
    async (customRedirect?: string): Promise<LogoutResult> => {
      if (isLoggingOut) {
        return { success: false, error: '正在退出中' }
      }

      setIsLoggingOut(true)
      try {
        const result = await logout()

        if (result.success) {
          onSuccess?.()
          window.location.href = customRedirect || redirectTo
        } else {
          onError?.(result.error || '退出失败')
        }

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '退出失败'
        onError?.(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoggingOut(false)
      }
    },
    [isLoggingOut, redirectTo, onSuccess, onError]
  )

  return {
    isLoggingOut,
    handleLogout,
    logout: logoutWithRedirect,
  }
}
