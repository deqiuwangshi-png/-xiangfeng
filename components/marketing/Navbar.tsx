'use client'

/**
 * 导航栏组件 - 响应式导航
 * @module components/marketing/Navbar
 * @description 桌面端显示完整导航，移动端使用简化版，固定在视口顶部随滚动保持可见
 * @性能优化 P1: 将 router.push 改为 Link 组件，启用自动预加载
 */

import Link from 'next/link'
import { Logo } from '@/components/icons'
import { MobileNav } from '@/components/mobile/MobileNav'

/**
 * 导航项配置
 * @constant navItems
 * @description 定义营销页面的导航项
 */
const navItems = [
  { id: 'features', label: '特色功能', href: '/#features' },
  { id: 'how-it-works', label: '如何运作', href: '/#how-it-works' },
  { id: 'creators', label: '生态创作者', href: '/#creators' },
  { id: 'economy', label: '生态经济', href: '/#economy' },
]

/**
 * 桌面端导航组件
 */
function DesktopNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-white/20"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <Logo size="sm" className="group-hover:scale-105 transition-transform duration-300" />
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm font-medium text-xf-medium hover:text-xf-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-xf-primary after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="px-6 py-2.5 bg-xf-primary hover:bg-xf-accent text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          >
            去使用
          </Link>
        </div>
      </div>
    </nav>
  )
}

/**
 * 响应式导航栏组件
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
