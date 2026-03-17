/**
 * 退出登录按钮组件
 * @module components/auth/LogoutButton
 * @description 可复用的退出登录按钮，内置退出逻辑和状态管理
 */

'use client'

import { LogOut } from 'lucide-react'
import { useLogout, type UseLogoutOptions } from '@/lib/auth'

/**
 * LogoutButton 组件属性接口
 * @interface LogoutButtonProps
 * @extends {Omit<UseLogoutOptions, 'onSuccess' | 'onError'>}
 */
export interface LogoutButtonProps extends Omit<UseLogoutOptions, 'onSuccess' | 'onError'> {
  /** 按钮样式变体 */
  variant?: 'default' | 'danger' | 'ghost'
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义按钮文本 */
  label?: string
  /** 退出成功后的回调 */
  onSuccess?: () => void
  /** 退出失败后的回调 */
  onError?: (error: string) => void
  /** 额外的CSS类名 */
  className?: string
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * 退出登录按钮组件
 * @description 可复用的退出登录按钮，内置退出逻辑、加载状态和错误处理
 * 
 * @param {LogoutButtonProps} props - 组件属性
 * @returns {JSX.Element} 退出登录按钮
 * 
 * @example
 * // 基础用法
 * <LogoutButton />
 * 
 * @example
 * // 危险样式（红色）
 * <LogoutButton variant="danger" />
 * 
 * @example
 * // 自定义文本和回调
 * <LogoutButton 
 *   label="安全退出"
 *   variant="ghost"
 *   size="sm"
 *   onSuccess={() => console.log('已退出')}
 * />
 * 
 * @example
 * // 在菜单中使用
 * <LogoutButton 
 *   variant="danger" 
 *   className="w-full justify-start"
 *   showIcon
 * />
 */
export function LogoutButton({
  variant = 'default',
  showIcon = true,
  label = '退出登录',
  onSuccess,
  onError,
  className = '',
  size = 'md',
  redirectTo = '/',
}: LogoutButtonProps) {
  const { isLoggingOut, handleLogout } = useLogout({
    redirectTo,
    onSuccess,
    onError,
  })

  // 基础样式
  const baseStyles = 'flex items-center gap-2 rounded-lg transition-all duration-200 font-medium'

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  // 变体样式
  const variantStyles = {
    default: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
    danger: 'text-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100',
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  }

  // 图标尺寸
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
        ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={isLoggingOut ? '正在退出登录' : label}
      type="button"
    >
      {showIcon && (
        <LogOut 
          className={`${iconSizes[size]} ${isLoggingOut ? 'animate-pulse' : ''}`} 
          aria-hidden="true"
        />
      )}
      <span>{isLoggingOut ? '退出中...' : label}</span>
    </button>
  )
}

/**
 * 简化的退出登录按钮（仅图标）
 * @description 适用于空间有限的场景，如工具栏
 */
export function LogoutIconButton({
  onSuccess,
  onError,
  className = '',
  size = 'md',
  redirectTo = '/',
}: Omit<LogoutButtonProps, 'variant' | 'showIcon' | 'label'>) {
  const { isLoggingOut, handleLogout } = useLogout({
    redirectTo,
    onSuccess,
    onError,
  })

  const sizeStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        rounded-lg transition-all duration-200
        text-gray-500 hover:text-red-500 hover:bg-red-50
        ${sizeStyles[size]}
        ${className}
        ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label="退出登录"
      title="退出登录"
      type="button"
    >
      <LogOut 
        className={`${iconSizes[size]} ${isLoggingOut ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
    </button>
  )
}
