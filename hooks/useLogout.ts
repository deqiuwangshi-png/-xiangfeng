/**
 * 退出登录 Hook 模块
 * @module hooks/useLogout
 * @description 为React组件提供退出登录的状态管理和便捷接口
 *
 * @优化说明
 * - 直接调用 Server Action，移除中间层（lib/auth/logout.ts）
 * - 统一默认跳转路径为 /login
 * - 使用 sanitizeRedirect 防止开放重定向
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { logout as logoutAction } from '@/lib/auth/actions/logout'
import { sanitizeRedirect } from '@/lib/auth/redir'
import type { LogoutResult, UseLogoutOptions, UseLogoutReturn } from '@/types'

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
 */
export function useLogout(options: UseLogoutOptions = {}): UseLogoutReturn {
  const { redirectTo = DEFAULT_REDIRECT, onSuccess, onError } = options
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  /**
   * 执行退出登录
   *
   * @description 调用 Server Action 执行退出，处理回调和安全跳转
   * @安全说明
   * - 使用 sanitizeRedirect 清洗跳转路径，防止开放重定向攻击
   * - 强制页面刷新以确保中间件重新检查会话状态
   */
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      const result = await logoutAction()

      if (result.success) {
        onSuccess?.()
        // 安全边界：清洗重定向路径，防止开放重定向
        const safeRedirect = sanitizeRedirect(redirectTo, DEFAULT_REDIRECT)
        // 使用 Next.js router 进行导航，然后刷新页面以确保中间件重新检查会话
        router.push(safeRedirect)
        router.refresh()
      } else {
        onError?.(result.error || '退出失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '退出失败'
      onError?.(errorMessage)
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, onSuccess, redirectTo, router, onError])

  /**
   * 执行退出登录（支持自定义跳转路径）
   *
   * @param {string} [customRedirect] - 自定义跳转路径（可选）
   * @returns {Promise<LogoutResult>} 退出结果
   *
   * @description 在调用时指定跳转路径，覆盖默认路径
   */
  const logoutWithRedirect = useCallback(
    async (customRedirect?: string): Promise<LogoutResult> => {
      if (isLoggingOut) {
        return { success: false, error: '正在退出中' }
      }

      setIsLoggingOut(true)
      try {
        const result = await logoutAction()

        if (result.success) {
          onSuccess?.()
          // 安全边界：清洗重定向路径，防止开放重定向
          const targetRedirect = customRedirect || redirectTo
          const safeRedirect = sanitizeRedirect(targetRedirect, DEFAULT_REDIRECT)
          // 使用 Next.js router 进行导航，然后刷新页面以确保中间件重新检查会话
          router.push(safeRedirect)
          router.refresh()
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
    [isLoggingOut, onSuccess, redirectTo, router, onError]
  )

  return {
    isLoggingOut,
    handleLogout,
    logout: logoutWithRedirect,
  }
}
