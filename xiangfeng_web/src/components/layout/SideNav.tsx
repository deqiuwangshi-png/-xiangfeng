/**
 * 侧边导航组件
 * 提供条款页面的侧边导航功能，包括导航链接、最后更新时间、阅读时间和相关文档
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, FileText, Shield, Users, Cookie } from 'lucide-react';

interface SideNavProps {
  activeSection?: string;
}

export function SideNav({ activeSection }: SideNavProps) {
  const [activeNav, setActiveNav] = useState(activeSection || 'introduction');

  const setActiveNavItem = (sectionId: string) => {
    setActiveNav(sectionId);
  };

  // 监听滚动事件，更新激活的导航项
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        if (window.scrollY >= sectionTop - 100) {
          current = section.id;
        }
      });

      if (current && current !== activeNav) {
        setActiveNav(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeNav]);

  const navItems = [
    { href: '#introduction', label: '引言与接受', id: 'introduction' },
    { href: '#account', label: '账户与注册', id: 'account' },
    { href: '#services', label: '服务描述', id: 'services' },
    { href: '#user-conduct', label: '用户行为准则', id: 'user-conduct' },
    { href: '#content', label: '内容政策', id: 'content' },
    { href: '#intellectual-property', label: '知识产权', id: 'intellectual-property' },
    { href: '#privacy', label: '隐私与数据', id: 'privacy' },
    { href: '#disclaimer', label: '免责声明', id: 'disclaimer' },
    { href: '#limitation', label: '责任限制', id: 'limitation' },
    { href: '#termination', label: '账户终止', id: 'termination' },
    { href: '#disputes', label: '争议解决', id: 'disputes' },
    { href: '#general', label: '一般条款', id: 'general' },
    { href: '#contact', label: '联系我们', id: 'contact' },
  ];

  return (
    <aside className="lg:w-1/4 no-print">
      <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-xf-accent mb-6 font-serif">条款导航</h3>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`side-nav-item block text-xf-primary hover:text-xf-accent transition-colors ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNavItem(item.id)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="mt-10 pt-6 border-t border-xf-bg/30">
          <div className="flex items-center gap-3 text-sm text-xf-primary mb-2">
            <Clock className="w-4 h-4" />
            <span>最后更新：2025年12月30日</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-xf-primary">
            <FileText className="w-4 h-4" />
            <span>阅读时间：约12分钟</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-xf-light rounded-xl">
          <h4 className="text-sm font-bold text-xf-primary mb-2">相关文档</h4>
          <div className="space-y-2">
            <Link href="/privacy" className="flex items-center gap-2 text-sm text-xf-info hover:text-xf-accent transition-colors">
              <Shield className="w-3 h-3" />
              <span>隐私政策</span>
            </Link>
            <Link href="/community-guidelines" className="flex items-center gap-2 text-sm text-xf-info hover:text-xf-accent transition-colors">
              <Users className="w-3 h-3" />
              <span>社区准则</span>
            </Link>
            <Link href="/cookies" className="flex items-center gap-2 text-sm text-xf-info hover:text-xf-accent transition-colors">
              <Cookie className="w-3 h-3" />
              <span>Cookie政策</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}