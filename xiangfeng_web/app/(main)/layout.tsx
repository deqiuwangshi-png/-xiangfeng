/**
 * 主应用布局文件
 * 为所有主应用页面提供统一的布局结构
 */

'use client';

import Sidebar from '@/src/components/layout/Sidebar';
import RightSidebar from '@/src/components/layout/RightSidebar';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // 根据路径决定是否显示右侧边栏，设置页面不显示右侧边栏
  const showRightSidebar = !pathname.startsWith('/settings');
  
  return (
    <div id="app-view" className="flex h-screen w-full max-w-[1600px] mx-auto bg-[var(--color-xf-light)] overflow-hidden view-transition">
      {/* 左侧边栏 */}
      <Sidebar />
      
      {/* 中间内容区域 */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar px-10 pt-10 pb-24 relative scroll-smooth" id="main-scroll">
        {children}
      </main>
      
      {/* 右侧边栏 - 设置页面不显示 */}
      {showRightSidebar && <RightSidebar />}
    </div>
  );
}