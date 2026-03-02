'use client'

/**
 * 头像占位符组件
 *
 * 作用: 显示用户头像占位符，使用纯色背景替代渐变色
 *
 * @param {string} name - 用户名，用于提取首字母显示
 * @param {number} size - 头像尺寸（像素），默认128
 * @param {string} className - 额外的CSS类名
 * @returns {JSX.Element} 头像占位符组件
 *
 * 使用说明:
 *   - 用于用户未上传头像时的默认显示
 *   - 自动提取用户名的首字母大写显示
 *   - 支持自定义尺寸
 *
 * 示例:
 *   <AvatarPlaceholder name="Felix" />
 *   <AvatarPlaceholder name="John" size={96} />
 *
 * 更新时间: 2026-03-02
 */

interface AvatarPlaceholderProps {
  name: string
  size?: number
  className?: string
}

export function AvatarPlaceholder({ name, size = 128, className = '' }: AvatarPlaceholderProps) {
  const initial = name.charAt(0).toUpperCase()
  const sizeClass = size === 128 ? 'w-32 h-32 text-4xl' : size === 96 ? 'w-24 h-24 text-3xl' : 'w-16 h-16 text-2xl'

  return (
    <div
      className={`rounded-full bg-xf-primary flex items-center justify-center text-white font-bold shadow-deep ring-4 ring-white ${sizeClass} ${className}`}
    >
      {initial}
    </div>
  )
}
