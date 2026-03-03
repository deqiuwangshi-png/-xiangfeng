/**
 * 退出登录 Hook 模块
 * @module lib/auth/useLogout
 * @description 为React组件提供退出登录的状态管理和便捷接口
 */

import { useState, useCallback } from 'react'
import { logout, type LogoutResult } from './logout'

/**
 * useLogout 配置选项接口
 * @interface UseLogoutOptions
 * @property {string} [redirectTo='/login'] - 退出成功后跳转的路径
 * @property {() => void} [onSuccess] - 退出成功后的回调函数
 * @property {(error: string) => void} [onError] - 退出失败后的回调函数
 */
export interface UseLogoutOptions {
  /** 退出成功后跳转的路径，默认为 '/login' */
  redirectTo?: string
  /** 退出成功后的回调函数 */
  onSuccess?: () => void
  /** 退出失败后的回调函数 */
  onError?: (error: string) => void
}

/**
 * useLogout 返回值接口
 * @interface UseLogoutReturn
 * @property {boolean} isLoggingOut - 是否正在退出中
 * @property {() => Promise<void>} handleLogout - 执行退出登录的函数
 * @property {(redirectTo?: string) => Promise<LogoutResult>} logout - 底层退出函数（带跳转参数）
 */
export interface UseLogoutReturn {
  /** 是否正在退出中 */
  isLoggingOut: boolean
  /** 执行退出登录的函数 */
  handleLogout: () => Promise<void>
  /** 底层退出函数（带跳转参数） */
  logout: (redirectTo?: string) => Promise<LogoutResult>
}

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
 * const { isLoggingOut, handleLogout } = useLogout({
 *   redirectTo: '/',
 *   onSuccess: () => console.log('退出成功'),
 *   onError: (err) => console.error('退出失败:', err)
 * })
 * 
 * @example
 * // 在JSX中使用
 * <button onClick={handleLogout} disabled={isLoggingOut}>
 *   {isLoggingOut ? '退出中...' : '退出登录'}
 * </button>
 */
export function useLogout(options: UseLogoutOptions = {}): UseLogoutReturn {
  const { redirectTo = '/login', onSuccess, onError } = options
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
