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
 *   - 支持查看他人思想轨迹
 *
 * @性能优化 P1: 使用 Suspense 分离关键/非关键数据，减少LCP时间
 * @性能优化 P2: ProfileContent 和 HeatMap 使用流式传输，不阻塞首屏渲染
 *
 * @SEO优化
 *   - 动态生成页面标题和描述
 *   - 包含 ProfilePage Schema 结构化数据
 *   - 优化社交分享卡片
 *
 * @隐私安全
 *   - 检查用户资料可见性设置
 *   - private: 仅自己可见
 *   - followers: 仅粉丝可见
 *   - public/community: 所有人可见
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
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
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/server'
import type { UserStats, UserDisplayInfo } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'

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
 * @param {SupabaseClient} supabase - Supabase 客户端实例（复用）
 * @returns {Promise<UserStats>} 用户统计数据
 */
async function getUserPublicStats(userId: string, supabase: SupabaseClient): Promise<UserStats> {
  const { data, error } = await supabase
    .from('profiles')
    .select('articles_count, followers_count, likes_received')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return { articles: 0, followers: 0, likes: 0, favorites: 0 }
  }

  // 查询用户收藏数量
  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    articles: data.articles_count || 0,
    followers: data.followers_count || 0,
    likes: data.likes_received || 0,
    favorites: favoritesCount || 0,
  }
}

/**
 * 检查用户资料可见性权限
 *
 * @param {string} targetUserId - 目标用户ID
 * @param {string | null} currentUserId - 当前登录用户ID
 * @param {SupabaseClient} supabase - Supabase 客户端实例（复用）
 * @returns {Promise<{ allowed: boolean; visibility?: string }>} 是否允许访问
 */
async function checkProfileVisibility(
  targetUserId: string,
  currentUserId: string | null,
  supabase: SupabaseClient
): Promise<{ allowed: boolean; visibility?: string }> {
  // 获取目标用户的可见性设置
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('visibility')
    .eq('id', targetUserId)
    .single()

  if (error || !profile) {
    return { allowed: false }
  }

  const visibility = profile.visibility

  // 自己访问自己，始终允许
  if (currentUserId === targetUserId) {
    return { allowed: true, visibility }
  }

  // 公开或社群可见性，允许访问
  if (visibility === 'public' || visibility === 'community') {
    return { allowed: true, visibility }
  }

  // 私密资料，不允许他人访问
  if (visibility === 'private') {
    return { allowed: false, visibility }
  }

  // 仅粉丝可见，需要检查关注关系
  if (visibility === 'followers') {
    // 未登录用户无法查看
    if (!currentUserId) {
      return { allowed: false, visibility }
    }

    // 查询是否已关注
    const { data: followRecord } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)
      .eq('status', 'active')
      .maybeSingle()

    if (followRecord) {
      return { allowed: true, visibility }
    }

    return { allowed: false, visibility }
  }

  return { allowed: true, visibility }
}

/**
 * 用户资料头部数据获取组件
 * @性能优化 独立获取关键路径数据，优先渲染
 * @param userId - 用户ID
 * @param supabase - Supabase 客户端实例（复用）
 */
async function ProfileHeaderData({ userId, supabase }: { userId: string; supabase: SupabaseClient }) {
  // 并行获取用户资料和统计数据
  const [profileResult, stats] = await Promise.all([
    supabase.from('profiles').select('*, level:user_level_records(level)').eq('id', userId).single(),
    getUserPublicStats(userId, supabase),
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
 * @安全说明
 * - 检查用户资料可见性设置
 * - private: 仅自己可见
 * - followers: 仅粉丝可见（未登录用户无法查看）
 * - public/community: 所有人可见
 *
 * @性能优化 关键改进:
 * 1. 使用 Suspense 分离 ProfileHeader 和 ProfileContent
 * 2. ProfileHeader 优先渲染（关键路径）
 * 3. ProfileContent 和 HeatMap 流式传输（非关键）
 * 4. 避免级联数据获取阻塞
 *
 * @统一认证 2026-03-30
 * - /profile（当前用户主页）认证检查在 layout.tsx
 * - /profile/[userId]（他人主页）可以匿名访问公开资料
 */
export default async function UserProfilePage({ params }: UserProfilePageProps) {
  // 获取当前用户（可能为 null，匿名访问）
  const currentUser = await getCurrentUser()

  const { userId } = await params

  // 创建一次 supabase 客户端供后续复用
  const supabase = await createClient()

  // 检查资料可见性权限
  const { allowed, visibility } = await checkProfileVisibility(userId, currentUser?.id || null, supabase)

  if (!allowed) {
    // 根据可见性返回不同的提示
    if (visibility === 'private') {
      // 私密用户，返回 404（不暴露用户存在）
      notFound()
    } else if (visibility === 'followers') {
      // 仅粉丝可见，重定向到提示页面或显示关注按钮
      // 暂时返回 404，后续可以优化为显示关注提示
      notFound()
    }
  }

  return (
    <>
      <main className="flex-1 h-full overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-10 pb-24 relative">
        <div className="max-w-4xl mx-auto fade-in-up">
          {/* 个人资料头部 - 使用 Suspense 优先渲染 */}
          <Suspense fallback={<ProfileHeaderSkeleton />}>
            <ProfileHeaderData userId={userId} supabase={supabase} />
          </Suspense>

        {/* 标签页状态管理Provider */}
        <ProfileTabsProvider defaultTab="content">
          {/* 标签页切换 - 他人主页显示"他的内容" */}
          <ProfileTabs isOwnProfile={false} />

          {/* 内容区域 - 使用 Suspense 流式传输 */}
          <ProfileTabContent tab="content">
            <Suspense fallback={<ProfileContentSkeleton />}>
              <ProfileContent userId={userId} />
            </Suspense>
          </ProfileTabContent>

          {/* 思想轨迹区域 - 灵感热力图 */}
          <ProfileTabContent tab="thought">
            <Suspense fallback={<HeatMapSkeleton />}>
              <HeatMap userId={userId} />
            </Suspense>
          </ProfileTabContent>

        </ProfileTabsProvider>
      </div>
    </main>
    </>
  )
}
