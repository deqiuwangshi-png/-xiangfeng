/**
 * 侧边栏导航组件
 * 为所有页面提供统一的导航结构
 * 支持响应式设计和完整的交互功能
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, Compass, Edit3, User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  activeTab?: 'home' | 'explore' | 'publish';
  onTabChange?: (tabName: 'home' | 'explore' | 'publish') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'home', onTabChange }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // 创建ref用于访问DOM元素
  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 防抖函数
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // 检测窗口尺寸，设置移动端标志
  useEffect(() => {
    // 使用防抖处理resize事件
    const debouncedHandleResize = debounce(() => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint
    }, 100);

    debouncedHandleResize();
    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  // 切换个人下拉菜单
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // 关闭个人下拉菜单
  const closeProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 使用ref替代document.querySelector
      const isClickOutsideProfile = profileRef.current && !profileRef.current.contains(event.target as Node);
      const isClickOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
      
      if (profileMenuOpen && isClickOutsideProfile && isClickOutsideDropdown) {
        closeProfileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  // 切换标签
  const switchTab = (tabName: 'home' | 'explore' | 'publish') => {
    if (onTabChange) {
      onTabChange(tabName);
    }
    closeProfileMenu();
  };

  // 导航菜单项配置
  const navItems = [
    { id: 'home', label: '首页', icon: <Home className="w-5 h-5 transition-transform group-hover:scale-110" />, href: '/home', tab: 'home' as const },
    { id: 'explore', label: '探索', icon: <Compass className="w-5 h-5 transition-transform group-hover:scale-110" />, href: '/explore', tab: 'explore' as const },
    { id: 'publish', label: '发布', icon: <Edit3 className="w-5 h-5 transition-transform group-hover:scale-110" />, href: '/publish', tab: 'publish' as const },
  ];

  return (
    <aside
      className="w-[80px] xl:w-[260px] flex-shrink-0 flex flex-col h-full pt-8 pb-8 px-2 xl:px-6 sidebar-bg transition-all duration-300"
    >
      {/* 用户头像区域 */}
      <div className="mb-8 pl-2 flex justify-center xl:justify-start items-center xl:items-start gap-4 xl:gap-3 relative">
        <div className="relative cursor-pointer" onClick={toggleProfileMenu} ref={profileRef}>
            <img
            src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=B6CAD7"
            alt="Avatar"
            className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* 用户名显示 - 仅在 xl 屏幕以上显示 */}
        <div className="hidden xl:block pt-1">
          <div className="font-medium text-xf-dark text-sm mb-0.5">梦话</div>
          <div className="text-xs text-xf-primary">免费版</div>
        </div>

        {/* 个人下拉菜单 */}
        {profileMenuOpen && (
          <div
            id="profile-dropdown"
            ref={dropdownRef}
            className="absolute top-16 left-0 w-48 card-bg backdrop-blur-md rounded-2xl shadow-deep py-2 z-50 border border-xf-bg/50 origin-top-left transition-all fade-in-up"
          >
            <Link
              href="/profile"
              className="flex items-center gap-3 px-5 py-3 text-sm text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent transition"
              onClick={closeProfileMenu}
            >
              <User className="w-4 h-4" />
              个人主页
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-5 py-3 text-sm text-xf-dark hover:bg-xf-bg/50 hover:text-xf-accent transition"
              onClick={closeProfileMenu}
            >
              <Settings className="w-4 h-4" />
              设置
            </Link>
            <div className="h-px bg-xf-bg/80 my-2 mx-4"></div>
            <Link
              href="/"
              className="flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50/50 transition"
              onClick={closeProfileMenu}
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Link>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 flex flex-col justify-start">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              switchTab(item.tab);
            }}
            className={`nav-item flex items-center justify-center xl:justify-start gap-3 xl:gap-5 py-3 pl-2 transition-all relative group ${activeTab === item.tab
                ? 'text-xf-accent font-semibold'
                : 'text-xf-primary hover:text-xf-accent'}`}
          >
            <div className="nav-active-indicator"></div>
            {item.icon}
            <span className="text-lg tracking-wider hidden xl:inline">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 品牌信息 */}
      <div className="mt-auto pt-6 border-t border-xf-bg/40 text-center">
        <div className="text-xs text-xf-primary font-medium tracking-wider hidden xl:block">© 2024 相逢</div>
        <div className="text-xs text-xf-primary font-medium xl:hidden">相</div>
      </div>
    </aside>
  );
};

export default Sidebar;