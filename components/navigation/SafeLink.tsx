'use client'

/**
 * 安全导航链接组件
 * @module components/navigation/SafeLink
 * @description 防止快速点击导致的重复导航
 */

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useOptimisticNavigation } from '@/hooks/navigation/useOptimisticNavigation'

interface SafeLinkProps {
  /** 链接地址 */
  href: string
  /** 子元素 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 是否预加载 */
  prefetch?: boolean
  /** 点击回调 */
  onClick?: () => void
}

/**
 * 安全导航链接组件
 * @param {SafeLinkProps} props - 组件属性
 * @returns {JSX.Element} 链接组件
 */
export function SafeLink({
  href,
  children,
  className = '',
  prefetch = true,
  onClick,
}: SafeLinkProps) {
  const { isPending, pendingUrl } = useOptimisticNavigation()
  const [isNavigating, setIsNavigating] = useState(false)
  const [, setIsHovered] = useState(false)

  /**
   * 处理点击
   * @param {React.MouseEvent} e - 点击事件
   */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // 如果正在导航中，阻止默认行为
      if (isNavigating || isPending) {
        e.preventDefault()
        return
      }

      // 如果点击的是当前正在pending的链接
      if (pendingUrl === href) {
        e.preventDefault()
        return
      }

      setIsNavigating(true)
      onClick?.()

      // 重置导航状态
      setTimeout(() => {
        setIsNavigating(false)
      }, 300)
    },
    [href, isNavigating, isPending, pendingUrl, onClick]
  )

  /**
   * 处理鼠标进入（预加载）
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  /**
   * 处理鼠标离开
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const isDisabled = isPending || isNavigating
  const isActive = pendingUrl === href

  return (
    <Link
      href={href}
      className={`${className} ${isDisabled ? 'pointer-events-none opacity-70' : ''} ${
        isActive ? 'opacity-70' : ''
      }`}
      prefetch={prefetch}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  )
}
