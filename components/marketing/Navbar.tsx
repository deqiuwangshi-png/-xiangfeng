'use client'

/**
 * 导航栏组件 - 响应式导航
 * @module components/marketing/Navbar
 * @description 桌面端显示完整导航，移动端使用简化版
 * @性能优化 P1: 将 router.push 改为 Link 组件，启用自动预加载
 */

import Link from 'next/link'
import { useEffect } from 'react'
import { Logo } from '@/components/icons'
import { MobileNav } from '@/components/mobile/MobileNav'

/**
 * 桌面端导航组件
 * @returns {JSX.Element} 桌面端导航
 */
function DesktopNav() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.classList.add('shadow-md')
        } else {
          navbar.classList.remove('shadow-md')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      id="navbar"
      className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <Logo size="sm" className="group-hover:scale-105 transition-transform duration-300" />
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            特色功能
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            如何运作
          </Link>
          <Link
            href="#creators"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            生态创作者
          </Link>
          <Link
            href="#economy"
            className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
          >
            生态经济
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* @性能优化: 使用 Link 替代 router.push，启用自动预加载 */}
          <Link
            href="/login"
            className="px-6 py-2.5 bg-xf-primary hover:bg-xf-accent text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          >
            登录
          </Link>
        </div>
      </div>
    </nav>
  )
}

/**
 * 响应式导航栏组件
 * @returns {JSX.Element} 响应式导航
 */
export default function Navbar() {
  return (
    <>
      {/* 桌面端导航 - lg以上显示 */}
      <div className="hidden lg:block">
        <DesktopNav />
      </div>

      {/* 移动端导航 - lg以下显示 */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </>
  )
}
