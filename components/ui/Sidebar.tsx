'use client'

/**
 * 侧边栏组件
 * 作用: 显示应用主导航、用户信息和操作菜单
 * @returns {JSX.Element} 侧边栏组件
 * 交互说明:
 *   - 根据当前路由自动高亮导航项
 *   - 点击头像切换下拉菜单
 *   - 点击外部区域关闭下拉菜单
 * 依赖:
 *   - lucide-react (图标组件)
 *   - next/image (图片优化)
 *   - next/navigation (路由导航)
 *   - react (状态管理和副作用)
 * 
 * 更新时间: 2026-02-23
 */

import { Home, Edit3, User, Settings, LogOut, FolderOpen, BellRing, MessageSquare, Newspaper, Zap } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

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
 * @property {() => void} onClick - 点击回调函数
 */
interface UserDropdownItem {
  label: string
  icon: React.ElementType
  href?: string
  isDanger?: boolean
  onClick?: () => void
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
  { id: 'inbox', label: '通知', icon: BellRing, href: '/inbox' },
]

/**
 * Sidebar Props 接口
 */
interface SidebarProps {
  user?: SupabaseUser | null
}

/**
 * 侧边栏组件
 * 
 * @function Sidebar
 * @param {SidebarProps} props - 组件属性
 * @returns {JSX.Element} 侧边栏组件
 * 
 * @description
 * 提供应用主导航功能，包括：
 * - 用户头像和下拉菜单
 * - 主导航菜单（首页、发布、草稿）
 * - 版权信息
 * 
 * @state
 * - isDropdownOpen: 下拉菜单是否打开
 * - isLoggingOut: 是否正在退出登录
 * 
 * @effects
 * - 监听点击外部事件，关闭下拉菜单
 * 
 * @hooks
 * - pathname: 当前路由路径
 * - activeNav: 根据当前路由计算的激活导航项ID
 */
export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  /**
   * 根据当前路由计算激活的导航项
   * 
   * @constant activeNav
   * @description
   * 根据当前路径匹配对应的导航项ID
   * - /home -> home
   * - /publish -> publish
   * - /drafts -> draft
   * - 默认 -> home
   */
  const activeNav = useMemo(() => {
    if (pathname === '/home') return 'home'
    if (pathname === '/publish') return 'publish'
    if (pathname === '/drafts') return 'draft'
    if (pathname === '/inbox') return 'inbox'
    return 'home'
  }, [pathname])

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
   * 处理退出登录
   */
  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Logout error:', error.message)
        return
      }

      // 退出成功后跳转到登录页
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  /**
   * 用户下拉菜单配置
   */
  const userDropdownItems: UserDropdownItem[] = useMemo(() => [
    { label: '个人主页', icon: User, href: '/profile' },
    { label: '收益中心', icon: Zap, href: '/earnings' },
    { label: '更新公告', icon: Newspaper, href: '/updates' },
    { label: '产品反馈', icon: MessageSquare, href: '/feedback' },
    { label: '用户设置', icon: Settings, href: '/settings' },
    { label: isLoggingOut ? '退出中...' : '退出登录', icon: LogOut, isDanger: true, onClick: handleLogout },
  ], [isLoggingOut])

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

  // 获取用户显示信息
  const userEmail = user?.email || '用户'
  const userName = user?.user_metadata?.username || userEmail.split('@')[0] || '用户'
  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/micah/svg?seed=${user?.id || 'Felix'}&backgroundColor=B6CAD7`

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
              src={avatarUrl}
              alt="用户头像"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              loading="eager"
              unoptimized={avatarUrl.includes('dicebear.com')}
            />
          </div>
          {/* 在线状态指示器 */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-xf-success border-2 border-white rounded-full" />
        </button>
        
        {/* 用户名和版本信息（仅桌面端显示） */}
        <div className="hidden xl:block pt-1">
          <div className="font-medium text-xf-dark text-sm mb-0.5 truncate max-w-[120px]">{userName}</div>
          <div className="text-xs text-xf-primary">免费版</div>
        </div>

        {/* 用户下拉菜单 */}
        {isDropdownOpen && (
          <div
            id="profile-dropdown"
            className="absolute top-16 left-0 w-48 bg-white border border-xf-bg/80 backdrop-blur-md rounded-2xl shadow-deep py-2 z-50 origin-top-left fade-in-up"
          >
            {userDropdownItems.map((item) => (
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick?.()
                    setIsDropdownOpen(false)
                  }}
                  disabled={isLoggingOut}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors text-left ${
                    item.isDanger
                      ? 'text-red-500 hover:bg-red-50/50'
                      : 'text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent'
                  } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ) : (
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
              )
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
          ©2026 相逢
        </div>
        <div className="text-xs text-xf-primary font-medium xl:hidden">相</div>
      </div>
    </aside>
  )
}
