'use client'

/**
 * 移动端汉堡菜单组件
 * @module components/mobile/MobileHamburgerMenu
 * @description 从左侧滑出的抽屉式导航菜单
 */

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Lock, Bell, Palette, Filter, Settings2 } from '@/components/icons'

/**
 * 菜单项配置
 * @constant menuItems
 */
const menuItems = [
  { id: 'account', label: '账户设置', icon: User, href: '/settings' },
  { id: 'privacy', label: '隐私与安全', icon: Lock, href: '/settings#privacy' },
  { id: 'notifications', label: '通知', icon: Bell, href: '/settings#notifications' },
  { id: 'appearance', label: '外观与主题', icon: Palette, href: '/settings#appearance' },
  { id: 'content', label: '内容偏好', icon: Filter, href: '/settings#content' },
  { id: 'advanced', label: '高级设置', icon: Settings2, href: '/settings#advanced' },
]

/**
 * 移动端汉堡菜单组件
 * @returns {JSX.Element} 汉堡菜单按钮和抽屉
 */
export function MobileHamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  /**
   * 切换菜单开关状态
   */
  const toggleMenu = () => setIsOpen(!isOpen)

  /**
   * 关闭菜单
   */
  const closeMenu = () => setIsOpen(false)

  /**
   * 判断菜单项是否激活
   * @param {string} href - 菜单链接
   * @returns {boolean} 是否激活
   */
  const isActive = (href: string): boolean => {
    if (href.includes('#')) {
      return pathname === href.split('#')[0]
    }
    return pathname === href
  }

  return (
    <>
      {/* 汉堡菜单按钮 */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-lg hover:bg-xf-surface/50 transition-colors"
        aria-label="打开菜单"
      >
        <Menu className="w-6 h-6 text-xf-dark" />
      </button>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* 抽屉菜单 */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* 菜单头部 */}
        <div className="flex items-center justify-between p-4 border-b border-xf-surface">
          <h2 className="text-lg font-semibold text-xf-dark">设置</h2>
          <button
            onClick={closeMenu}
            className="p-2 rounded-lg hover:bg-xf-surface/50 transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5 text-xf-medium" />
          </button>
        </div>

        {/* 菜单列表 */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-colors duration-200
                      ${active
                        ? 'bg-xf-accent/10 text-xf-accent'
                        : 'text-xf-dark hover:bg-xf-surface/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
