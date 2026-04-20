/**
 * 用户模块类型定义
 * @module types/user
 * @description 集中管理用户相关的所有类型定义
 */

import { User as SupabaseUser } from '@supabase/supabase-js'

// ============================================
// 基础用户类型
// ============================================

/**
 * 简化用户对象接口
 * @interface SimpleUser
 * @description 用于组件间传递的简化用户对象，避免直接依赖 Supabase User 类型
 */
export interface SimpleUser {
  /** 用户唯一标识 */
  id: string
  /** 用户邮箱 */
  email: string
  /** 用户元数据 */
  user_metadata?: {
    /** 用户名 */
    username?: string
    /** 头像URL（兼容字段，不作为主展示源） */
    avatar_url?: string
  }
}

/**
 * 用户资料接口
 * @interface UserProfile
 * @description 从 profiles 表获取的用户资料数据
 */
export interface UserProfile {
  /** 用户唯一标识 */
  id: string
  /** 用户邮箱 */
  email: string
  /** 用户名 */
  username: string
  /** 头像URL（主展示源，来自 profiles.avatar_url） */
  avatar_url: string
}

/**
 * 简化用户资料接口
 * @interface SimpleUserProfile
 * @description 用于显示的用户资料基本信息
 */
export interface SimpleUserProfile {
  /** 用户名 */
  username?: string
  /** 头像URL（主展示源，来自 profiles.avatar_url） */
  avatar_url?: string
}

// ============================================
// 组件 Props 类型
// ============================================

/**
 * 用户资料区域组件属性接口
 * @interface UserProfileSectionProps
 * @description UserProfileSection 组件的属性定义
 */
export interface UserProfileSectionProps {
  /** 当前用户（支持SupabaseUser或简化用户对象） */
  user?: SupabaseUser | SimpleUser | null
  /** 用户资料（从profiles表获取，优先级高于user.user_metadata） */
  profile?: SimpleUserProfile | null
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 用户下拉菜单组件属性接口
 * @interface UserDropdownMenuProps
 * @description UserDropdownMenu 组件的属性定义
 */
export interface UserDropdownMenuProps {
  /** 当前用户（支持SupabaseUser或简化用户对象） */
  user?: SupabaseUser | SimpleUser | null
  /** 是否打开 */
  isOpen: boolean
  /** 关闭菜单的回调 */
  onClose: () => void
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 下拉菜单项接口
 * @interface DropdownItem
 * @description 下拉菜单中的单个菜单项定义
 */
export interface DropdownItem {
  /** 菜单项标签 */
  label: string
  /** 菜单项图标组件 */
  icon: React.ElementType
  /** 站内路由（可选） */
  href?: string
  /** 站外链接（可选，如新标签打开飞书表单） */
  externalUrl?: string
  /** 是否为危险操作 */
  isDanger?: boolean
  /** 点击回调（可选） */
  onClick?: () => void
}

// ============================================
// 用户显示信息类型
// ============================================

/**
 * 用户显示信息接口
 * @interface UserDisplayInfo
 * @description 用于页面显示的用户信息整合对象
 */
export interface UserDisplayInfo {
  /** 用户唯一标识 */
  id: string
  /** 显示用的用户名 */
  username: string
  /** 头像URL（展示层字段；为空时由头像组件回退首字母） */
  avatarUrl: string | null
  /** 用户简介 */
  bio: string | null
  /** 用户位置 */
  location: string | null
  /** 加入日期字符串 */
  joinDate: string
  /** 用户邮箱 */
  email?: string
  /** 个人领域数组 */
  domain?: string[] | null
  /** 用户角色 */
  role?: 'user' | 'admin' | 'super_admin'
  /** 用户等级 1-12 */
  level?: number
}

/**
 * 用户统计数据接口
 * @interface UserStats
 * @description 用户相关的统计数据
 */
export interface UserStats {
  /** 文章数量 */
  articles: number
  /** 关注者数量 */
  followers: number
  /** 获赞数量 */
  likes: number
  /** 收藏数量 */
  favorites: number
}
