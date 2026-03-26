/**
 * 认证标志组件 - 头像边框样式
 * @module components/user/VerifyBadge
 * @description 为管理员用户显示认证边框，普通用户无边框
 */

import { UserRole } from '@/types'

/**
 * 认证边框配置映射 - 使用相逢风格的柔和颜色
 */
const ROLE_BORDER_STYLES: Record<UserRole, string> = {
  user: '', // 普通用户无边框
  admin: 'ring-2 ring-xf-primary ring-offset-2',
  super_admin: 'ring-2 ring-xf-primary ring-offset-2',
}

/**
 * 认证提示文本
 */
const ROLE_TOOLTIPS: Record<UserRole, string> = {
  user: '',
  admin: '认证管理员',
  super_admin: '超级管理员',
}

interface VerifyBadgeProps {
  /** 用户角色 */
  role: UserRole
  /** 子元素（头像组件） */
  children: React.ReactNode
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 认证标志组件
 * @param {VerifyBadgeProps} props - 组件属性
 * @returns {JSX.Element} 带认证边框的组件
 *
 * @example
 * <VerifyBadge role="admin">
 *   <UserAvatar name="张三" avatarUrl="..." />
 * </VerifyBadge>
 */
export function VerifyBadge({ role, children, className = '' }: VerifyBadgeProps) {
  const borderStyle = ROLE_BORDER_STYLES[role]
  const tooltip = ROLE_TOOLTIPS[role]

  // 普通用户直接返回子元素，不添加边框
  if (role === 'user') {
    return <>{children}</>
  }

  return (
    <div
      className={`relative rounded-full ${borderStyle} ${className}`}
      title={tooltip}
    >
      {children}
      {/* 管理员V标 - 右下角小徽章 */}
      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-xf-primary rounded-full flex items-center justify-center border-2 border-white">
        <svg
          className="w-2.5 h-2.5 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}
