'use client'

import Image from 'next/image'

/**
 * 头像组件
 *
 * 作用: 统一显示用户头像，支持头像URL和首字母回退
 *
 * @param {string} name - 用户名，用于提取首字母显示（无头像时）
 * @param {string} avatarUrl - 头像图片URL（可选）
 * @param {number} size - 头像尺寸（像素），默认128
 * @param {string} className - 额外的CSS类名
 * @returns {JSX.Element} 头像组件
 *
 * 使用说明:
 *   - 优先显示 avatarUrl 指定的头像图片
 *   - 无头像时显示用户名的首字母大写
 *   - 支持自定义尺寸
 *   - 使用 Next Image 优化图片加载
 *
 * 示例:
 *   <AvatarPlaceholder name="Felix" avatarUrl="https://..." />
 *   <AvatarPlaceholder name="John" size={96} />
 *
 * 更新时间: 2026-03-07
 */

interface AvatarPlaceholderProps {
  name: string
  avatarUrl?: string
  size?: number
  className?: string
}

export function AvatarPlaceholder({ name, avatarUrl, size = 128, className = '' }: AvatarPlaceholderProps) {
  const initial = name.charAt(0).toUpperCase()
  const sizeClass = size === 128 ? 'w-32 h-32 text-4xl' : size === 96 ? 'w-24 h-24 text-3xl' : size === 80 ? 'w-20 h-20 text-2xl' : 'w-16 h-16 text-xl'
  const pixelSize = size === 128 ? 128 : size === 96 ? 96 : size === 80 ? 80 : 64

  {/* 有头像URL时显示图片 */}
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={pixelSize}
        height={pixelSize}
        className={`rounded-full shadow-deep ring-4 ring-white object-cover ${sizeClass} ${className}`}
        unoptimized={avatarUrl.includes('dicebear.com')}
      />
    )
  }

  {/* 无头像时显示首字母占位符 */}
  return (
    <div
      className={`rounded-full bg-xf-primary flex items-center justify-center text-white font-bold shadow-deep ring-4 ring-white ${sizeClass} ${className}`}
    >
      {initial}
    </div>
  )
}
