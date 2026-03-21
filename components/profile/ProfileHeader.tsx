'use client'

/**
 * 个人资料头部组件
 * 
 * 作用: 显示用户的头像、用户名、简介和操作按钮
 * 
 * 
 * @returns {JSX.Element} 个人资料头部组件
 * 
 * 使用说明:
 *   - 使用 Client Component 处理交互逻辑
 *   - 使用 Next Image 优化图片加载
 *   - 使用 lucide-react 图标组件
 * 
 * 更新时间: 2026-02-20
 */

import { UserPlus, UserCheck, MapPin, Star } from '@/components/icons'
import { useState } from 'react'
import { UserAvatar } from '@/components/ui'
import type { UserDisplayInfo } from '@/lib/user/getUserDisplayInfo'

/**
 * ProfileHeader Props 接口
 */
interface ProfileHeaderProps {
  user: UserDisplayInfo
}

/**
 * 个人资料头部组件
 * 
 * @function ProfileHeader
 * @param {ProfileHeaderProps} props - 组件属性
 * @returns {JSX.Element} 个人资料头部组件
 * 
 * @description
 * 提供个人资料头部的完整功能，包括：
 * - 用户头像（带在线状态指示器和星星徽章）
 * - 用户名和状态文本
 * - 位置信息
 * - 操作按钮（发消息、关注）
 * - 个人简介
 * - 用户标签
 * 
 * @layout
 * - 使用 flex 布局
 * - 响应式设计（移动端和桌面端）
 * - 所有间距完全复制原型数值
 */
export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="profile-header-bg rounded-2xl sm:rounded-4xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-soft">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 lg:gap-8">
        {/* 头像区域 */}
        <div className="relative">
          <div className="relative">
            <UserAvatar
              name={user.username}
              userId={user.id}
              avatarUrl={user.avatarUrl}
              size="xl"
              className="shadow-deep ring-4 ring-white w-20 h-20 sm:w-24 sm:h-24"
            />
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-r from-xf-accent to-xf-primary rounded-full flex items-center justify-center text-white">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* 个人信息 */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 sm:mb-4">
            <div>
              {/* 真实用户名 */}
              <h1 className="text-2xl sm:text-3xl font-serif text-xf-accent font-bold text-layer-1">
                {user.username}
              </h1>
              <p className="text-xs sm:text-sm text-xf-medium mt-1 sm:mt-2 flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                {user.location || '未设置位置'} · 加入于 {user.joinDate}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-3 md:mt-0 justify-center md:justify-start">
              <button
                onClick={handleFollowClick}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center gap-2 text-sm sm:text-base ${
                  isFollowing
                    ? 'bg-xf-light text-xf-medium border border-xf-bg/60'
                    : 'bg-xf-accent text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    已关注
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    关注
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 个人简介 */}
          <div className="bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-5 mt-3 sm:mt-4">
            <p className="text-sm sm:text-base text-xf-dark/80 leading-relaxed">
              {user.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
