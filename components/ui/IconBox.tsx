'use client'

import { ReactNode } from 'react'

/**
 * 图标容器组件
 *
 * 作用: 为设置页面提供统一的图标展示容器，替代渐变色背景
 *
 * @param {ReactNode} children - 图标内容
 * @param {string} variant - 颜色变体: 'primary' | 'green' | 'blue'
 * @param {string} className - 额外的CSS类名
 * @returns {JSX.Element} 图标容器组件
 *
 * 更新时间: 2026-03-02
 */

interface IconBoxProps {
  children: ReactNode
  variant?: 'primary' | 'green' | 'blue'
  className?: string
}

const variantStyles = {
  primary: 'bg-xf-primary',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
}

export function IconBox({ children, variant = 'primary', className = '' }: IconBoxProps) {
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  )
}
