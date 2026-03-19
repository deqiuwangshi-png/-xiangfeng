/**
 * 个人主页页面
 *
 * 作用: 显示用户的个人资料、统计数据、内容和领域贡献
 *
 * 基于原型文件: d:\My_xiangmu\xf_02\docs\08原型文件设计图\个人.html
 *
 * @returns {JSX.Element} 个人主页页面
 *
 * 使用说明:
 *   - 使用 Server Component 获取用户数据
 *   - 使用 Client Components 处理交互逻辑
 *   - 使用 ProfileTabsProvider 管理标签页状态
 *   - 复用 Sidebar 组件保持一致性
 *   - 从 profiles 表获取数据，与设置页面保持一致
 *
 * 更新时间: 2026-03-16
 */

import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileContent } from '@/components/profile/ProfileContent'
import { ProfileDomain } from '@/components/profile/ProfileDomain'
import { ProfileTabsProvider } from '@/components/profile/ProfileTabsContext'
import { ProfileTabContent } from '@/components/profile/ProfileTabContent'
import { getCurrentUser } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserDisplayInfo } from '@/lib/user/getUserDisplayInfo'
import { getUserStats } from '@/lib/settings/actions'

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
 * @architecture
 * - ProfileTabsProvider: 客户端Context，管理标签页状态
 * - ProfileTabs: 客户端组件，切换标签页
 * - ProfileTabContent: 客户端包装器，条件渲染
 * - ProfileContent/ProfileDomain: 服务端组件，数据获取
 *
 * @layout
 * - 使用 flex 布局
 * - 主内容区域自适应
 * - 支持垂直滚动
 * - 隐藏滚动条
 */
export default async function ProfilePage() {
  // 获取当前登录用户 - 使用缓存函数（与布局共享）
  const user = await getCurrentUser()

  // 未登录则重定向到登录页
  if (!user) {
    redirect('/login')
  }

  // 从 profiles 表获取用户资料（与设置页面保持一致）
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 构造用户显示信息（与 Sidebar 一致），优先使用 profile 数据
  const userData = getUserDisplayInfo(user, profile)

  // 获取用户统计数据
  const statsResult = await getUserStats()
  const stats = statsResult.success && statsResult.data
    ? statsResult.data
    : { articles: 0, followers: 0, likes: 0, nodes: 0 }

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative scroll-smooth">
      <div className="max-w-6xl mx-auto fade-in-up">
        {/* 个人资料头部 - 传递真实用户数据 */}
        <ProfileHeader user={userData} />

        {/* 数据统计 - 传递真实统计数据 */}
        <ProfileStats stats={stats} />

        {/* 标签页状态管理Provider */}
        <ProfileTabsProvider defaultTab="content">
          {/* 标签页切换 */}
          <ProfileTabs />

          {/* 我的内容区域 - 条件渲染 */}
          <ProfileTabContent tab="content">
            <ProfileContent />
          </ProfileTabContent>

          {/* 领域贡献区域 - 条件渲染 */}
          <ProfileTabContent tab="domain">
            <ProfileDomain />
          </ProfileTabContent>
        </ProfileTabsProvider>
      </div>
    </main>
  )
}
