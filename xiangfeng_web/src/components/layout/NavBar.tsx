/**
 * 导航栏组件
 * 提供页面顶部导航功能，包括Logo、导航链接、返回按钮和移动端菜单
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  activePage?: string;
}

export function NavBar({ activePage }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/about', label: '关于我们', id: 'about' },
    { href: '/services', label: '服务', id: 'services' },
    { href: '/community', label: '社区', id: 'community' },
    { href: '/privacy', label: '隐私政策', id: 'privacy' },
    { href: '/terms', label: '服务条款', id: 'terms' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-xf-bg/30 no-print">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-xf-accent to-xf-primary rounded-lg rotate-12 opacity-90"></div>
          <span className="font-serif text-xl font-bold text-xf-accent">相逢</span>
        </Link>

        {/* 桌面导航菜单 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`text-xf-primary hover:text-xf-accent font-medium transition-colors ${activePage === link.id ? 'text-xf-accent font-semibold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 行动按钮 */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2.5 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98"
          >
            返回
          </button>
          {/* 移动端菜单按钮 */}
          <button 
            id="mobile-menu-btn" 
            className="md:hidden text-xf-primary"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-xf-bg/30 shadow-elevated no-print">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`text-xf-primary hover:text-xf-accent font-medium py-2 ${activePage === link.id ? 'text-xf-accent font-semibold' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-xf-bg/30">
              <button 
                onClick={() => {
                  window.history.back();
                  closeMobileMenu();
                }}
                className="w-full py-3 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}