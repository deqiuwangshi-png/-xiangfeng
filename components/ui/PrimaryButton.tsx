'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

/**
 * 主按钮组件
 *
 * 作用: 提供统一的主操作按钮样式，替代渐变色背景
 *
 * @param {ReactNode} children - 按钮文本内容
 * @param {boolean} fullWidth - 是否占满宽度
 * @param {boolean} loading - 是否处于加载状态
 * @param {ButtonHTMLAttributes} props - 按钮原生属性
 * @returns {JSX.Element} 主按钮组件
 * 更新时间: 2026-03-02
 */

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export function PrimaryButton({
  children,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        px-6 py-3 bg-xf-primary hover:bg-xf-primary/90 text-white rounded-xl font-semibold
        transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${fullWidth ? 'w-full' : 'flex-1'}
        ${className}
      `}
      {...props}
    >
      {loading ? '处理中...' : children}
    </button>
  )
}
