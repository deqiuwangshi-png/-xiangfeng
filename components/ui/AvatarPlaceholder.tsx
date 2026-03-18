'use client'

import Image from 'next/image'
import { getAvtUrl, isDicebearUrl } from '@/lib/utils/getAvtUrl'
import { JSX } from 'react'

/**
 * 头像组件
 *
 * @module components/ui/AvatarPlaceholder
 * @description 统一显示用户头像，支持 Dicebear micah 风格和首字母回退
 *
 * 统一规范：
 * - 头像风格：Dicebear micah
 * - 背景颜色：B6CAD7
 * - 无头像时：显示用户名首字母
 * - 尺寸：40(小) / 64(中) / 96(大) / 128(超大)
 */

/**
 * 头像尺寸映射
 */
const SIZE_MAP = {
  sm: { px: 40, class: 'w-10 h-10 text-sm' },
  md: { px: 64, class: 'w-16 h-16 text-xl' },
  lg: { px: 96, class: 'w-24 h-24 text-3xl' },
  xl: { px: 128, class: 'w-32 h-32 text-4xl' },
} as const

type AvatarSize = keyof typeof SIZE_MAP

/**
 * AvatarPlaceholder Props
 */
interface AvatarPlaceholderProps {
  /** 用户名（用于首字母显示和 alt 文本） */
  name: string
  /** 用户ID（用于生成 Dicebear 头像） */
  userId?: string
  /** 自定义头像URL（优先级高于自动生成） */
  avatarUrl?: string
  /** 尺寸：sm(40px) / md(64px) / lg(96px) / xl(128px)，默认 md */
  size?: AvatarSize
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 头像组件
 *
 * @param {AvatarPlaceholderProps} props - 组件属性
 * @returns {JSX.Element} 头像组件
 *
 * @example
 * <AvatarPlaceholder name="张三" userId="user-123" size="sm" />
 *
 * @example

 * <AvatarPlaceholder name="李四" avatarUrl="https://example.com/avatar.jpg" size="lg" />
 *
 * @example

 <AvatarPlaceholder name="王五" size="md" />
 */
export function AvatarPlaceholder({
  name,
  userId,
  avatarUrl,
  size = 'md',
  className = '',
}: AvatarPlaceholderProps): JSX.Element {
  const { px, class: sizeClass } = SIZE_MAP[size]
  const initial = name.charAt(0).toUpperCase()

  {/* 确定最终显示的头像URL */}
  const finalAvatarUrl = avatarUrl || (userId ? getAvtUrl(userId) : null)

  {/* 有头像URL时显示图片 */}
  if (finalAvatarUrl) {
    return (
      <Image
        src={finalAvatarUrl}
        alt={name}
        width={px}
        height={px}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
        unoptimized={isDicebearUrl(finalAvatarUrl)}
        loading="eager"
        priority={isDicebearUrl(finalAvatarUrl)}
      />
    )
  }

  {/* 无头像时显示首字母占位符 */}
  return (
    <div
      className={`rounded-full bg-xf-primary flex items-center justify-center text-white font-bold ${sizeClass} ${className}`}
    >
      {initial}
    </div>
  )
}
