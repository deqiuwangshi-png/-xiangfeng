'use client'

/**
 * 移动端导航组件
 * @module components/mobile/MobileNav
 * @description 官网着陆页移动端顶部导航，包含汉堡菜单
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/icons'

/**
 * 导航项配置
 * @constant navItems
 */
const navItems = [
  { label: '特色功能', href: '#features' },
  { label: '如何运作', href: '#how-it-works' },
  { label: '生态创作者', href: '#creators' },
  { label: '生态经济', href: '#economy' },
]

/**
 * 移动端导航组件
 * @returns {JSX.Element} 移动端导航
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  /**
   * 处理导航点击
   * @param href - 目标链接
   */
  const handleNavClick = (href: string) => {
    setIsOpen(false)
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-xf-surface/30 safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        {/* 右侧操作 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-xf-primary text-white rounded-lg text-sm font-medium touch-manipulation active-scale"
          >
            登录
          </button>

          {/* 汉堡菜单按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 touch-manipulation active-scale"
            aria-label={isOpen ? '关闭菜单' : '打开菜单'}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-xf-dark" />
            ) : (
              <Menu className="w-6 h-6 text-xf-dark" />
            )}
          </button>
        </div>
      </div>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-xf-surface/30 shadow-lg">
          <div className="py-2 px-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left py-3 text-sm font-medium text-xf-medium hover:text-xf-primary border-b border-xf-bg/50 last:border-0 touch-manipulation"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
