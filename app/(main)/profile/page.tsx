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
 *   - 使用并行数据获取优化LCP性能
 *
 * @性能优化 P1: 使用 Suspense 分离关键/非关键数据，减少LCP时间
 * @性能优化 P2: ProfileContent 使用流式传输，不阻塞首屏渲染
 *
 * @统一认证 2026-03-30
 * - 认证检查已移至 (main)/layout.tsx
 * - 此页面不再需要单独检查登录状态
 *
 * 更新时间: 2026-03-23
 */

import { Suspense } from 'react'
import {
  ProfileHeader,
  ProfileTabs,
  ProfileContent,
  ProfileContentSkeleton,
  ProfileTabsProvider,
  ProfileTabContent,
  ProfileHeaderSkeleton,
  HeatMap,
  HeatMapSkeleton,
} from '@/components/profile'
import { getCurrentUser } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'
import { getUserStats } from '@/lib/user/stats'
import type { UserStats, UserDisplayInfo } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * 个人资料头部数据获取组件
 * @性能优化 独立获取关键路径数据，优先渲染
 * @param userId - 用户ID
 * @param supabase - Supabase 客户端实例（复用，避免重复创建）
 */
async function ProfileHeaderData({ userId, supabase }: { userId: string; supabase: SupabaseClient }) {
  // 并行获取用户资料和统计数据
  const [profileResult, statsResult] = await Promise.all([
    supabase.from('profiles').select('*, level:user_level_records(level)').eq('id', userId).single(),
    getUserStats()
  ])

  const profile = profileResult.data

  // 构造用户显示信息
  const userData: UserDisplayInfo = {
    id: userId,
    username: profile?.username || '用户',
    email: profile?.email || '',
    avatarUrl: profile?.avatar_url ?? null,
    bio: profile?.bio ?? null,
    location: profile?.location ?? null,
    joinDate: profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
      : '未知时间',
    domain: profile?.domain ?? null,
    role: profile?.role || 'user',
    level: profile?.level?.[0]?.level || 1,
  }

  const stats: UserStats = statsResult.success && statsResult.data
    ? statsResult.data
    : { articles: 0, followers: 0, likes: 0, nodes: 0 }

  return <ProfileHeader user={userData} stats={stats} />
}

/**
 * 个人主页页面组件
 *
 * @性能优化 关键改进:
 * 1. 使用 Suspense 分离 ProfileHeader 和 ProfileContent
 * 2. ProfileHeader 优先渲染（关键路径）
 * 3. ProfileContent 流式传输（非关键）
 * 4. 避免级联数据获取阻塞
 */
export default async function ProfilePage() {
  // 获取当前登录用户 - 使用统一入口（与布局共享）
  const user = await getCurrentUser()

  // 未登录状态：显示登录引导（与其他页面保持一致）
  // Layout 层已拦截未登录用户，此处 user 理论上不会为 null
  if (!user) {
    throw new Error('用户未登录')
  }

  // 创建一次 supabase 客户端供后续复用
  const supabase = await createClient()

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
      <div className="max-w-4xl mx-auto fade-in-up">
        {/* 个人资料头部 - 使用 Suspense 优先渲染 */}
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeaderData userId={user.id} supabase={supabase} />
        </Suspense>

        {/* 标签页状态管理Provider */}
        <ProfileTabsProvider defaultTab="content">
          {/* 标签页切换 */}
          <ProfileTabs />

          {/* 我的内容区域 - 使用 Suspense 流式传输 */}
          <ProfileTabContent tab="content">
            <Suspense fallback={<ProfileContentSkeleton />}>
              <ProfileContent userId={user.id} />
            </Suspense>
          </ProfileTabContent>

          {/* 思想轨迹区域 - 灵感热力图 */}
          <ProfileTabContent tab="thought">
            <Suspense fallback={<HeatMapSkeleton />}>
              <HeatMap />
            </Suspense>
          </ProfileTabContent>
        </ProfileTabsProvider>
      </div>
    </main>
  )
}
