/**
 * 用户页面布局
 * @param {React.ReactNode} children - 子组件
 * @returns {JSX.Element} 布局组件
 * 使用说明:
 *   用于所有用户相关页面的布局
 *   包含侧边栏导航和主内容区域
 *   复用 Sidebar 组件保持一致性
 * 更新时间: 2026-02-19
 */

import { Sidebar } from '@/components/ui/Sidebar'
import '@/styles/domains/user.css'
import '@/styles/domains/earnings.css'
import '@/styles/domains/feedback.css'

/**
 * 用户页面布局组件
 * 
 * @function UserLayout
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} 布局组件
 * 
 * @description
 * 提供用户页面的统一布局结构：
 * - 左侧：侧边栏导航
 * - 右侧：主内容区域
 * 
 * @layout
 * - 使用 flex 布局
 * - 侧边栏固定宽度
 * - 主内容区域自适应
 * - 响应式断点：移动端隐藏侧边栏
 */
export default function UserLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-xf-light">
      {/* 侧边栏 */}
      <Sidebar />
      
      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  )
}
