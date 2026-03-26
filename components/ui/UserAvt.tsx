'use client'

import Image from 'next/image'
import { useState } from 'react'
import { JSX } from 'react'

/**
 * 头像组件
 *
 * @module components/ui/UserAvt
 * @description 统一显示用户头像，优先显示真实图片，失败时回退到首字母
 *
 * 统一规范：
 * - 优先显示用户上传的真实头像图片
 * - 图片加载失败时显示首字母占位符
 * - 不使用固定默认图（Dicebear），保持简洁
 * - 尺寸：40(小) / 64(中) / 96(大) / 128(超大)
 */

/**
 * 头像尺寸映射
 */
const SIZE_MAP = {
  xs: { px: 24, class: 'w-6 h-6 text-xs' },
  sm: { px: 40, class: 'w-10 h-10 text-sm' },
  md: { px: 64, class: 'w-16 h-16 text-xl' },
  lg: { px: 96, class: 'w-24 h-24 text-3xl' },
  xl: { px: 128, class: 'w-32 h-32 text-4xl' },
} as const

type AvatarSize = keyof typeof SIZE_MAP

/**
 * UserAvt Props
 */
interface UserAvtProps {
  /** 用户名（用于首字母显示和 alt 文本） */
  name: string
  /** 用户ID（用于标识） */
  userId?: string
  /** 头像URL（用户自定义头像，优先使用） */
  avatarUrl?: string | null
  /** 尺寸：sm(40px) / md(64px) / lg(96px) / xl(128px)，默认 md */
  size?: AvatarSize
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 头像组件
 *
 * @param {UserAvtProps} props - 组件属性
 * @returns {JSX.Element} 头像组件
 *
 * @example
 * <UserAvt name="张三" userId="user-123" avatarUrl="https://example.com/avatar.jpg" size="sm" />
 *
 * @example
 * <UserAvt name="李四" userId="user-456" size="md" />
 */
export function UserAvt({
  name,
  avatarUrl,
  size = 'md',
  className = '',
}: UserAvtProps): JSX.Element {
  const { px, class: sizeClass } = SIZE_MAP[size]
  const initial = name.charAt(0).toUpperCase()

  /**
   * 图片加载错误状态
   * 用于处理真实头像图片加载失败的情况
   */
  const [imgError, setImgError] = useState(false)

  /**
   * 判断是否为有效的真实头像URL
   * 排除空值、undefined、以及自动生成的 Dicebear URL
   */
  const isRealAvatar = (() => {
    if (!avatarUrl || avatarUrl.trim().length === 0) {
      return false
    }
    {/* 排除 Dicebear 自动生成的头像URL */}
    if (avatarUrl.includes('dicebear.com')) {
      return false
    }
    return true
  })()

  /**
   * 头像显示逻辑：
   * 1. 有真实头像URL且图片未加载失败 → 显示图片
   * 2. 无真实头像或图片加载失败 → 显示首字母占位符
   *
   * 注意：不使用固定默认图，保持简洁和一致性
   */

  {/* 情况1：显示首字母占位符（无真实头像或图片加载失败） */}
  if (!isRealAvatar || imgError) {
    return (
      <div
        className={`rounded-full bg-xf-primary flex items-center justify-center text-white font-bold ${sizeClass} ${className}`}
      >
        {initial}
      </div>
    )
  }

  {/* 情况2：显示真实头像图片 */}
  return (
    <Image
      src={avatarUrl!}
      alt={name}
      width={px}
      height={px}
      className={`rounded-full object-cover ${sizeClass} ${className}`}
      onError={() => setImgError(true)}
      loading="eager"
    />
  )
}

/**
 * 向后兼容的别名导出
 * @deprecated 请使用 UserAvt
 */
export { UserAvt as AvatarPlaceholder }

/**
 * 向后兼容的别名导出
 * @deprecated 请使用 UserAvt
 */
export { UserAvt as UserAvatar }
