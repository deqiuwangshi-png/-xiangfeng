/**
 * 用户个人主页（动态路由）
 *
 * 作用: 显示指定用户的公开个人资料、统计数据、内容和领域贡献
 *
 * 路由: /profile/[userId]
 *
 * @param {Object} params - 路由参数
 * @param {string} params.userId - 用户ID
 *
 * @returns {JSX.Element} 用户个人主页页面
 *
 * 使用说明:
 *   - 使用 Server Component 获取用户数据
 *   - 支持查看任意用户的公开资料
 *   - 与 /profile 页面（当前用户）保持一致的UI
 *
 * @性能优化 P1: 使用 Suspense 分离关键/非关键数据，减少LCP时间
 * @性能优化 P2: ProfileContent 使用流式传输，不阻塞首屏渲染
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileContent, ProfileContentSkeleton } from '@/components/profile/ProfileContent'
import { ProfileDomain } from '@/components/profile/ProfileDomain'
import { ProfileTabsProvider } from '@/components/profile/ProfileTabsContext'
import { ProfileTabContent } from '@/components/profile/ProfileTabContent'
import { ProfileHeaderSkeleton } from '@/components/profile/ProfileHeaderSkeleton'
import { createClient } from '@/lib/supabase/server'
import type { UserStats, UserDisplayInfo } from '@/types'

/**
 * 页面参数类型
 */
interface UserProfilePageProps {
  params: Promise<{
    userId: string
  }>
}

/**
 * 获取用户公开统计数据
 *
 * @param {string} userId - 用户ID
 * @returns {Promise<UserStats>} 用户统计数据
 */
async function getUserPublicStats(userId: string): Promise<UserStats> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('articles_count, followers_count, likes_received, nodes_count')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return { articles: 0, followers: 0, likes: 0, nodes: 0 }
  }

  return {
    articles: data.articles_count || 0,
    followers: data.followers_count || 0,
    likes: data.likes_received || 0,
    nodes: data.nodes_count || 0,
  }
}

/**
 * 用户资料头部数据获取组件
 * @性能优化 独立获取关键路径数据，优先渲染
 */
async function ProfileHeaderData({ userId }: { userId: string }) {
  const supabase = await createClient()

  // 并行获取用户资料和统计数据
  const [profileResult, stats] = await Promise.all([
    supabase.from('profiles').select('*, level:user_level_records(level)').eq('id', userId).single(),
    getUserPublicStats(userId),
  ])

  const profile = profileResult.data

  // 用户不存在则返回 404
  if (!profile) {
    notFound()
  }

  // 构造用户显示信息
  const userData: UserDisplayInfo = {
    id: userId,
    username: profile?.username || '用户',
    email: '', // 不显示邮箱
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

  return <ProfileHeader user={userData} stats={stats} />
}

/**
 * 用户个人主页页面组件
 *
 * @性能优化 关键改进:
 * 1. 使用 Suspense 分离 ProfileHeader 和 ProfileContent
 * 2. ProfileHeader 优先渲染（关键路径）
 * 3. ProfileContent 流式传输（非关键）
 * 4. 避免级联数据获取阻塞
 */
export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
      <div className="max-w-4xl mx-auto fade-in-up">
        {/* 个人资料头部 - 使用 Suspense 优先渲染 */}
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeaderData userId={userId} />
        </Suspense>

        {/* 标签页状态管理Provider */}
        <ProfileTabsProvider defaultTab="content">
          {/* 标签页切换 */}
          <ProfileTabs />

          {/* 我的内容区域 - 使用 Suspense 流式传输 */}
          <ProfileTabContent tab="content">
            <Suspense fallback={<ProfileContentSkeleton />}>
              <ProfileContent userId={userId} />
            </Suspense>
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
