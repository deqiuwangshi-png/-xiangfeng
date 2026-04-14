/**
 * 退出登录按钮组件
 * @module components/auth/LogoutButton
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/auth/client'

interface LogoutButtonProps {
  variant?: 'default' | 'danger' | 'ghost'
  showIcon?: boolean
  label?: string
  onSuccess?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LogoutButton({
  variant = 'default',
  showIcon = true,
  label = '退出登录',
  onSuccess,
  className = '',
  size = 'md',
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      onSuccess?.()
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  const variantStyles = {
    default: 'text-gray-700 hover:bg-gray-100',
    danger: 'text-red-500 hover:bg-red-50',
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg transition-all font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${isLoading ? 'opacity-50' : ''}`}
    >
      {showIcon && <LogOut className={iconSizes[size]} />}
      <span>{isLoading ? '退出中...' : label}</span>
    </button>
  )
}
