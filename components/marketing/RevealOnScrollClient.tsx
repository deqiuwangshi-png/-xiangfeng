'use client'

/**
 * 滚动显示动画组件 (Client Component)
 * @module components/marketing/RevealOnScrollClient
 * @description 当元素进入视口时触发动画显示
 * @优化说明 从HeroSection分离出来，避免整个Hero成为客户端组件
 */

import { useEffect, useRef } from 'react'

interface RevealOnScrollClientProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * 滚动显示动画组件
 * @param props 组件属性
 * @returns 带滚动动画的包裹组件
 */
export function RevealOnScrollClient({ 
  children, 
  delay, 
  className = '' 
}: RevealOnScrollClientProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // 使用 IntersectionObserver 检测元素是否进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            // 动画触发后取消观察，提高性能
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  const delayClass = delay ? `delay-${delay}` : ''

  return (
    <div
      ref={elementRef}
      className={`reveal ${delayClass} ${className}`}
    >
      {children}
    </div>
  )
}
