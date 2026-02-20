'use client'

/**
 * 侧边栏组件
 * 
 * 作用: 显示应用主导航、用户信息和操作菜单
 * 
 * @returns {JSX.Element} 侧边栏组件
 * 
 * 使用说明:
 *   用于应用页面的左侧导航栏
 *   包含导航菜单、用户头像、下拉菜单和版权信息
 *   支持响应式布局（移动端和桌面端）
 * 
 * 交互说明:
 *   - 点击导航项切换激活状态
 *   - 点击头像切换下拉菜单
 *   - 点击外部区域关闭下拉菜单
 * 
 * 依赖:
 *   - lucide-react (图标组件)
 *   - next/image (图片优化)
 *   - react (状态管理和副作用)
 * 
 * 更新时间: 2026-02-19
 */

import { Home, Compass, Edit3, User, Settings, LogOut, FolderOpen, MessageSquare, Newspaper, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

/**
 * 导航项接口
 * 
 * @interface NavItem
 * @property {string} id - 导航项唯一标识
 * @property {string} label - 导航项显示文本
 * @property {React.ElementType} icon - 导航项图标组件
 * @property {string} href - 导航项链接地址
 */
interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

/**
 * 用户下拉菜单项接口
 * 
 * @interface UserDropdownItem
 * @property {string} label - 菜单项显示文本
 * @property {React.ElementType} icon - 菜单项图标组件
 * @property {string} href - 菜单项链接地址
 * @property {boolean} isDanger - 是否为危险操作（如退出登录）
 */
interface UserDropdownItem {
  label: string
  icon: React.ElementType
  href: string
  isDanger?: boolean
}

/**
 * 导航菜单配置
 * 
 * @constant navItems
 * @description 定义应用主导航菜单项
 */
const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home, href: '/home' },
  { id: 'publish', label: '发布', icon: Edit3, href: '/publish' },
  { id: 'draft', label: '草稿', icon: FolderOpen, href: '/drafts' },
]

/**
 * 用户下拉菜单配置
 * 
 * @constant userDropdownItems
 * @description 定义用户操作下拉菜单项
 */
const userDropdownItems: UserDropdownItem[] = [
  { label: '个人主页', icon: User, href: '/profile' },
  { label: '收益中心', icon: Zap, href: '/earnings' },
  { label: '更新公告', icon: Newspaper, href: '/updates' },
  { label: '产品反馈', icon: MessageSquare, href: '/feedback' },
  { label: '设置', icon: Settings, href: '/settings' },
  { label: '退出登录', icon: LogOut, href: '/login', isDanger: true },
]

/**
 * 侧边栏组件
 * 
 * @function Sidebar
 * @returns {JSX.Element} 侧边栏组件
 * 
 * @description
 * 提供应用主导航功能，包括：
 * - 用户头像和下拉菜单
 * - 主导航菜单（首页、探索、发布）
 * - 版权信息
 * 
 * @state
 * - activeNav: 当前激活的导航项ID
 * - isDropdownOpen: 下拉菜单是否打开
 * 
 * @effects
 * - 监听点击外部事件，关闭下拉菜单
 */
export function Sidebar() {
  const [activeNav, setActiveNav] = useState('home')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  /**
   * 处理导航项点击
   * 
   * @function handleNavClick
   * @param {string} navId - 导航项ID
   * @returns {void}
   * 
   * @description
   * 更新当前激活的导航项状态
   */
  const handleNavClick = (navId: string) => {
    setActiveNav(navId)
  }

  /**
   * 切换下拉菜单显示状态
   * 
   * @function toggleDropdown
   * @returns {void}
   * 
   * @description
   * 切换用户下拉菜单的打开/关闭状态
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  /**
   * 监听点击外部事件
   * 
   * @useEffect
   * @description
   * 当用户点击下拉菜单外部区域时，自动关闭下拉菜单
   * 
   * @cleanup
   * 移除事件监听器，避免内存泄漏
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const dropdown = document.getElementById('profile-dropdown')
      const avatarButton = document.getElementById('avatar-button')
      
      if (dropdown && !dropdown.contains(target) && !avatarButton?.contains(target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <aside className="w-[80px] xl:w-[220px] shrink-0 flex flex-col h-full pt-8 pb-8 px-2 xl:px-6 bg-xf-light border-r border-xf-surface/30 transition-all duration-300">
      {/* 用户信息区域 */}
      <div className="mb-8 pl-2 flex justify-center xl:justify-start items-center xl:items-start gap-4 xl:gap-3">
        <button
          id="avatar-button"
          onClick={toggleDropdown}
          className="relative cursor-pointer"
          aria-label="用户菜单"
        >
          <div className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white overflow-hidden bg-xf-soft/20">
            <Image
              src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=B6CAD7"
              alt="用户头像"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
              loading="eager"
            />
          </div>
          {/* 在线状态指示器 */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-xf-success border-2 border-white rounded-full" />
        </button>
        
        {/* 用户名和版本信息（仅桌面端显示） */}
        <div className="hidden xl:block pt-1">
          <div className="font-medium text-xf-dark text-sm mb-0.5">梦话</div>
          <div className="text-xs text-xf-primary">免费版</div>
        </div>

        {/* 用户下拉菜单 */}
        {isDropdownOpen && (
          <div
            id="profile-dropdown"
            className="absolute top-16 left-0 w-48 bg-white border border-xf-bg/80 backdrop-blur-md rounded-2xl shadow-deep py-2 z-50 origin-top-left fade-in-up"
          >
            {userDropdownItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  item.isDanger
                    ? 'text-red-500 hover:bg-red-50/50'
                    : 'text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 主导航菜单 */}
      <nav className="flex-1 space-y-1 flex flex-col justify-start pl-0 xl:pl-2">
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item flex items-center justify-center xl:justify-start gap-3 xl:gap-5 py-3 transition-all relative group ${
                isActive ? 'text-xf-accent font-semibold' : 'text-xf-primary hover:text-xf-accent'
              }`}
            >
              {/* 激活状态指示器 */}
              <div
                className={`nav-active-indicator absolute left-0 h-[60%] w-1 bg-xf-accent rounded-r transition-all duration-300 ${
                  isActive ? 'opacity-100 h-[80%]' : 'opacity-0'
                }`}
              />
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-lg tracking-wider hidden xl:inline">{item.label}</span>
            </a>
          )
        })}
      </nav>

      {/* 版权信息 */}
      <div className="mt-auto pt-6 border-t border-xf-bg/40 text-center">
        <div className="text-xs text-xf-primary font-medium tracking-wider hidden xl:block">
          ©2024 相逢
        </div>
        <div className="text-xs text-xf-primary font-medium xl:hidden">相</div>
      </div>
    </aside>
  )
}
