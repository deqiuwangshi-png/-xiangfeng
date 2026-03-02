/**
 * 个人主页页面
 * 
 * 作用: 显示用户的个人资料、统计数据、内容和领域贡献
 * 
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\个人.html
 * 
 * 设计原则:
 * - HTML原型文件是唯一真理数据来源
 * - 严格遵循原型中的所有样式和布局
 * - 不得自行修改或"优化"原型设计
 * - 所有间距完全复制原型数值
 * 
 * @returns {JSX.Element} 个人主页页面
 * 
 * 使用说明:
 *   - 使用 Server Component 获取用户数据
 *   - 使用 Client Components 处理交互逻辑
 *   - 复用 Sidebar 组件保持一致性
 * 
 * 更新时间: 2026-02-20
 */

import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileContent } from '@/components/profile/ProfileContent'
import { ProfileDomain } from '@/components/profile/ProfileDomain'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserDisplayInfo } from '@/lib/user/getUserDisplayInfo'

/**
 * 个人主页页面组件
 * 
 * @function ProfilePage
 * @returns {JSX.Element} 个人主页页面
 * 
 * @description
 * 提供个人主页的完整功能，包括：
 * - 个人资料头部（头像、用户名、简介、标签）
 * - 数据统计（文章、关注者、获赞、社群）
 * - 标签页切换（我的内容、领域贡献）
 * - 我的内容区域（最新文章列表）
 * - 领域贡献区域（领域卡片列表）
 * 
 * @layout
 * - 使用 flex 布局
 * - 主内容区域自适应
 * - 支持垂直滚动
 * - 隐藏滚动条
 */
export default async function ProfilePage() {
  // 获取当前登录用户
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 未登录则重定向到登录页
  if (!user) {
    redirect('/login')
  }

  // 构造用户显示信息（与 Sidebar 一致）
  const userData = getUserDisplayInfo(user)

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-10 pt-10 pb-24 relative scroll-smooth">
      <div className="max-w-6xl mx-auto fade-in-up">
        {/* 个人资料头部 - 传递真实用户数据 */}
        <ProfileHeader user={userData} />

        {/* 数据统计 */}
        <ProfileStats />

        {/* 标签页切换 */}
        <ProfileTabs />

        {/* 我的内容区域 */}
        <ProfileContent />

        {/* 领域贡献区域 */}
        <ProfileDomain />
      </div>
    </main>
  )
}
